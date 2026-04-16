import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { projects, tasks, items } from '../db/schema'
import { eq, inArray, asc } from 'drizzle-orm'
import { requireUser } from '../auth'

export const exportAllData = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(asc(projects.position))

    const projectIds = allProjects.map((p) => p.id)
    const allTasks =
      projectIds.length > 0
        ? await db
            .select()
            .from(tasks)
            .where(inArray(tasks.projectId, projectIds))
            .orderBy(asc(tasks.position))
        : []

    const taskIds = allTasks.map((t) => t.id)
    const allItems =
      taskIds.length > 0
        ? await db
            .select()
            .from(items)
            .where(inArray(items.taskId, taskIds))
            .orderBy(asc(items.position))
        : []

    return { projects: allProjects, tasks: allTasks, items: allItems }
  })

export const importAllData = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      userId: string
      projects: Array<Record<string, unknown>>
      tasks?: Array<Record<string, unknown>>
      items?: Array<Record<string, unknown>>
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    const importProjects = data.projects
    const importTasks = data.tasks
    const importItems = data.items

    if (!Array.isArray(importProjects)) {
      throw new Error('Formato inválido')
    }

    const projectIdMap = new Map<string, string>()
    const taskIdMap = new Map<string, string>()

    for (const p of importProjects) {
      const [created] = await db
        .insert(projects)
        .values({
          userId: user.id,
          name: p.name as string,
          description: (p.description as string) || '',
          color: (p.color as string) || '#6366F1',
          position: (p.position as number) || 0,
        })
        .returning()
      projectIdMap.set(p.id as string, created.id)
    }

    if (Array.isArray(importTasks)) {
      for (const t of importTasks) {
        const newProjectId = projectIdMap.get(
          (t.projectId as string) || (t.project_id as string),
        )
        if (!newProjectId) continue
        const [created] = await db
          .insert(tasks)
          .values({
            projectId: newProjectId,
            title: t.title as string,
            description: (t.description as string) || '',
            priority: (t.priority as 'high' | 'medium' | 'low') || 'medium',
            status: (t.status as 'todo' | 'in_progress' | 'done') || 'todo',
            dueDate:
              (t.dueDate as string) || (t.due_date as string)
                ? new Date(
                    (t.dueDate as string) || (t.due_date as string),
                  )
                : null,
            recurrence:
              (t.recurrence as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | 'weekdays'
                | 'none') || 'none',
            recurrenceDays:
              (t.recurrenceDays as string) ||
              (t.recurrence_days as string) ||
              null,
            position: (t.position as number) || 0,
          })
          .returning()
        taskIdMap.set(t.id as string, created.id)
      }
    }

    if (Array.isArray(importItems)) {
      for (const i of importItems) {
        const newTaskId = taskIdMap.get(
          (i.taskId as string) || (i.task_id as string),
        )
        if (!newTaskId) continue
        await db.insert(items).values({
          taskId: newTaskId,
          title: i.title as string,
          description: (i.description as string) || '',
          isCompleted:
            (i.isCompleted as boolean) ||
            (i.is_completed as boolean) ||
            false,
          position: (i.position as number) || 0,
        })
      }
    }

    return {
      success: true,
      imported: {
        projects: projectIdMap.size,
        tasks: taskIdMap.size,
        items: importItems
          ? importItems.filter((i) =>
              taskIdMap.has(
                (i.taskId as string) || (i.task_id as string) || '',
              ),
            ).length
          : 0,
      },
    }
  })
