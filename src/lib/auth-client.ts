import { createAuthClient } from '@neondatabase/neon-js/auth'
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react'

/**
 * On the browser we talk to our own origin at `/api/auth/*`, which is proxied
 * to the upstream Neon Auth endpoint by `src/server.ts`. This keeps session
 * cookies on the app domain, so they flow to server functions automatically.
 *
 * On the server (SSR / build introspection) we fall back to the upstream URL.
 */
const AUTH_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/auth`
    : (import.meta.env.VITE_NEON_AUTH_URL ?? '/api/auth')

if (!AUTH_URL) {
  throw new Error(
    'VITE_NEON_AUTH_URL is not set. Add it to your .env file and Vercel project settings.',
  )
}

export const authClient = createAuthClient(AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
})
