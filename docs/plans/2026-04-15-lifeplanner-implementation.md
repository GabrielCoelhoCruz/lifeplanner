# LifePlanner PWA — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal planner PWA with project/task/item hierarchy, list + kanban views, drag & drop, search, notifications, and Neon Postgres persistence.

**Architecture:** React SPA with Vite, TanStack Router for type-safe routing, TanStack Query for server state, Express API backend connecting to Neon Postgres. shadcn/ui + Tailwind for UI components. PWA with Workbox for offline asset caching.

**Tech Stack:**
- Frontend: React 19, TypeScript, Vite, TanStack Router, TanStack Query
- UI: Tailwind CSS v4, shadcn/ui, Phosphor Icons (`@phosphor-icons/react`), Geist font
- Backend: Express.js API (runs via Vite plugin or separate dev server)
- Database: Neon Postgres (`@neondatabase/serverless`)
- DnD: `@dnd-kit/core` + `@dnd-kit/sortable`
- PWA: `vite-plugin-pwa` (Workbox)

**Database Connection:** `postgresql://neondb_owner:npg_oQFhYq5aw9OJ@ep-calm-field-acf5xc35-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require`

**Figma Reference:** https://www.figma.com/design/41DybmivuDSRs4S76cm2H4

---

## Phase 1: Project Setup & Foundation

### Task 1: Initialize Vite + React + TypeScript project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `.env`
- Create: `.gitignore`

**Step 1: Scaffold Vite project**

```bash
npm create vite@latest . -- --template react-ts
```

**Step 2: Install core dependencies**

```bash
npm install @tanstack/react-router @tanstack/react-query @phosphor-icons/react geist
npm install -D @tanstack/router-plugin @tanstack/router-devtools tailwindcss @tailwindcss/vite
```

**Step 3: Install shadcn/ui dependencies**

```bash
npx shadcn@latest init
```

Choose: TypeScript, Default style, Neutral base color, CSS variables yes, `src/components/ui` path.

**Step 4: Install backend & database dependencies**

```bash
npm install express @neondatabase/serverless drizzle-orm dotenv
npm install -D drizzle-kit @types/express tsx concurrently
```

**Step 5: Install PWA & DnD dependencies**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D vite-plugin-pwa
```

**Step 6: Create `.env` file**

```env
DATABASE_URL=postgresql://neondb_owner:npg_oQFhYq5aw9OJ@ep-calm-field-acf5xc35-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

**Step 7: Create `.gitignore`**

```
node_modules
dist
.env
*.local
```

**Step 8: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold vite + react + typescript project"
```

---

### Task 2: Configure Tailwind CSS v4 + Geist Font + Design Tokens

**Files:**
- Create: `src/index.css`
- Modify: `vite.config.ts`
- Modify: `src/main.tsx`

**Step 1: Configure vite.config.ts with Tailwind plugin**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ quoteStyle: 'single' }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 2: Create `src/index.css` with design tokens**

```css
@import 'tailwindcss';
@import 'geist/font/sans';
@import 'geist/font/mono';

