import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { contexts, projects, tasks, items } from '../db/schema'
import { and, asc, eq, inArray, sql } from 'drizzle-orm'
import type { BatchItem } from 'drizzle-orm/batch'
import { randomUUID } from 'node:crypto'
import { requireUser } from '../auth'
import { planDataImport } from './data-mapping'

export const exportAllData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()

    const allContexts = await db
      .select()
      .from(contexts)
      .where(eq(contexts.userId, user.id))
      .orderBy(asc(contexts.position))

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(asc(projects.position))

    const projectIds = allProjects.map((project) => project.id)
    const allTasks =
      projectIds.length > 0
        ? await db
            .select()
            .from(tasks)
            .where(inArray(tasks.projectId, projectIds))
            .orderBy(asc(tasks.position))
        : []

    const taskIds = allTasks.map((task) => task.id)
    const allItems =
      taskIds.length > 0
        ? await db
            .select()
            .from(items)
            .where(inArray(items.taskId, taskIds))
            .orderBy(asc(items.position))
        : []

    return {
      contexts: allContexts,
      projects: allProjects,
      tasks: allTasks,
      items: allItems,
    }
  },
)

export const importAllData = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      contexts?: Array<Record<string, unknown>>
      projects: Array<Record<string, unknown>>
      tasks?: Array<Record<string, unknown>>
      items?: Array<Record<string, unknown>>
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    const importTasks = data.tasks
    const importItems = data.items
    const importPlan = planDataImport({
      contexts: data.contexts,
      projects: data.projects,
    })

    const contextIdByKey = new Map<string, string>()
    const projectIdMap = new Map<string, string>()
    const taskIdMap = new Map<string, string>()
    const operations: BatchItem<'pg'>[] = []

    for (const context of importPlan.contexts) {
      const [existing] = await db
        .select({ id: contexts.id })
        .from(contexts)
        .where(
          and(
            eq(contexts.userId, user.id),
            sql`lower(${contexts.name}) = ${context.key}`,
          ),
        )

      if (existing) {
        contextIdByKey.set(context.key, existing.id)
        continue
      }

      const id = randomUUID()
      operations.push(
        db.insert(contexts).values({
          id,
          userId: user.id,
          name: context.name,
          description: context.description,
          color: context.color,
          icon: context.icon,
          position: context.position,
        }),
      )
      contextIdByKey.set(context.key, id)
    }

    for (const project of importPlan.projects) {
      const contextId = contextIdByKey.get(project.contextKey)
      if (!contextId) throw new Error('Contexto inválido no arquivo de importação')

      const id = randomUUID()
      operations.push(
        db.insert(projects).values({
          id,
          userId: user.id,
          name: project.name,
          description: project.description,
          contextId,
          color: project.color,
          position: project.position,
        }),
      )
      projectIdMap.set(project.sourceId, id)
    }

    if (Array.isArray(importTasks)) {
      for (const task of importTasks) {
        const newProjectId = projectIdMap.get(
          (task.projectId as string) || (task.project_id as string),
        )
        if (!newProjectId) continue
        const id = randomUUID()
        operations.push(
          db.insert(tasks).values({
            id,
            projectId: newProjectId,
            title: task.title as string,
            description: (task.description as string) || '',
            priority:
              (task.priority as 'high' | 'medium' | 'low') || 'medium',
            status:
              (task.status as 'todo' | 'in_progress' | 'done') || 'todo',
            dueDate:
              (task.dueDate as string) || (task.due_date as string)
                ? new Date(
                    (task.dueDate as string) || (task.due_date as string),
                  )
                : null,
            recurrence:
              (task.recurrence as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | 'weekdays'
                | 'none') || 'none',
            recurrenceDays:
              (task.recurrenceDays as string) ||
              (task.recurrence_days as string) ||
              null,
            position: (task.position as number) || 0,
          }),
        )
        taskIdMap.set(task.id as string, id)
      }
    }

    if (Array.isArray(importItems)) {
      for (const item of importItems) {
        const newTaskId = taskIdMap.get(
          (item.taskId as string) || (item.task_id as string),
        )
        if (!newTaskId) continue
        operations.push(
          db.insert(items).values({
            taskId: newTaskId,
            title: item.title as string,
            description: (item.description as string) || '',
            isCompleted:
              (item.isCompleted as boolean) ||
              (item.is_completed as boolean) ||
              false,
            position: (item.position as number) || 0,
          }),
        )
      }
    }

    if (operations.length > 0) {
      await db.batch(
        operations as [BatchItem<'pg'>, ...BatchItem<'pg'>[]],
      )
    }

    return {
      success: true,
      imported: {
        contexts: contextIdByKey.size,
        projects: projectIdMap.size,
        tasks: taskIdMap.size,
        items: importItems
          ? importItems.filter((item) =>
              taskIdMap.has(
                (item.taskId as string) || (item.task_id as string) || '',
              ),
            ).length
          : 0,
      },
    }
  })
