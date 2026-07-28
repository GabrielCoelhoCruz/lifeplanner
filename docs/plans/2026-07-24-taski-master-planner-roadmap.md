# Taski master planner roadmap

## Goal

Turn Taski into a reliable personal execution system across two companies, side projects, and personal life.

Taski will organize next actions and daily priorities. It will not replace company systems that require collaboration, approvals, audit history, or formal reporting.

## Product principles

1. **One trusted inbox.** Every commitment has one capture path.
2. **Clear context.** Every project belongs to a company or life context.
3. **Action over storage.** Tasks describe the next visible action.
4. **Deadlines stay meaningful.** A due date represents a real commitment.
5. **Automation remains reversible.** Scheduled jobs prepare decisions instead of silently rewriting work.
6. **Company contexts remain visible.** Labels accompany colors everywhere. Contexts organize work; user and project ownership enforce security.
7. **Sensitive information stays at the source.** Taski stores short notes and links, not confidential company records.
8. **Mobile is a primary workflow.** Capture, triage, and completion must work comfortably on a phone.

## Success criteria

Taski is successful when:

- A task can be captured in under 15 seconds.
- Every active project has a company or life context.
- The Today view answers “What should I do next?” without opening each project.
- A weekly review takes less than 20 minutes.
- Tasks created through an API cannot cross user ownership or enter the wrong context/project accidentally.
- Repeated API requests do not create duplicate tasks.
- The mobile Today flow works at 320 CSS pixels and above.
- Critical capture, completion, recurrence, and authorization paths have automated tests.
- Production failures include enough context to diagnose the request without exposing task contents.

## Operating model

### Contexts

Use contexts as the highest level:

- Company A
- Company B
- Side projects
- Personal

### Projects

A project represents an outcome or ongoing responsibility:

- Client delivery
- Operations
- Product launch
- Sales pipeline
- Finance
- Health
- Home administration

Avoid creating one project for each small request.

### Tasks

A task represents one visible next action:

- Good: `Send revised proposal to Marina`
- Weak: `Proposal`

Store source-system links, decisions, and completion criteria in the description. Keep sensitive documents in the company system.

### Daily states

Use these states:

- **Todo:** ready to start.
- **In progress:** actively being advanced.
- **Waiting:** another person or event must act first.
- **Blocked:** a known issue prevents progress.
- **Done:** completed.

Waiting and Blocked must include a short reason. Waiting should optionally identify who or what is expected next.

## Current foundation

Taski already includes:

- Authenticated, user-scoped projects and tasks
- Company or life contexts on projects
- Context filters and grouping
- Project colors
- List and Kanban views
- Today and upcoming views
- Inline completion from Today
- Priority, due date, recurrence, and subtasks
- Pomodoro focus sessions
- JSON import and export
- Keyboard shortcuts and command palette
- Light and dark themes

The database already defaults older projects to `Pessoal`.

## Scope and priorities

### Must have

These features make Taski dependable as a master planner:

1. Mobile-ready Today view
2. Waiting and Blocked states
3. Inbox and universal quick capture
4. Secure task-capture API
5. Weekly Markdown review export
6. Guided weekly review
7. Automated tests for critical workflows
8. Production error monitoring and structured logs

### Should have

These features reduce planning friction:

1. Global task search
2. External source URL
3. Planned date separate from due date
4. Duration or effort estimate
5. Daily Top 3
6. Recurring checklist cloning
7. Saved context and status filters
8. Import preview and transactional rollback

### Could have

These features become valuable after the core workflow is trusted:

1. Calendar integration
2. Email and Slack capture
3. Natural-language task parsing
4. Generated daily briefing
5. Time tracking and weekly effort summaries
6. Dependencies between tasks
7. Shared projects
8. Native mobile wrapper

### Won't have in this roadmap

- Full sprint-management features
- Gantt charts
- Payroll, invoicing, or accounting
- Company-wide collaboration and permissions
- Automatic bulk status changes without confirmation
- Storage of confidential source documents
- Replacement of Jira, Linear, Notion, or company reporting

## Phase 1: reliable daily execution

### 1.1 Mobile-ready Today

Make Today the main daily screen.

#### Behavior

- Show Overdue, Today, Next 7 days, Waiting, and Blocked sections.
- Show context, project, task title, priority, and date.
- Allow completion without leaving the page.
- Allow opening the exact task, not only its project.
- Keep context filters reachable without horizontal overflow.
- Collapse secondary metadata before truncating the task title.
- Use touch targets at least 44 by 44 CSS pixels.
- Preserve the selected context filter during navigation and reload.
- Provide explicit loading, empty, error, and retry states.

