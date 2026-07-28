import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Server-function modules are transformed for the browser as well. Avoid
// evaluating Neon with an unavailable server secret in that client-side stub.
const databaseUrl = import.meta.env.SSR
  ? process.env.DATABASE_URL!
  : 'postgresql://client-stub@localhost/client-stub'
const sql = neon(databaseUrl)
export const db = drizzle(sql, { schema })
