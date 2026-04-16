import { createAuthClient } from '@neondatabase/neon-js/auth'
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react'

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL

if (!AUTH_URL) {
  throw new Error(
    'VITE_NEON_AUTH_URL is not set. Add it to your .env file and Vercel project settings.',
  )
}

export const authClient = createAuthClient(AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
})