@theme {
  /* Colors */
  --color-bg-primary: #FAFAF9;
  --color-bg-secondary: #F5F5F4;
  --color-bg-elevated: #FFFFFF;

  --color-text-primary: #1C1917;
  --color-text-secondary: #78716C;
  --color-text-muted: #A8A29E;

  --color-accent: #E11D48;
  --color-accent-hover: #BE123C;

  --color-priority-high: #DC2626;
  --color-priority-medium: #F59E0B;
  --color-priority-low: #6B7280;

  --color-status-todo: #E5E7EB;
  --color-status-progress: #3B82F6;
  --color-status-done: #10B981;

  --color-border: #E7E5E4;

  /* Typography */
  --font-sans: 'Geist', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 24px;
  --spacing-6: 32px;
  --spacing-8: 48px;
  --spacing-10: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Animations */
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

@layer base {
  body {
    font-family: var(--font-sans);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

**Step 3: Update `src/main.tsx`**

```tsx
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure tailwind v4 with geist font and design tokens"
```

---

### Task 3: Configure TanStack Router

**Files:**
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx`
- Create: `src/routes/projects.$projectId.tsx`
- Create: `src/routes/settings.tsx`
- Modify: `src/App.tsx`
- Create: `src/routeTree.gen.ts` (auto-generated)

**Step 1: Create root route with layout**

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

**Step 2: Create index route (Dashboard)**

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  return <div className="px-5 py-7 md:px-16 md:py-12">Dashboard</div>
}
```

**Step 3: Create project detail route**

```tsx
// src/routes/projects.$projectId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  return <div className="px-5 py-7 md:px-16 md:py-12">Project {projectId}</div>
}
```

**Step 4: Create settings route**

```tsx
// src/routes/settings.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return <div className="px-5 py-7 md:px-16 md:py-12">Settings</div>
}
```

**Step 5: Create App.tsx with router + query providers**

```tsx
// src/App.tsx
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 },
  },
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
```

**Step 6: Create placeholder Header component**

```tsx
// src/components/layout/header.tsx
import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4 md:px-16 bg-bg-elevated border-b border-border">
      <Link to="/" className="text-2xl font-normal text-text-primary tracking-tight">
        LifePlanner
      </Link>
    </header>
  )
}
```

**Step 7: Run dev to verify routing works**

```bash
npm run dev
```

Visit `/`, `/projects/1`, `/settings` — all should render.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: configure tanstack router with file-based routes"
```

---

## Phase 2: Database Schema & API

### Task 4: Define Drizzle schema & run migrations

**Files:**
- Create: `src/server/db/schema.ts`
- Create: `src/server/db/index.ts`
- Create: `drizzle.config.ts`

**Step 1: Create Drizzle schema**

```ts
// src/server/db/schema.ts
import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low'])
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'done'])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  color: text('color').default('#E11D48'),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  priority: priorityEnum('priority').default('medium').notNull(),
  status: statusEnum('status').default('todo').notNull(),
  dueDate: timestamp('due_date'),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  isCompleted: boolean('is_completed').default(false).notNull(),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Type exports
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
```

**Step 2: Create DB connection**

```ts
// src/server/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

**Step 3: Create drizzle.config.ts**

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**Step 4: Generate and push schema**

```bash
npx drizzle-kit push
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: define drizzle schema with projects, tasks, items tables"
```

---

### Task 5: Build Express API server

**Files:**
- Create: `src/server/index.ts`
- Create: `src/server/routes/projects.ts`
- Create: `src/server/routes/tasks.ts`
- Create: `src/server/routes/items.ts`
- Modify: `package.json` (add scripts)
- Modify: `vite.config.ts` (add proxy)

**Step 1: Create Express server**

```ts
// src/server/index.ts
import express from 'express'
import dotenv from 'dotenv'
import { projectsRouter } from './routes/projects'
import { tasksRouter } from './routes/tasks'
import { itemsRouter } from './routes/items'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/items', itemsRouter)

const PORT = process.env.API_PORT || 3001

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
```

**Step 2: Create projects routes (full CRUD + reorder)**

```ts
// src/server/routes/projects.ts
import { Router } from 'express'
import { db } from '../db'
import { projects } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const projectsRouter = Router()

// GET all projects
projectsRouter.get('/', async (_req, res) => {
  const result = await db.select().from(projects).orderBy(asc(projects.position))
  res.json(result)
})

// GET single project
projectsRouter.get('/:id', async (req, res) => {
  const [result] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!result) return res.status(404).json({ error: 'Project not found' })
  res.json(result)
})

// POST create project
projectsRouter.post('/', async (req, res) => {
  const { name, description, color } = req.body
  const [result] = await db.insert(projects).values({ name, description, color }).returning()
  res.status(201).json(result)
})

// PATCH update project
projectsRouter.patch('/:id', async (req, res) => {
  const { name, description, color, position } = req.body
  const [result] = await db
    .update(projects)
    .set({ name, description, color, position, updatedAt: new Date() })
    .where(eq(projects.id, req.params.id))
    .returning()
  if (!result) return res.status(404).json({ error: 'Project not found' })
  res.json(result)
})

// DELETE project
projectsRouter.delete('/:id', async (req, res) => {
  await db.delete(projects).where(eq(projects.id, req.params.id))
  res.status(204).send()
})

// PATCH reorder projects
projectsRouter.patch('/reorder/batch', async (req, res) => {
  const { items: orderItems } = req.body as { items: { id: string; position: number }[] }
  await Promise.all(
    orderItems.map((item) =>
      db.update(projects).set({ position: item.position }).where(eq(projects.id, item.id))
    )
  )
  res.json({ success: true })
})
```

**Step 3: Create tasks routes**

```ts
// src/server/routes/tasks.ts
import { Router } from 'express'
import { db } from '../db'
import { tasks } from '../db/schema'
import { eq, and, asc } from 'drizzle-orm'

export const tasksRouter = Router()

// GET tasks by project
tasksRouter.get('/project/:projectId', async (req, res) => {
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, req.params.projectId))
    .orderBy(asc(tasks.position))
  res.json(result)
})

// GET single task
tasksRouter.get('/:id', async (req, res) => {
  const [result] = await db.select().from(tasks).where(eq(tasks.id, req.params.id))
  if (!result) return res.status(404).json({ error: 'Task not found' })
  res.json(result)
})

// POST create task
tasksRouter.post('/', async (req, res) => {
  const { projectId, title, description, priority, status, dueDate } = req.body
  const [result] = await db
    .insert(tasks)
    .values({ projectId, title, description, priority, status, dueDate: dueDate ? new Date(dueDate) : null })
    .returning()
  res.status(201).json(result)
})

// PATCH update task
tasksRouter.patch('/:id', async (req, res) => {
  const updates: Record<string, unknown> = { ...req.body, updatedAt: new Date() }
  if (updates.dueDate) updates.dueDate = new Date(updates.dueDate as string)
  const [result] = await db
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, req.params.id))
    .returning()
  if (!result) return res.status(404).json({ error: 'Task not found' })
  res.json(result)
})

// DELETE task
tasksRouter.delete('/:id', async (req, res) => {
  await db.delete(tasks).where(eq(tasks.id, req.params.id))
  res.status(204).send()
})

// PATCH reorder tasks
tasksRouter.patch('/reorder/batch', async (req, res) => {
  const { items: orderItems } = req.body as { items: { id: string; position: number; status?: string }[] }
  await Promise.all(
    orderItems.map((item) => {
      const updates: Record<string, unknown> = { position: item.position }
      if (item.status) updates.status = item.status
      return db.update(tasks).set(updates).where(eq(tasks.id, item.id))
    })
  )
  res.json({ success: true })
})
```

**Step 4: Create items routes**

```ts
// src/server/routes/items.ts
import { Router } from 'express'
import { db } from '../db'
import { items } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const itemsRouter = Router()

// GET items by task
itemsRouter.get('/task/:taskId', async (req, res) => {
  const result = await db
    .select()
    .from(items)
    .where(eq(items.taskId, req.params.taskId))
    .orderBy(asc(items.position))
  res.json(result)
})

// POST create item
itemsRouter.post('/', async (req, res) => {
  const { taskId, title, description } = req.body
  const [result] = await db.insert(items).values({ taskId, title, description }).returning()
  res.status(201).json(result)
})

// PATCH update item
itemsRouter.patch('/:id', async (req, res) => {
  const [result] = await db
    .update(items)
    .set(req.body)
    .where(eq(items.id, req.params.id))
    .returning()
  if (!result) return res.status(404).json({ error: 'Item not found' })
  res.json(result)
})

// DELETE item
itemsRouter.delete('/:id', async (req, res) => {
  await db.delete(items).where(eq(items.id, req.params.id))
  res.status(204).send()
})

// PATCH reorder items
itemsRouter.patch('/reorder/batch', async (req, res) => {
  const { items: orderItems } = req.body as { items: { id: string; position: number }[] }
  await Promise.all(
    orderItems.map((item) =>
      db.update(items).set({ position: item.position }).where(eq(items.id, item.id))
    )
  )
  res.json({ success: true })
})
```

**Step 5: Add dev scripts to package.json**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:client\"",
    "dev:client": "vite",
    "dev:api": "tsx watch src/server/index.ts",
    "build": "tsc -b && vite build",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Step 6: Add proxy to vite.config.ts**

Add to the existing config:
```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001',
  },
},
```

**Step 7: Test API with `npm run dev`**

```bash
npm run dev
```

Verify API responds at `http://localhost:3001/api/projects`.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add express API with full CRUD for projects, tasks, items"
```

---

## Phase 3: TanStack Query Hooks & API Client

### Task 6: Create API client and query hooks

**Files:**
- Create: `src/lib/api.ts`
- Create: `src/hooks/use-projects.ts`
- Create: `src/hooks/use-tasks.ts`
- Create: `src/hooks/use-items.ts`

**Step 1: Create type-safe API client**

```ts
// src/lib/api.ts
import type { Project, NewProject, Task, NewTask, Item, NewItem } from '@/server/db/schema'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  projects: {
    list: () => request<Project[]>('/projects'),
    get: (id: string) => request<Project>(`/projects/${id}`),
    create: (data: Partial<NewProject>) => request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Project>) => request<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/projects/${id}`, { method: 'DELETE' }),
    reorder: (items: { id: string; position: number }[]) => request<void>('/projects/reorder/batch', { method: 'PATCH', body: JSON.stringify({ items }) }),
  },
  tasks: {
    listByProject: (projectId: string) => request<Task[]>(`/tasks/project/${projectId}`),
    get: (id: string) => request<Task>(`/tasks/${id}`),
    create: (data: Partial<NewTask>) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Task>) => request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
    reorder: (items: { id: string; position: number; status?: string }[]) => request<void>('/tasks/reorder/batch', { method: 'PATCH', body: JSON.stringify({ items }) }),
  },
  items: {
    listByTask: (taskId: string) => request<Item[]>(`/items/task/${taskId}`),
    create: (data: Partial<NewItem>) => request<Item>('/items', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Item>) => request<Item>(`/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/items/${id}`, { method: 'DELETE' }),
    reorder: (items: { id: string; position: number }[]) => request<void>('/items/reorder/batch', { method: 'PATCH', body: JSON.stringify({ items }) }),
  },
}
```

**Step 2: Create project hooks**

```ts
// src/hooks/use-projects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { NewProject, Project } from '@/server/db/schema'

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: api.projects.list,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => api.projects.get(id),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<NewProject>) => api.projects.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => api.projects.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}
```

**Step 3: Create task hooks** (same pattern — `src/hooks/use-tasks.ts`)

**Step 4: Create item hooks** (same pattern — `src/hooks/use-items.ts`)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add API client and TanStack Query hooks for all entities"
```

---

## Phase 4: UI Components (shadcn + custom)

### Task 7: Install shadcn components & create custom components

**Files:**
- shadcn: `button`, `input`, `dialog`, `dropdown-menu`, `badge`, `sheet`, `separator`, `toast`, `sonner`
- Create: `src/components/project-card.tsx`
- Create: `src/components/task-row.tsx`
- Create: `src/components/item-row.tsx`
- Create: `src/components/kanban-card.tsx`
- Create: `src/components/kanban-board.tsx`
- Create: `src/components/priority-badge.tsx`
- Create: `src/components/status-badge.tsx`
- Create: `src/components/view-toggle.tsx`
- Create: `src/components/search-bar.tsx`
- Create: `src/components/fab.tsx`
- Create: `src/components/task-detail-panel.tsx`

**Step 1: Install shadcn components**

```bash
npx shadcn@latest add button input dialog dropdown-menu badge sheet separator sonner
```

**Step 2: Create each component matching the Figma design**

Each component should:
- Use design tokens from Tailwind config
- Use Phosphor Icons (`@phosphor-icons/react`)
- Use Geist font (already set as default)
- Be responsive (mobile-first)
- Accept props typed with DB schema types

**Step 3: Commit per component group**

---

## Phase 5: Pages & Features

### Task 8: Build Dashboard page

**Files:**
- Modify: `src/routes/index.tsx`
- Uses: ProjectCard, SearchBar, FAB, CreateProjectDialog

**Features:**
- Grid of project cards (2 cols mobile, 3 cols tablet, auto-fill desktop)
- Search/filter projects by name
- FAB to create new project
- Click card navigates to `/projects/:id`

### Task 9: Build Project Detail page

**Files:**
- Modify: `src/routes/projects.$projectId.tsx`
- Uses: TaskRow, KanbanBoard, ViewToggle, SearchBar, FAB

**Features:**
- Toggle between list and kanban views (state in URL search params)
- List view: collapsible tasks with sub-items
- Kanban view: 3 columns (todo, in_progress, done)
- Drag & drop reordering in both views
- FAB to create new task

### Task 10: Build Task Detail panel

**Files:**
- Create: `src/components/task-detail-panel.tsx`
- Integrates into Project Detail page via Sheet (shadcn)

**Features:**
- Side panel on desktop, full-screen on mobile
- Edit title, description inline
- Priority selector (3 pills)
- Status selector
- Date picker for due date
- Checklist (items) with add/toggle/delete
- Save button

### Task 11: Build Settings page

**Files:**
- Modify: `src/routes/settings.tsx`

**Features:**
- Notification toggle (Notification API permission request)
- Sound toggle (localStorage)
- Theme display (v1: light only)
- Export JSON (download all data)
- Import JSON (upload & restore)

---

## Phase 6: Drag & Drop

### Task 12: Implement drag & drop with @dnd-kit

**Files:**
- Create: `src/lib/dnd-utils.ts`
- Modify: task list and kanban components

**Features:**
- Reorder tasks in list view
- Move tasks between kanban columns (status change)
- Reorder items in task detail checklist
- Optimistic updates via TanStack Query
- Persist order to API on drop

---

## Phase 7: Search, Notifications & PWA

### Task 13: Implement search & filter

**Files:**
- Create: `src/hooks/use-search.ts`
- Modify: Dashboard and Project Detail pages

**Features:**
- Client-side fuzzy search on task/project titles
- Filter by priority, status
- Search bar in header (desktop) and content area (mobile)

### Task 14: Implement push notifications

**Files:**
- Create: `src/lib/notifications.ts`
- Modify: Settings page

**Features:**
- Request Notification API permission
- Check tasks with due dates approaching (within 24h)
- Show browser notification for overdue tasks
- Respect user's notification toggle setting

### Task 15: Configure PWA

**Files:**
- Modify: `vite.config.ts` (add VitePWA plugin)
- Create: `public/manifest.json`
- Create: `public/icons/` (app icons 192x192, 512x512)

**Features:**
- Service worker for asset caching
- App manifest for installability
- Offline page fallback
- App icons and splash screen

**Step 1: Add PWA config to vite.config.ts**

```ts
import { VitePWA } from 'vite-plugin-pwa'

// Add to plugins:
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'LifePlanner',
    short_name: 'Planner',
    description: 'Organize sua vida em um só lugar',
    theme_color: '#FAFAF9',
    background_color: '#FAFAF9',
    display: 'standalone',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  },
})
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: configure PWA with service worker and manifest"
```

---

## Phase 8: Polish & Final

### Task 16: Responsive polish & animations

- Verify all screens at 375px, 768px, 1440px
- Add page transitions (fade/slide)
- Add hover states on interactive elements
- Add loading skeletons for data fetches
- Add empty states ("Nenhum projeto ainda")
- Add error boundaries

### Task 17: Export/Import data

- Export: download all projects/tasks/items as JSON
- Import: upload JSON file, validate structure, upsert to DB
- Add to Settings page

### Task 18: Final testing & deployment prep

- Test full CRUD flow for projects, tasks, items
- Test drag & drop in list and kanban
- Test PWA installation on mobile
- Test offline behavior
- Verify Neon connection stability
- Build production bundle: `npm run build`

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-3 | Project setup, Tailwind, Router |
| 2 | 4-5 | Database schema, API server |
| 3 | 6 | API client, Query hooks |
| 4 | 7 | UI components (shadcn + custom) |
| 5 | 8-11 | Pages (Dashboard, Project, Task, Settings) |
| 6 | 12 | Drag & drop |
| 7 | 13-15 | Search, notifications, PWA |
| 8 | 16-18 | Polish, export/import, testing |

**Estimated tasks:** 18 | **Estimated time:** 4-6 hours of implementation
