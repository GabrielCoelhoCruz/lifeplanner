-- Task 1.2: Backfill project context references
--
-- For every project that doesn't yet have context_id, create (or reuse) a context
-- record keyed on (user_id, normalized label) and populate the foreign key.
-- Empty or whitespace-only labels become "Pessoal".
--
-- The unique index contexts_user_lower_name_unq prevents duplicates so we can
-- safely INSERT … ON CONFLICT … DO NOTHING.
--
-- After running this migration, run:
--   npm run db:verify-contexts
-- If the verify script reports zero orphans, the NOT NULL constraint on
-- projects.context_id may be added (see comment at the bottom of this file).

BEGIN;

-- 1. Insert one context row per (user_id, normalized_name) that does not
--    already exist. The expression-index conflict target makes reruns safe.
INSERT INTO contexts (user_id, name, color)
SELECT DISTINCT ON (p.user_id, LOWER(normalized.name))
    p.user_id,
    normalized.name,
    CASE
      WHEN LOWER(normalized.name) = 'learned hand' THEN '#6366F1'
      WHEN LOWER(normalized.name) = 'cia'          THEN '#10B981'
      WHEN LOWER(normalized.name) = 'pxg'          THEN '#F59E0B'
      WHEN LOWER(normalized.name) = 'pessoal'      THEN '#8B5CF6'
      ELSE '#6366F1'
    END
FROM projects p
CROSS JOIN LATERAL (
  SELECT COALESCE(
    NULLIF(TRIM(REGEXP_REPLACE(COALESCE(p.context, ''), '\s+', ' ', 'g')), ''),
    'Pessoal'
  ) AS name
) normalized
WHERE p.context_id IS NULL
ON CONFLICT (user_id, (LOWER(name))) DO NOTHING;

-- 2. Update every project row with the matching context_id. This is a separate
--    statement so PostgreSQL can see contexts inserted above.
UPDATE projects p
SET context_id = c.id
FROM contexts c
WHERE p.context_id IS NULL
  AND c.user_id = p.user_id
  AND LOWER(c.name) = LOWER(
    COALESCE(
      NULLIF(TRIM(REGEXP_REPLACE(COALESCE(p.context, ''), '\s+', ' ', 'g')), ''),
      'Pessoal'
    )
  );

COMMIT;

-- ---------------------------------------------------------------------------
-- After verification (npm run db:verify-contexts) has confirmed zero orphans,
-- run the following to make the foreign-key mandatory:
--
--   ALTER TABLE "projects" ALTER COLUMN "context_id" SET NOT NULL;
--
-- This statement is intentionally NOT included here so that the migration
-- itself never leaves the DB in a state where data cannot be inserted.
-- ---------------------------------------------------------------------------
