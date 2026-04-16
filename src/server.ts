import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

/**
 * Upstream Neon Auth (Better Auth) base URL.
 *
 * The auth service is hosted on a different subdomain than this app. Proxying
 * `/api/auth/*` through our domain lets Better Auth set session cookies on OUR
 * origin, so they flow automatically to server functions.
 */
const AUTH_UPSTREAM =
  process.env.VITE_NEON_AUTH_URL ?? process.env.NEON_AUTH_URL

/**
 * Rewrite Set-Cookie headers coming back from the auth upstream so cookies are
 * scoped to the app domain (not the auth subdomain).
 *
 * - Strip any `Domain=...` attribute (cookie defaults to current host).
 * - Preserve `SameSite=Lax` and `Secure` — Better Auth already sets them, but
 *   we re-assert them if missing to keep the session usable in modern browsers.
 */
function rewriteSetCookie(value: string): string {
  // Remove Domain=...; (case-insensitive, with or without trailing semicolon)
  let out = value.replace(/;\s*Domain=[^;]+/gi, '')

  if (!/;\s*SameSite=/i.test(out)) {
    out += '; SameSite=Lax'
  }
  // Only force Secure over https — if the upstream didn't set it and we're
  // behind https (Vercel) the cookie still works; we don't force it for
  // localhost http dev because Secure cookies aren't sent over http.
  return out
}

async function handleAuthProxy(request: Request): Promise<Response> {
  if (!AUTH_UPSTREAM) {
    return new Response('VITE_NEON_AUTH_URL not set', { status: 500 })
  }

  const url = new URL(request.url)
  // Path after "/api/auth/" — Better Auth routes like "get-session",
  // "sign-in/email", "callback/google", etc.
  const suffix = url.pathname.replace(/^\/api\/auth\/?/, '')
  const upstreamBase = AUTH_UPSTREAM.replace(/\/$/, '')
  const upstreamUrl = `${upstreamBase}/${suffix}${url.search}`
  const upstreamOrigin = new URL(upstreamBase).origin

  // Forward method + headers + body. Strip hop-by-hop headers; rewrite
  // Origin/Referer so Better Auth's trustedOrigins check sees a same-origin
  // call instead of our app domain (the upstream only trusts its own domain).
  const stripHeaders = new Set([
    'host',
    'connection',
    'content-length',
    'accept-encoding',
  ])
  const forwardedHeaders = new Headers()
  request.headers.forEach((val, key) => {
    const lower = key.toLowerCase()
    if (stripHeaders.has(lower)) return
    if (lower === 'origin' || lower === 'referer') return
    forwardedHeaders.set(key, val)
  })
  forwardedHeaders.set('origin', upstreamOrigin)
  forwardedHeaders.set('referer', `${upstreamOrigin}/`)

  const init: RequestInit = {
    method: request.method,
    headers: forwardedHeaders,
    redirect: 'manual',
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer()
  }

  const upstreamRes = await fetch(upstreamUrl, init)

  // Clone response headers, rewriting Set-Cookie so the browser stores the
  // cookie on the app domain instead of the auth subdomain.
  const outHeaders = new Headers()
  upstreamRes.headers.forEach((val, key) => {
    if (key.toLowerCase() === 'set-cookie') return // handled below
    outHeaders.set(key, val)
  })

  // Web Headers collapses multiple Set-Cookie entries; grab them raw when possible.
  const rawSetCookies: Array<string> =
    // Node/undici exposes getSetCookie on Headers
    typeof (upstreamRes.headers as unknown as { getSetCookie?: () => string[] })
      .getSetCookie === 'function'
      ? (
          upstreamRes.headers as unknown as { getSetCookie: () => string[] }
        ).getSetCookie()
      : upstreamRes.headers.get('set-cookie')
        ? [upstreamRes.headers.get('set-cookie') as string]
        : []

  for (const cookie of rawSetCookies) {
    outHeaders.append('set-cookie', rewriteSetCookie(cookie))
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: outHeaders,
  })
}

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/auth/') || url.pathname === '/api/auth') {
      return handleAuthProxy(request)
    }
    return handler.fetch(request)
  },
})
