# Taski Two-Company Master Planner — Implementation Notes

Working journal for the two-company master planner initiative. The authoritative
plan lives at `.hermes/plans/2026-07-27_205907-taski-two-company-master-planner.md`
and the product roadmap at `docs/plans/2026-07-24-taski-master-planner-roadmap.md`.

---

## Release 0 — Baseline (recorded 2026-07-27)

### Task 0.1 — Production baseline

**Approach decision (user-confirmed):** There was uncommitted in-flight work on the
working tree that adds a **free-text `projects.context` column** (schema +
`0001_add_project_context.sql` + create/edit dialog inputs + dashboard grouping +
Today context filter + inline Today completion + atomic recurring-successor
creation). Rather than discard it, we treat the free-text column as the **legacy
context seed** the plan already anticipates ("Keep `projects.context` temporarily
for a two-step migration"). Release 1 normalizes it into a real `contexts` table
and backfills `context_id` from these strings.

**Gate status before any new change (clean working tree minus the noted WIP):**

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` (`tsc -b`) | PASS |
| Lint | `npm run lint` (`eslint .`) | PASS |
| Build | `npm run build` (`vite build`) | PASS (built in ~2.1s) |

No pre-existing failures to record.

**Schema at baseline (relevant tables):**

- `projects`: id, user_id, name, description, `context` (text, default 'Pessoal',
  NOT NULL — added by WIP migration 0001), color, position, created_at, updated_at.
- `tasks`: id, project_id (FK cascade), title, description, priority enum
  (high/medium/low), status enum (todo/in_progress/done), due_date, position,
  recurrence enum (daily/weekly/monthly/weekdays/none), recurrence_days,
  created_at, updated_at.
- `items`: id, task_id (FK cascade), title, description, is_completed, position,
  created_at.

**Behavior at baseline:**

- Project context is **free-text**; uniqueness is NOT enforced. Rename requires
  editing each project. `CIA`, `cia`, ` CIA ` would be distinct contexts.
- Dashboard groups projects by distinct `context` string and offers a free-text
  filter chip row.
- Today shows Overdue / Due-today / Upcoming, each filterable by `projectContext`
  string; tasks are inline-completable.
- `updateTask`/`reorderTasks` route through `persistTaskUpdate`, which creates a
  recurring successor **atomically via `db.batch`** keyed on an `updatedAt`
  completion marker; re-completing an already-done task does not duplicate a
  successor (idempotent).

**Production counts (read-only, no titles/descriptions logged):**

| Metric | Count |
|---|---|
| Projects | 4 |
| Tasks | 15 |
| Items (checklist) | 12 |

**Context placement:** all 4 projects currently carry the single context
`Pessoal` (the WIP default). No `Learned Hand`, `CIA`, or `PXG` records exist yet
in production — those contexts are created during Release 7 real-data setup.

> Note for Task 7.2: the plan references "14 current Learned Hand tasks"; the live
> baseline shows 15 total tasks across 4 projects under `Pessoal`. The Release 7
> migration must re-verify actual post-migration counts rather than assuming the
> plan's example numbers.

### Notes for Release 1

- Add `contexts` table (uuid id, user_id, name, description, color, icon, position,
  archived_at, created_at, updated_at; unique (user_id, lower(name))).
- Add nullable `projects.context_id` FK → `contexts.id` (restricted delete).
- Keep `projects.context` until all readers/writers move to `context_id`.
- Backfill: trim label; empty → `Pessoal`; one context per (user_id, label);
  populate `context_id`; verify zero orphans; only then `NOT NULL` + drop legacy
  column (Task 1.4).