#### Membership and ordering

Each task appears once, in the first applicable section:

1. Top 3
2. Overdue
3. Due or planned today
4. Waiting or Blocked
5. Next 7 days

Within a section, order by priority, due date, planned date, then creation time. Completed Top 3 tasks remain in Top 3 until the day ends. All other completed tasks leave Today immediately.

Waiting and Blocked use these rules:

- Show past-due and today follow-ups first.
- Show tasks without a follow-up date in a compact current section.
- Do not show future Waiting or Blocked tasks before their follow-up date.
- Exclude Waiting and Blocked tasks from Next 7 days to prevent duplication.

#### Acceptance criteria

- The page works at 320, 375, 768, and 1280 CSS-pixel widths.
- A user can filter, open, and complete a task using touch only.
- A user can perform the same actions using a keyboard.
- Completing a task removes it from Today without a full reload.
- Long context, project, and task names do not overlap controls.

### 1.2 Waiting and Blocked

Extend task status with `waiting` and `blocked`.

#### New fields

- `waitingOn`: optional short text
- `blockedReason`: optional short text
- `followUpDate`: optional date

#### Rules

- Waiting requires `waitingOn` or a description.
- Blocked requires `blockedReason`.
- Waiting tasks with a follow-up date appear in Today on that date.
- Waiting and Blocked tasks remain visible in project boards.
- Completing a recurring task still creates exactly one successor.

#### Acceptance criteria

- Status changes work through task details, list view, Kanban, Today, and API.
- Missing reasons produce specific validation messages.
- Filters can isolate Waiting and Blocked tasks.

### 1.3 Daily Top 3

Allow the user to select at most three active tasks for the day.

#### Rules

- Top 3 is user-scoped and date-scoped.
- Completing a Top 3 task keeps it visible as completed until the day ends.
- Moving a fourth task into Top 3 requires replacing an existing selection.
- The selection does not change due dates or project status.

## Phase 2: capture without friction

### 2.1 Inbox

Add a user-scoped Inbox for unprocessed tasks.

Inbox is a task state, not a reserved project. Make `tasks.project_id` nullable and add `triage_status` with `inbox` and `organized` values. An Inbox task belongs directly to the authenticated user through a new non-null `tasks.user_id`. Organized tasks require a project. The selected project remains the source of truth for context.

#### Behavior

- Quick capture requires only a title.
- Inbox tasks can later receive a context, project, priority, status, and date.
- Processing a task removes it from Inbox without changing its identity.
- The Inbox shows capture source and creation time.
- A daily badge shows the number of unprocessed tasks.

#### Acceptance criteria

- Capture completes in under 15 seconds on desktop and mobile.
- Keyboard shortcut `N` opens capture from every authenticated page.
- A failed capture preserves typed content and offers retry.
- Inbox processing supports batch context and project assignment.
- Existing task, Today, search, notification, import, export, and authorization queries handle nullable project IDs explicitly.
- Assigning a project atomically changes `triage_status` to `organized`.
- Removing a project from an organized task is rejected unless the same mutation returns it to Inbox.

### 2.2 Secure task-capture API

Create a general API rather than an agent-specific endpoint.

#### Endpoint

`POST /api/tasks`

#### Authentication

- Use a revocable personal API token with a public token ID and a secret.
- Look up the token by its public ID, then verify the secret with a keyed HMAC using an application pepper.
- Store the public ID and secret digest, never the plaintext secret.
- Show the plaintext token once at creation.
- Support token name, scopes, creation time, expiry, last-used time, rotation, and revocation.
- Scope the token to its owner.

#### Request

```json
{
  "context": "Company A",
  "project": "Client delivery",
  "title": "Send revised proposal to Marina",
  "description": "Source: https://company.example.test/tickets/42",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-07-27",
  "source": "chat",
  "idempotencyKey": "chat-message-01932"
}
```

#### Response

Return:

- Created task ID
- Resolved context and project
- Task URL
- Whether the request created a task or returned an existing idempotent result

#### Validation

- Validate every request at runtime.
- Reject unknown priority and status values.
- Limit title, description, source, and idempotency-key lengths.
- Validate dates as calendar dates.
- Require exact context and project matches by default.
- Allow explicit Inbox capture when the project is unknown.
- Never create a new context or project implicitly.
- Resolve the project with `(authenticated user, context label, project name)` in one query.
- Persist only the project ID. The task inherits context from its project.

#### Reliability

