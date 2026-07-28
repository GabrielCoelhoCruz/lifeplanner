/**
 * verify-context-migration.ts
 *
 * Read-only verification that the backfill migration (0003) completed
 * correctly. Exits with code 0 if every project has a valid context_id and
 * ownership is valid, and the final schema constraints are present; exits with
 * code 1 otherwise.
 *
 * Usage:
 *   npm run db:verify-contexts
 *
 * Environment:
 *   DATABASE_URL must be set by the caller.
 *
 * Expected output (example):
 *   ✓ All 4 projects have a context_id
 *   ✓ All 4 context_id values reference an existing context
 *   ✓ Record counts match: projects=4, tasks=15, items=12
 *   ✓ Context backfill verified successfully
 */

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
    throw new Error('DATABASE_URL is required')
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
    throw new Error('context_id column not found; migration has not been applied')
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

  // 3. Verify project/context ownership is consistent
  const [ownership] = await sql`
    SELECT COUNT(*)::int AS cnt
    FROM projects p
    JOIN contexts c ON p.context_id = c.id
    WHERE p.user_id <> c.user_id
  `
  if (ownership.cnt === 0) {
    ok(`Every project references a context owned by the same user`)
  } else {
    fail(`${ownership.cnt} project(s) reference another user's context`)
  }

  // 4. Count total records
  const [counts] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM projects)  AS projects,
      (SELECT COUNT(*)::int FROM tasks)     AS tasks,
      (SELECT COUNT(*)::int FROM items)     AS items
  `

  ok(
    `Record counts: projects=${counts.projects}, tasks=${counts.tasks}, items=${counts.items}`,
  )

  // 5. Verify the final schema state
  const [schemaState] = await sql`
    SELECT
      (SELECT is_nullable = 'NO'
         FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'projects'
          AND column_name = 'context_id') AS context_id_not_null,
      NOT EXISTS (
        SELECT 1
          FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'projects'
           AND column_name = 'context'
      ) AS legacy_context_removed
  `
  if (schemaState.context_id_not_null) ok(`projects.context_id is NOT NULL`)
  else fail(`projects.context_id is still nullable`)

  if (schemaState.legacy_context_removed) ok(`Legacy projects.context column is removed`)
  else fail(`Legacy projects.context column still exists`)

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
