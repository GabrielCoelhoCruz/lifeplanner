import { getRequest } from '@tanstack/react-start/server'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

/**
 * Reads the current user from the Better Auth session cookie.
 *
 * The cookie is set on the app domain (thanks to the `/api/auth/*` proxy in
 * `src/server.ts`), so it flows to every server function automatically. We
 * forward the cookie to the upstream Auth endpoint's `/get-session` and trust
 * its cryptographic validation — no shared secret required.
 */
export async function requireUser(): Promise<AuthUser> {
  const req = getRequest()
  const cookie = req?.headers?.get('cookie') ?? ''
  if (!cookie) throw new Error('Não autenticado')

  const upstream = process.env.VITE_NEON_AUTH_URL ?? process.env.NEON_AUTH_URL
  if (!upstream) throw new Error('VITE_NEON_AUTH_URL not set')

  const res = await fetch(`${upstream.replace(/\/$/, '')}/get-session`, {
    headers: {
      cookie,
      origin: req?.headers?.get('origin') ?? '',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Não autenticado')

  const data = (await res.json()) as { user?: AuthUser } | null
  const user = data?.user
  if (!user) throw new Error('Não autenticado')
  return user
}
