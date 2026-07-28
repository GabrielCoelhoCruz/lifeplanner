-- Release 1, Task 1.1: first-class work contexts.
-- Adds a normalized `contexts` table and a nullable FK on projects.
-- The legacy free-text `projects.context` column is intentionally KEPT until all
-- readers and writers move to `context_id` (Task 1.4). Do not drop it here.

CREATE TABLE IF NOT EXISTS "contexts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL,
  "name" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "color" text NOT NULL,
  "icon" text,
  "position" integer DEFAULT 0 NOT NULL,
  "archived_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Case-insensitive per-user uniqueness on context name.
CREATE UNIQUE INDEX IF NOT EXISTS "contexts_user_lower_name_unq"
  ON "contexts" ("user_id", lower("name"));

-- Nullable FK so the legacy column can be backfilled incrementally.
ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "context_id" uuid
  REFERENCES "contexts" ("id") ON DELETE RESTRICT;
