-- Task 1.4: Finish normalized project context migration.
--
-- This migration deliberately fails before changing the schema if any project
-- is missing a context or references a context owned by another user. Run
-- `npm run db:verify-contexts` before applying it.

BEGIN;

DO $$
DECLARE
  missing_count bigint;
  ownership_mismatch_count bigint;
BEGIN
  SELECT COUNT(*)
    INTO missing_count
    FROM projects
   WHERE context_id IS NULL;

  IF missing_count > 0 THEN
    RAISE EXCEPTION
      'Cannot remove projects.context: % project(s) have no context_id',
      missing_count;
  END IF;

  SELECT COUNT(*)
    INTO ownership_mismatch_count
    FROM projects p
    JOIN contexts c ON c.id = p.context_id
   WHERE c.user_id <> p.user_id;

  IF ownership_mismatch_count > 0 THEN
    RAISE EXCEPTION
      'Cannot remove projects.context: % project(s) reference a context owned by another user',
      ownership_mismatch_count;
  END IF;
END
$$;

ALTER TABLE "projects"
  ALTER COLUMN "context_id" SET NOT NULL;

ALTER TABLE "projects"
  DROP COLUMN IF EXISTS "context";

COMMIT;
