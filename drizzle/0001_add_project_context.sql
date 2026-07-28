ALTER TABLE "projects"
ADD COLUMN IF NOT EXISTS "context" text DEFAULT 'Pessoal' NOT NULL;
