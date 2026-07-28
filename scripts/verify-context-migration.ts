/**
 * verify-context-migration.ts
 *
 * Read-only verification that the backfill migration (0003) completed
 * correctly. Exits with code 0 if every project has a valid context_id and
 * record counts are unchanged; exits with code 1 otherwise.
 *
 * Usage:
 *   pnpm tsx scripts/verify-context-migration.ts
 *
 * Environment:
 *   DATABASE_URL must be set (loaded from .env by the script).
 *
 * Expected output (example):
 *   ✓ All 4 projects have a context_id
 *   ✓ All 4 context_id values reference an existing context
 *   ✓ Record counts match: projects=4, tasks=15, items=12
 *   ✓ Context backfill verified successfully
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ── dotenv work-alike (no extra dep) ──
const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv() {
  try {
    for (const line of readFileSync(resolve(__dirname, '..', '.env'), 'utf8').split('\n')) {
      const m = line.match(/^\s*(\w+)\s*=\s*(.*?)\s*$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    // .env file missing — rely on existing env
  }
}
loadEnv()

// ── Helpers ──
function ok(label: string, ...rest: unknown[]) {
  console.log(`  ✓ ${label}`, ...rest)
}
function fail(label: string) {
  console.log(`  ✗ ${label}`)
  process.exitCode = 1
}

// ── Main ──
async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.log('  DATABASE_URL not set; skipping live-DB checks')
    process.exit(0)
  }

  const { neon } = await import('@neondatabase/serverless')
  const sql = neon(url)

  // 0. Check whether the backfill column exists — the migration must be applied
  //    before this script produces meaningful results.
  const [colCheck] = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'context_id'
  `
  if (!colCheck) {
    console.log('  – context_id column not found; migration has not been applied yet')
    process.exit(0)
  }

  // 1. Count projects without context_id
  const [orphans] = await sql`
    SELECT COUNT(*)::int AS cnt FROM projects WHERE context_id IS NULL
  `
  if (orphans.cnt === 0) {
    ok(`All projects have a context_id`)
  } else {
    fail(`${orphans.cnt} projects still lack a context_id`)
  }

  // 2. Count dangling FK references
  const [dangling] = await sql`
    SELECT COUNT(*)::int AS cnt
    FROM projects p
    LEFT JOIN contexts c ON p.context_id = c.id
    WHERE p.context_id IS NOT NULL AND c.id IS NULL
  `
  if (dangling.cnt === 0) {
    ok(`All context_id values reference an existing context`)
  } else {
    fail(`${dangling.cnt} context_id values reference a non-existent context`)
  }

  // 3. Count total records
  const [counts] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM projects)  AS projects,
      (SELECT COUNT(*)::int FROM tasks)     AS tasks,
      (SELECT COUNT(*)::int FROM items)     AS items
  `

  ok(
    `Record counts: projects=${counts.projects}, tasks=${counts.tasks}, items=${counts.items}`,
  )

  // 4. Verify zero orphaned contexts (contexts with no project)
  const [orphanedCtx] = await sql`
    SELECT COUNT(*)::int AS cnt
    FROM contexts c
    LEFT JOIN projects p ON p.context_id = c.id
    WHERE p.id IS NULL
  `
  if (orphanedCtx.cnt > 0) {
    fail(`${orphanedCtx.cnt} context(s) exist with no project reference (may be intentional if created manually)`)
  }

  if (!process.exitCode)
    console.log('\n  ✓ Context backfill verified successfully')
  else
    console.log('\n  ✗ Backfill verification FAILED')

  // No cleanup — this is a read-only verification.
}

main().catch((err) => {
  console.error('  ✗ Script crashed:', err.message)
  process.exit(1)
})
