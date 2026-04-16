import { neon } from '@neondatabase/serverless'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

// Lazy Neon client for the neon_auth schema.
// We use the raw serverless driver to avoid coupling with Drizzle's schema builder
// for tables we don't own (neon_auth.user is managed by Neon Auth / Better Auth).
let sqlClient: ReturnType<typeof neon> | null = null
function getSql() {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL not configured')
    sqlClient = neon(url)
  }
  return sqlClient
}

/**
 * Validates a userId against the Neon Auth user table and returns the user.
 *
 * Pragmatic cross-domain workaround: the Better Auth session cookie is set on the
 * auth subdomain and is not readable by this app. The client (which does hold the
 * session) sends its userId as part of each server function call. We confirm the
 * userId corresponds to a real Better Auth user before serving data.
 *
 * Trade-off: provides per-user data isolation but not cryptographic proof of identity.
 * A malicious actor with knowledge of another user's UUID could access their data.
 *
 * TODO: upgrade to signed session verification by either (a) proxying auth through
 * this app's domain, (b) enabling Better Auth's Bearer plugin, or (c) issuing a JWT.
 */
export async function requireUser(userId: string | undefined): Promise<AuthUser> {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Não autenticado')
  }

  const sql = getSql()
  const rows = (await sql`
    SELECT id, email, name, image
    FROM neon_auth."user"
    WHERE id = ${userId}
    LIMIT 1
  `) as Array<{
    id: string
    email: string
    name: string | null
    image: string | null
  }>

  const user = rows[0]
  if (!user) throw new Error('Usuário não encontrado')
  return user
}
