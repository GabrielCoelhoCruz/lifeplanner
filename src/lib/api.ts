import type { Project, NewProject, Task, NewTask, Item, NewItem } from '@/server/db/schema'
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
    list: () => listProjects(),
    get: (id: string) => getProject({ data: { id } }),
    create: (data: Partial<NewProject>) =>
      createProject({
        data: {
          name: data.name!,
          description: nu(data.description),
          color: nu(data.color),
        },
      }),
    update: (id: string, data: Partial<Project>) =>
      updateProject({
        data: {
          id,
          name: data.name ?? undefined,
          description: nu(data.description),
          color: nu(data.color),
          position: nu(data.position),
        },
      }),
    delete: (id: string) => deleteProject({ data: { id } }),
    reorder: (items: { id: string; position: number }[]) =>
      reorderProjects({ data: { items } }),
  },
  tasks: {
    listByProject: (projectId: string) =>
      listTasksByProject({ data: { projectId } }),
    get: (id: string) => getTask({ data: { id } }),
    create: (data: Partial<NewTask>) =>
      createTask({
        data: {
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
    update: (id: string, data: Partial<Task>) =>
      updateTask({
        data: {
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
    delete: (id: string) => deleteTask({ data: { id } }),
    reorder: (items: { id: string; position: number; status?: string }[]) =>
      reorderTasks({ data: { items } }),
  },
  items: {
    listByTask: (taskId: string) => listItemsByTask({ data: { taskId } }),
    create: (data: Partial<NewItem>) =>
      createItem({
        data: {
          taskId: data.taskId!,
          title: data.title!,
          description: nu(data.description),
        },
      }),
    update: (id: string, data: Partial<Item>) =>
      updateItem({
        data: {
          id,
          title: data.title ?? undefined,
          description: nu(data.description),
          isCompleted: data.isCompleted ?? undefined,
          position: nu(data.position),
        },
      }),
    delete: (id: string) => deleteItem({ data: { id } }),
    reorder: (items: { id: string; position: number }[]) =>
      reorderItems({ data: { items } }),
  },
  views: {
    today: () => getTodayTasks(),
    upcoming: () => getUpcomingTasks(),
  },
  data: {
    exportAll: () => exportAllData(),
    importAll: (data: {
      projects: unknown[]
      tasks?: unknown[]
      items?: unknown[]
    }) =>
      importAllData({
        data: {
          projects: data.projects as Array<Record<string, unknown>>,
          tasks: data.tasks as Array<Record<string, unknown>> | undefined,
          items: data.items as Array<Record<string, unknown>> | undefined,
        },
      }),
  },
}