- Enforce a unique token-plus-idempotency-key constraint.
- Create the task and idempotency record atomically.
- Return consistent typed errors.
- Apply rate limits per token.
- Record request ID, token ID, outcome, and duration.
- Never log titles or descriptions by default.
- Retain successful idempotency records for 30 days and failed request metadata for 7 days.
- Support `tasks:write` and `inbox:write` scopes initially. Reject other operations.

#### Error cases

- `400`: malformed request
- `401`: missing or invalid token
- `403`: revoked or insufficiently scoped token
- `404`: context or project not found
- `409`: conflicting idempotency-key payload
- `429`: rate limit exceeded
- `500`: unexpected server failure with request ID

### 2.3 Capture integrations

Build integrations only after the API is stable:

1. Chat agent
2. Mobile shortcut
3. Browser bookmarklet or extension
4. Email and Slack

Each integration must supply `source` and an idempotency key.

## Phase 3: weekly review and reporting

### 3.1 Weekly Markdown export

Add an export action with a selectable date range.

#### Default report

```markdown
# Weekly review — 2026-07-20 to 2026-07-26

## Company A

### Shipped
- Send revised proposal to Marina — Client delivery

### Still active
- Prepare Q3 review — Operations

### Waiting
- Legal approval — waiting on Legal
```

#### Sections

- Completed
- Still active
- Overdue
- Waiting
- Blocked
- Next week

Group every section by context, then project.

#### Acceptance criteria

- The export works for the current week and a custom range.
- Completed-task dates use the user's timezone.
- Markdown contains no hidden IDs unless requested.
- Empty sections are omitted.
- The export can be copied or downloaded.

### 3.2 Guided weekly review

Schedule a Sunday review prompt in the user's configured timezone. The default week starts Monday at local midnight. Do not reset tasks automatically.

Use calendar dates for week boundaries. Convert to instants only at the database boundary so daylight-saving transitions do not shift the review period. The weekly scheduler creates one idempotent snapshot after the local week ends.

Store `timezone` and `weekStartsOn` in a user-preferences record. Default timezone from the browser during onboarding and require confirmation. Fall back to UTC only when no browser timezone is available.

After the snapshot is ready, show a persistent in-app review banner and navigation badge on the user's first session. Keep both visible until the review completes or the user explicitly postpones it. Browser notifications may supplement this prompt when permission exists, but they are not the only delivery mechanism.

#### Review queue

- In-progress tasks untouched for seven days
- Overdue tasks
- Inbox tasks
- Waiting tasks past their follow-up date
- Blocked tasks
- Tasks without a due or planned date
- Completed tasks from the week

#### Actions

- Keep In progress
- Move to Todo
- Mark Waiting
- Mark Blocked
- Reschedule
- Complete
- Archive

Archiving sets `archivedAt` and hides the task from active views. Deletion remains a separate destructive action with confirmation.

`lastActivityAt` changes when the user edits task content, status, dates, project, context through project assignment, checklist state, or review action. Read-only views and automated snapshot generation do not change it.

Retain weekly review snapshots for one year. Store task IDs and review-relevant values, not complete descriptions or external URL query strings.

#### Automation

- A weekly job prepares a review snapshot.
- The job does not change task status.
- The user confirms all mutations.
- Re-running the job for the same week is idempotent.

## Phase 4: planning intelligence

### 4.1 Global search

Search task title, description, project, and context.

Filters:

- Context
- Project
- Status
- Priority
- Due-date range
- Planned-date range
- Capture source

Search results must show why each task matched and preserve filters in the URL.

### 4.2 Planned date

Separate intent from commitment:

- `plannedDate`: when the user expects to work on the task
- `dueDate`: the real external or personal deadline

Today shows tasks planned for today plus tasks due or overdue today.

### 4.3 Duration

Use a small fixed set:

- 15 minutes
- 30 minutes
- 1 hour
- 2 hours
- Deep work

Do not introduce detailed time estimation until usage shows a need.

### 4.4 Recurring checklists

When a recurring task completes:

- Create one successor atomically.
- Copy checklist item titles and descriptions.
- Reset checklist completion.
- Preserve context, project, priority, and recurrence rules.
- Do not copy completion history.

## Data model changes

Proposed additions:

### Tasks

- `status`: add `waiting` and `blocked`
- `waiting_on`: nullable text
- `blocked_reason`: nullable text
- `follow_up_date`: nullable date
- `planned_date`: nullable date
- `duration`: nullable enum
- `external_url`: nullable text
- `capture_source`: nullable text
- `completed_at`: nullable timestamp
- `last_activity_at`: timestamp
- `archived_at`: nullable timestamp
- `triage_status`: `inbox` or `organized`
- `user_id`: non-null owner
- `project_id`: nullable only while `triage_status = inbox`

