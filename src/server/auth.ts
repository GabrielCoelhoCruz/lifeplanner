import { getRequest } from '@tanstack/react-start/server'

const AUTH_URL = process.env.VITE_NEON_AUTH_URL

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

/**
 * Reads the session from the incoming request's cookies by calling
 * Better Auth's /get-session endpoint. Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!AUTH_URL) {
    throw new Error('VITE_NEON_AUTH_URL not configured on the server')
  }

  let cookieHeader: string | null = null
  try {
    const req = getRequest()
    cookieHeader = req?.headers?.get('cookie') ?? null
  } catch {
    // Outside a request context (e.g. build-time)
    return null
  }
  if (!cookieHeader) return null

  try {
    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: { cookie: cookieHeader },
      // Ensure we don't cache session lookups
      cache: 'no-store',
    })
    if (!res.ok) return null

    const data = (await res.json()) as { user?: AuthUser } | null
    return data?.user ?? null
  } catch (err) {
    console.error('getCurrentUser error:', err)
    return null
  }
}

/**
 * Gets the current user or throws. Use inside server functions that require auth.
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    const err = new Error('Unauthorized')
    // @ts-expect-error — status hint for better error responses
    err.status = 401
    throw err
  }
  return user
}
