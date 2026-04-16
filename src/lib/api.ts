import type { Project, NewProject, Task, NewTask, Item, NewItem } from '@/server/db/schema'
import { authClient } from '@/lib/auth-client'
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '@/server/functions/projects'
import {
  listTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '@/server/functions/tasks'
import {
  listItemsByTask,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
} from '@/server/functions/items'
import { getTodayTasks, getUpcomingTasks } from '@/server/functions/views'
import { exportAllData, importAllData } from '@/server/functions/data'

/**
 * Reads the current user's id from the auth client session.
 * Throws if the user is not signed in — every api call requires auth.
 */
async function getUserId(): Promise<string> {
  const { data } = await authClient.getSession()
  const id = data?.user?.id
  if (!id) throw new Error('Não autenticado')
  return id
}

export interface TaskWithCounts extends Task {
  itemCount: number
  itemDoneCount: number
}

export interface TaskWithProject {
  task: Task
  projectName: string | null
  projectColor: string | null
}

/** Convert null to undefined for server function compatibility */
function nu<T>(v: T | null | undefined): T | undefined {
  return v ?? undefined
}

export const api = {
  projects: {
    list: async () => listProjects({ data: { userId: await getUserId() } }),
    get: async (id: string) =>
      getProject({ data: { id, userId: await getUserId() } }),
    create: async (data: Partial<NewProject>) =>
      createProject({
        data: {
          userId: await getUserId(),
          name: data.name!,
          description: nu(data.description),
          color: nu(data.color),
        },
      }),
    update: async (id: string, data: Partial<Project>) =>
      updateProject({
        data: {
          userId: await getUserId(),
          id,
          name: data.name ?? undefined,
          description: nu(data.description),
          color: nu(data.color),
          position: nu(data.position),
        },
      }),
    delete: async (id: string) =>
      deleteProject({ data: { id, userId: await getUserId() } }),
    reorder: async (items: { id: string; position: number }[]) =>
      reorderProjects({ data: { items, userId: await getUserId() } }),
  },
  tasks: {
    listByProject: async (projectId: string) =>
      listTasksByProject({ data: { projectId, userId: await getUserId() } }),
    get: async (id: string) =>
      getTask({ data: { id, userId: await getUserId() } }),
    create: async (data: Partial<NewTask>) =>
      createTask({
        data: {
          userId: await getUserId(),
          projectId: data.projectId!,
          title: data.title!,
          description: nu(data.description),
          priority: nu(data.priority),
          status: nu(data.status),
          dueDate: data.dueDate
            ? (data.dueDate as unknown as Date).toISOString()
            : undefined,
          recurrence: nu(data.recurrence),
          recurrenceDays: nu(data.recurrenceDays),
        },
      }),
    update: async (id: string, data: Partial<Task>) =>
      updateTask({
        data: {
          userId: await getUserId(),
          id,
          title: data.title ?? undefined,
          description: nu(data.description),
          priority: nu(data.priority),
          status: nu(data.status),
          dueDate: data.dueDate
            ? (data.dueDate as unknown as Date).toISOString()
            : data.dueDate === null
              ? null
              : undefined,
          position: nu(data.position),
          recurrence: nu(data.recurrence),
          recurrenceDays: nu(data.recurrenceDays),
        },
      }),
    delete: async (id: string) =>
      deleteTask({ data: { id, userId: await getUserId() } }),
    reorder: async (items: { id: string; position: number; status?: string }[]) =>
      reorderTasks({ data: { items, userId: await getUserId() } }),
  },
  items: {
    listByTask: async (taskId: string) =>
      listItemsByTask({ data: { taskId, userId: await getUserId() } }),
    create: async (data: Partial<NewItem>) =>
      createItem({
        data: {
          userId: await getUserId(),
          taskId: data.taskId!,
          title: data.title!,
          description: nu(data.description),
        },
      }),
    update: async (id: string, data: Partial<Item>) =>
      updateItem({
        data: {
          userId: await getUserId(),
          id,
          title: data.title ?? undefined,
          description: nu(data.description),
          isCompleted: data.isCompleted ?? undefined,
          position: nu(data.position),
        },
      }),
    delete: async (id: string) =>
      deleteItem({ data: { id, userId: await getUserId() } }),
    reorder: async (items: { id: string; position: number }[]) =>
      reorderItems({ data: { items, userId: await getUserId() } }),
  },
  views: {
    today: async () => getTodayTasks({ data: { userId: await getUserId() } }),
    upcoming: async () =>
      getUpcomingTasks({ data: { userId: await getUserId() } }),
  },
  data: {
    exportAll: async () =>
      exportAllData({ data: { userId: await getUserId() } }),
    importAll: async (data: {
      projects: unknown[]
      tasks?: unknown[]
      items?: unknown[]
    }) =>
      importAllData({
        data: {
          userId: await getUserId(),
          projects: data.projects as Array<Record<string, unknown>>,
          tasks: data.tasks as Array<Record<string, unknown>> | undefined,
          items: data.items as Array<Record<string, unknown>> | undefined,
        },
      }),
  },
}
