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

-- 1. Normalisation helper: trim and collapse internal whitespace.
--    Empty strings (or whitespace only) → 'Pessoal'.
WITH norm AS (
  SELECT
    p.user_id,
    p.id AS project_id,
    CASE
      WHEN TRIM(p.context) = '' THEN 'Pessoal'
      ELSE TRIM(REGEXP_REPLACE(p.context, '\s+', ' ', 'g'))
    END AS name
  FROM projects p
  WHERE p.context_id IS NULL
),

-- 2. Insert one context row per (user_id, normalized_name) that doesn't
--    already exist.  Because the unique index covers (user_id, lower(name))
--    we can use a simple anti-join to avoid conflicts.
inserted AS (
  INSERT INTO contexts (user_id, name, color)
  SELECT DISTINCT
    n.user_id,
    n.name,
    CASE
      WHEN LOWER(n.name) = 'learned hand' THEN '#6366F1'
      WHEN LOWER(n.name) = 'cia'          THEN '#10B981'
      WHEN LOWER(n.name) = 'pxg'          THEN '#F59E0B'
      WHEN LOWER(n.name) = 'pessoal'      THEN '#8B5CF6'
      ELSE '#6366F1'
    END
  FROM norm n
  WHERE NOT EXISTS (
    SELECT 1 FROM contexts c
    WHERE c.user_id = n.user_id
      AND LOWER(c.name) = LOWER(n.name)
  )
  RETURNING id, user_id, name
)

-- 3. Update every project row with the matching context_id.
UPDATE projects p
SET context_id = c.id
FROM norm n
JOIN contexts c ON c.user_id = n.user_id AND LOWER(c.name) = LOWER(n.name)
WHERE p.id = n.project_id
  AND p.context_id IS NULL;

-- ---------------------------------------------------------------------------
-- After verification (npm run db:verify-contexts) has confirmed zero orphans,
-- run the following to make the foreign-key mandatory:
--
--   ALTER TABLE "projects" ALTER COLUMN "context_id" SET NOT NULL;
--
-- This statement is intentionally NOT included here so that the migration
-- itself never leaves the DB in a state where data cannot be inserted.
-- ---------------------------------------------------------------------------
