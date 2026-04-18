# Taski

**Suas tarefas. Seu ritmo. Seu dia organizado.**

Taski is a fast, keyboard-first task and project planner for people who want to actually get things done — not wrestle with their tool. Organize work into projects, plan your day, run focus sessions with the built-in Pomodoro, and move through everything without ever taking your hands off the keyboard.

<p align="center">
  <img src="public/icons/icon.svg" width="96" alt="Taski logo" />
</p>

---

## Highlights

- **Projects & Tasks** — color-coded projects, tasks with priority, status, due dates, and recurrence (daily, weekly, weekdays, monthly).
- **Subtasks (items)** — break down any task into a checklist that stays with it.
- **Kanban board** — drag-and-drop between *Todo*, *In Progress*, and *Done* (powered by `@dnd-kit`).
- **Today view** — a clean, focused list of everything due today across all projects.
- **Pomodoro timer** — a persistent floating bar so your focus session follows you across the app.
- **Command palette** — `⌘K` / `Ctrl+K` to jump anywhere, create anything, search everything.
- **Keyboard shortcuts** — new project, new task, search, help — all one keystroke away.
- **Full-text search** — debounced search across projects and tasks.
- **Dark & light themes** — respects your system preference, remembers your choice.
- **Authenticated & multi-user** — powered by Neon Auth, data scoped per user.
- **End-to-end type-safe** — TypeScript from the Postgres schema to the React components via Drizzle ORM and TanStack Query.

---

## Tech stack

| Layer           | Tool                                                                 |
| --------------- | -------------------------------------------------------------------- |
| Framework       | [TanStack Start](https://tanstack.com/start) (SSR) + [Vite](https://vite.dev) |
| Routing         | [TanStack Router](https://tanstack.com/router) (file-based)          |
| Data fetching   | [TanStack Query](https://tanstack.com/query)                         |
| UI              | [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) |
| Components      | Custom shadcn-style primitives + [Phosphor Icons](https://phosphoricons.com) |
| DnD             | [@dnd-kit](https://dndkit.com)                                       |
| Toasts          | [Sonner](https://sonner.emilkowal.ski)                               |
| Database        | [Neon](https://neon.tech) (serverless Postgres)                      |
| ORM             | [Drizzle ORM](https://orm.drizzle.team) + Drizzle Kit                |
| Auth            | [Neon Auth](https://neon.tech/docs/neon-auth/overview)               |
| Fonts           | [Geist](https://vercel.com/font) (Sans + Mono)                       |
| Language        | TypeScript                                                            |

---

## Getting started

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm** (or your package manager of choice)
- A **Neon** project with a serverless Postgres database and Neon Auth enabled

### 1. Clone & install

```bash
git clone https://github.com/GabrielCoelhoCruz/lifeplanner.git
cd lifeplanner
npm install
```

### 2. Configure environment

Create a `.env` at the repo root:

```env
# Neon serverless connection string
DATABASE_URL="postgres://<user>:<password>@<host>/<db>?sslmode=require"

# Neon Auth (see https://neon.tech/docs/neon-auth/overview)
VITE_NEON_AUTH_PROJECT_ID="..."
NEON_AUTH_JWKS_URL="..."
```

> Variable names may differ slightly depending on your Neon Auth setup — check `src/lib/auth-client.ts` and `drizzle.config.ts` for the exact keys this project reads.

### 3. Push the schema

```bash
npm run db:push       # apply the Drizzle schema to your database
npm run db:studio     # (optional) open Drizzle Studio to inspect data
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in.

---

## Scripts

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite/TanStack Start dev server       |
| `npm run build`     | Production build                               |
| `npm start`         | Run the built server (`.output/server`)        |
| `npm run lint`      | Run ESLint                                     |
| `npm run typecheck` | Run the TypeScript compiler in check mode     |
| `npm run db:push`   | Push the Drizzle schema to Postgres            |
| `npm run db:studio` | Open Drizzle Studio                            |

---

## Project structure

```
src/
├─ routes/                TanStack Router file-based routes
│  ├─ __root.tsx          App shell (auth guard, providers, header)
│  ├─ index.tsx           Dashboard — "Meus Projetos"
│  ├─ today.tsx           Today view
│  ├─ projects.$projectId.tsx   Project detail with Kanban
│  ├─ settings.tsx        User settings & theme
│  ├─ login.tsx           Sign in
│  └─ forgot-password.tsx / reset-password.tsx / verify-email.tsx
├─ components/            UI components
│  ├─ ui/                 Low-level primitives (button, dialog, input, sheet…)
│  ├─ layout/header.tsx   App header with command palette trigger
│  ├─ kanban-board.tsx    Drag-and-drop Kanban
│  ├─ pomodoro-bar.tsx    Persistent focus-timer bar
│  ├─ command-palette.tsx ⌘K command palette
│  └─ …                   Project/task cards, dialogs, FAB, search bar, etc.
├─ hooks/                 React hooks (tasks, projects, shortcuts, pomodoro…)
├─ lib/                   Auth client, query client, theme, utils
├─ server/db/schema.ts    Drizzle schema (projects, tasks, items)
├─ index.css              Tailwind v4 + theme tokens + animations
├─ router.tsx             Router instance
└─ client.tsx / server.ts TanStack Start entrypoints
```

---

## Keyboard shortcuts

| Shortcut         | Action                    |
| ---------------- | ------------------------- |
| `⌘K` / `Ctrl+K`  | Open command palette      |
| `/`              | Focus the search bar      |
| `N`              | Create a new project/task |
| `?`              | Show shortcuts help       |
| `Esc`            | Close any open dialog     |

*(Exact bindings live in `src/hooks/use-keyboard-shortcuts.ts`.)*

---

## Data model

Three tables, with strict cascades so deleting a project cleans everything downstream:

- `projects` — user-scoped, name, description, color, position
- `tasks` — belongs to a project; priority (`high`/`medium`/`low`), status (`todo`/`in_progress`/`done`), due date, recurrence (`daily`/`weekly`/`weekdays`/`monthly`/`none`)
- `items` — subtasks under a task, ordered, completable

See [`src/server/db/schema.ts`](src/server/db/schema.ts) for the source of truth.

---

## Roadmap ideas

- Collaboration / shared projects
- Mobile-optimized Kanban gestures
- Calendar view
- Notifications & reminders
- Import/export (CSV, Todoist, Things)

---

## Contributing

Issues and PRs are welcome. Before opening a PR, please:

1. `npm run lint` — no new errors
2. `npm run typecheck` — clean
3. Keep commits small and use [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `refactor:`…)

---

## License

MIT © [Gabriel Coelho Cruz](https://github.com/GabrielCoelhoCruz)
