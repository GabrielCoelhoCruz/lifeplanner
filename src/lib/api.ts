import type { Project, NewProject, Task, NewTask, Item, NewItem } from '@/server/db/schema'

export interface TaskWithProject {
  task: Task
  projectName: string | null
  projectColor: string | null
}

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `API error: ${res.status}`)
  }
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
  views: {
    today: () => request<TaskWithProject[]>('/views/today'),
    upcoming: () => request<TaskWithProject[]>('/views/upcoming'),
  },
  data: {
    exportAll: () => request<{ projects: Project[]; tasks: Task[]; items: Item[] }>('/data/export'),
    importAll: (data: { projects: unknown[]; tasks?: unknown[]; items?: unknown[] }) =>
      request<{ success: boolean; imported: { projects: number; tasks: number; items: number } }>(
        '/data/import',
        { method: 'POST', body: JSON.stringify(data) },
      ),
  },
}