Database checks enforce that organized tasks have a project. Application authorization always starts from `tasks.user_id`; project assignment additionally verifies project ownership.

### Daily focus

- `id`
- `user_id`
- `task_id`
- `focus_date`
- `position`

Unique constraint: `(user_id, focus_date, position)`.

Also add:

- Unique `(user_id, focus_date, task_id)`
- Foreign key `task_id → tasks.id` with cascade delete
- Position check limiting values to 1, 2, or 3

The server verifies task ownership and replaces a slot inside one transaction.

### API tokens

- `id`
- `user_id`
- `name`
- `public_id`
- `secret_digest`
- `scopes`
- `expires_at`
- `created_at`
- `last_used_at`
- `revoked_at`
- `rotated_from_id`
- `pepper_version`

Index `public_id` uniquely. Rotation creates a new token and revokes the old token after a short configurable overlap period.

Keep a small versioned pepper keyring. New tokens use the active version. Verification selects the key through `pepper_version`. Pepper rotation keeps the previous key available until all affected tokens rotate or expire.

### API idempotency

- `id`
- `user_id`
- `token_id`
- `idempotency_key`
- `request_hash`
- `task_id`
- `created_at`

Unique constraint: `(token_id, idempotency_key)`.

Add `expires_at` and delete expired rows through a scheduled retention job.

### Weekly reviews

- `id`
- `user_id`
- `week_start`
- `prepared_at`
- `completed_at`
- `snapshot`

Unique constraint: `(user_id, week_start)`.

Store `week_start` as a calendar date and record the timezone used to prepare the snapshot.

### User preferences

- `user_id`
- `timezone`
- `week_starts_on`
- `weekly_review_day`
- `weekly_review_enabled`
- `created_at`
- `updated_at`

Use one preferences record per user. Store timezone as an IANA identifier such as `America/Sao_Paulo`.

## Architecture decisions

### Keep TanStack Start server functions

Use existing server functions for the authenticated application. Add a route handler only for the token-authenticated public API.

### Keep Drizzle and PostgreSQL

Use Drizzle for typed queries and tracked migrations. Use database constraints for idempotency and important invariants.

### Add runtime validation

Use one schema library for:

- Server-function inputs
- Public API requests
- JSON import
- Environment variables

Infer TypeScript types from schemas instead of maintaining parallel types.

### Keep jobs non-destructive

Scheduled jobs may prepare snapshots, reminders, and reports. User-visible task changes require explicit confirmation.

### Preserve source ownership

Taski owns personal execution state. External systems own company records. `externalUrl` links the two without duplicating sensitive content.

### Treat context as organization, not authorization

Contexts are labels inside one user's account. They do not provide corporate data isolation. The security boundary is authenticated user ownership, followed by project ownership. API context input only helps resolve the correct owned project and prevent accidental placement.

## Security

- Authenticate every server mutation.
- Verify project ownership through its context and user.
- Resolve API tokens by public ID and verify secrets with a keyed HMAC and rotated application pepper.
- Support immediate token revocation.
- Never accept a user ID from an API request.
- Use parameterized Drizzle queries.
- Validate URL protocols.
- Limit request body and field sizes.
- Rate-limit token-authenticated endpoints.
- Avoid logging task content.
- Redact tokens, authorization headers, and URLs with sensitive query parameters.
- Return opaque request IDs for unexpected failures.
- Document which company information is safe to store.

## Privacy boundaries

Recommended content:

- Task title
- Short next-action description
- Public or authorized source link
- Deadline, status, and priority

Avoid:

- Customer personal data
- Credentials or secrets
- Private contracts
- Medical or financial records
- Full internal conversation transcripts
- Documents governed by company retention rules

## Testing strategy

### Unit tests

- Status-transition rules
- Recurrence date calculations
- Markdown report formatting
- Task validation
- Context and project resolution
- Request hashing and idempotency decisions

### Integration tests

- User cannot access another user's projects or tasks.
- API token creates tasks only for its owner.
- Revoked token cannot create tasks.
- Duplicate idempotent request returns the original task.
- Conflicting idempotency payload returns `409`.
- Recurring completion creates exactly one successor.
- Weekly preparation creates one snapshot per week.
- Import rejects invalid input before writing records.

### End-to-end tests

1. Sign in.
2. Capture an Inbox task.
3. Assign context and project.
4. Add it to Top 3.
5. Complete it from Today.
6. Export the weekly Markdown report.

Run the flow at desktop and mobile viewport sizes.

### Quality gates

Every change must pass:

- Type checking
- Linting
- Unit and integration tests
- Production build
- Migration validation
- Focused accessibility checks
- Mobile smoke test

## Observability

### Error tracking

Capture:

- Route or operation
- Auth mode
- Request ID
- User ID hash
- API token ID
- Error category
- Duration

Do not capture task titles, descriptions, authorization headers, or raw request bodies.

### Structured events

Record:

- `task.captured`
- `task.completed`
- `task.status_changed`
- `weekly_review.prepared`
- `weekly_review.completed`
- `markdown_export.created`
- `api_token.created`
- `api_token.revoked`

### Alerts

Alert on:

- Elevated API error rate
- Repeated authentication failures
- Weekly review job failure
- Migration failure
- Recurrence successor failure

## Accessibility

- Provide text labels alongside context colors.
- Maintain visible keyboard focus.
- Use semantic headings for Today sections.
- Announce successful task completion.
- Avoid drag-and-drop-only interactions.
- Support reduced motion.
- Keep controls usable at 200% zoom.
- Test forms and dialogs with keyboard and screen-reader navigation.

## Delivery sequence

### Release 0 — engineering foundation

- Test runner and database integration-test harness
- Runtime validation library and shared schemas
- Structured error model with request IDs
- Production error monitoring
- Privacy-safe structured logging
- Migration verification in CI

### Release 1 — daily control

- Mobile Today
- Waiting and Blocked
- Daily Top 3
- Explicit error and retry states

### Release 2 — universal capture

- Inbox
- Runtime validation
- Personal API tokens
- `POST /api/tasks`
- Idempotency and rate limiting
- Chat and mobile shortcut examples

### Release 3 — weekly review

- Markdown export
- Review snapshot job
- Guided review UI
- Waiting and stale-task review

### Release 4 — planning depth

- Global search
- Planned date
- Duration
- External URL
- Recurring checklist cloning

### Release 5 — optional integrations

- Calendar
- Email and Slack capture
- Generated daily briefing
- Time summaries

## Rollout plan

For each release:

1. Add and review tracked migrations.
2. Apply migrations to a non-production database.
3. Run integration and end-to-end tests.
4. Deploy a preview.
5. Test with realistic Company A, Company B, Side, and Personal fixtures.
6. Deploy production.
7. Verify logs, error rate, and the critical flow.
8. Keep a rollback path for schema and application changes.

Do not deploy server code that reads a new column before its migration succeeds.

### Migration and backfill rules

- Add nullable columns first when old application versions cannot populate them.
- Backfill `tasks.user_id` through each task's owned project.
- Set existing tasks to `triage_status = organized`.
- Keep existing project IDs unchanged.
- Set `last_activity_at` to `updated_at`, falling back to `created_at`.
- Backfill `completed_at` from `updated_at` for existing Done tasks and mark this timestamp as inferred in migration notes.
- Map existing Todo, In progress, and Done statuses without changing meaning.
- Add non-null and check constraints only after backfill validation succeeds.
- Deploy readers that tolerate old and new shapes before making new writers mandatory.
- Roll back application code before destructive schema rollback. Prefer forward-fix migrations for production data.

## Risks and mitigations

### Taski becomes a second company database

Mitigation: store next actions and source links only. Document privacy boundaries.

### Automation creates incorrect tasks

Mitigation: require exact context/project resolution, idempotency, validation, and audit metadata.

### The board becomes noisy

Mitigation: use Inbox processing, Waiting/Blocked states, Top 3, and weekly review.

### Due dates lose meaning

Mitigation: separate planned date from due date and explain both in the UI.

### Weekly automation destroys intent

Mitigation: prepare a review queue and require confirmation before mutations.

### Mobile usage remains awkward

Mitigation: treat mobile Today as a release gate, not a polish task.

### Imports leave partial records

Mitigation: validate the complete file before writing and use one transaction.

### API tokens leak

Mitigation: show tokens once, store hashes, support revocation, redact logs, and provide token-specific rate limits.

## Definition of done

The master-planner roadmap is complete when:

- All Must-have features meet their acceptance criteria.
- Critical paths have automated tests.
- Today passes mobile and keyboard verification.
- API capture is authenticated, validated, idempotent, and observable.
- Weekly review requires no manual data compilation.
- Markdown export supports 1:1 and personal review workflows.
- Production migrations are tracked and repeatable.
- Error monitoring can diagnose failures without exposing task contents.
- Documentation explains daily capture, daily planning, and weekly review.

## Recommended next action

Start Release 0, then Release 1 with Mobile Today and Waiting/Blocked. These changes make the system observable and improve action quality before the API adds more capture volume.
