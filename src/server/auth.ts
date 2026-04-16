import { db } from './db'
import { sql } from 'drizzle-orm'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

/**
 * Validates a userId against the Neon Auth user table.
 *
 * This is a pragmatic approach while we migrate to signed-token cross-domain auth.
 * The client (authenticated via Better Auth cookies on the auth subdomain) passes its userId
 * as part of each server function call. The server confirms the userId exists as a real
 * Better Auth user before serving data.
 *
 * Security note: this provides multi-user data isolation but not cryptographic auth —
 * a malicious actor who knows another user's UUID could access their data.
 * TODO: migrate to signed session verification once cross-domain cookies are configured.
 */
export async function requireUser(userId: string | undefined): Promise<AuthUser> {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Não autenticado')
  }

  const rows = (await db.execute(
    sql`SELECT id, email, name, image FROM neon_auth."user" WHERE id = ${userId} LIMIT 1`,
  )) as unknown as {
    rows?: Array<{ id: string; email: string; name: string | null; image: string | null }>
  } & Array<{ id: string; email: string; name: string | null; image: string | null }>

  // Drizzle neon-http returns either an array or an object with .rows
  const results = Array.isArray(rows) ? rows : (rows.rows ?? [])
  const user = results[0]
  if (!user) throw new Error('Usuário não encontrado')
  return user
}
