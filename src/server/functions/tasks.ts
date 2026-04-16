import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { tasks, items, projects } from '../db/schema'
import { eq, and, asc, sql, inArray, count } from 'drizzle-orm'
import { requireUser, type AuthUser } from '../auth'

function calculateNextDueDate(
  currentDueDate: Date | null,
  recurrence: string,
  recurrenceDays: string | null,
): Date {
  const base = currentDueDate ? new Date(currentDueDate) : new Date()

  switch (recurrence) {
    case 'daily':
      base.setDate(base.getDate() + 1)
      break
    case 'weekly':
      base.setDate(base.getDate() + 7)
      break
    case 'monthly':
      base.setMonth(base.getMonth() + 1)
      break
    case 'weekdays': {
      const days = (recurrenceDays || '1,2,3,4,5').split(',').map(Number)
      const next = new Date(base)
      next.setDate(next.getDate() + 1)
      let safety = 0
      while (!days.includes(next.getDay()) && safety < 7) {
        next.setDate(next.getDate() + 1)
        safety++
      }
      return next
    }
  }
  return base
}

async function assertProjectOwned(projectId: string, user: AuthUser) {
  const [p] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
  if (!p) throw new Error('Project not found')
}

async function assertTaskOwned(taskId: string, user: AuthUser): Promise<string> {
  const [row] = await db
    .select({ projectId: tasks.projectId })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(eq(tasks.id, taskId), eq(projects.userId, user.id)))
  if (!row) throw new Error('Task not found')
  return row.projectId
}

export const listTasksByProject = createServerFn({ method: 'GET' })
  .inputValidator((data: { projectId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    await assertProjectOwned(data.projectId, user)

    const taskList = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, data.projectId))
      .orderBy(asc(tasks.position))

    const taskIds = taskList.map((t) => t.id)
    if (taskIds.length > 0) {
      const counts = await db
        .select({
          taskId: items.taskId,
          total: count(),
          done: count(sql`CASE WHEN ${items.isCompleted} = true THEN 1 END`),
        })
        .from(items)
        .where(inArray(items.taskId, taskIds))
        .groupBy(items.taskId)

      const countMap = new Map(
        counts.map((c) => [
          c.taskId,
          { total: Number(c.total), done: Number(c.done) },
        ]),
      )

      return taskList.map((t) => ({
        ...t,
        itemCount: countMap.get(t.id)?.total ?? 0,
        itemDoneCount: countMap.get(t.id)?.done ?? 0,
      }))
    }

    return taskList.map((t) => ({ ...t, itemCount: 0, itemDoneCount: 0 }))
  })

export const getTask = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    const [result] = await db
      .select({ task: tasks })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(tasks.id, data.id), eq(projects.userId, user.id)))
    if (!result) throw new Error('Task not found')
    return result.task
  })

export const createTask = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      userId: string
      projectId: string
      title: string
      description?: string
      priority?: string
      status?: string
      dueDate?: string | null
      recurrence?: string
      recurrenceDays?: string | null
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    await assertProjectOwned(data.projectId, user)
    if (!data.title?.trim()) throw new Error('Título é obrigatório')
    const [result] = await db
      .insert(tasks)
      .values({
        projectId: data.projectId,
        title: data.title.trim(),
        description: data.description,
        priority: (data.priority as 'high' | 'medium' | 'low') || undefined,
        status: (data.status as 'todo' | 'in_progress' | 'done') || undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        recurrence:
          (data.recurrence as
            | 'daily'
            | 'weekly'
            | 'monthly'
            | 'weekdays'
            | 'none') || 'none',
        recurrenceDays: data.recurrenceDays || null,
      })
      .returning()
    return result
  })

export const updateTask = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      userId: string
      id: string
      title?: string
      description?: string
      priority?: string
      status?: string
      dueDate?: string | null
      position?: number
      recurrence?: string
      recurrenceDays?: string | null
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    await assertTaskOwned(data.id, user)

    const { id, userId: _u, ...fields } = data
    void _u
    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (fields.title !== undefined) updates.title = fields.title.trim()
    if (fields.description !== undefined)
      updates.description = fields.description
    if (fields.priority !== undefined) updates.priority = fields.priority
    if (fields.status !== undefined) updates.status = fields.status
    if (fields.dueDate !== undefined)
      updates.dueDate = fields.dueDate ? new Date(fields.dueDate) : null
    if (fields.position !== undefined) updates.position = fields.position
    if (fields.recurrence !== undefined) updates.recurrence = fields.recurrence
    if (fields.recurrenceDays !== undefined)
      updates.recurrenceDays = fields.recurrenceDays

    const [result] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning()
    if (!result) throw new Error('Task not found')

    if (
      updates.status === 'done' &&
      result.recurrence &&
      result.recurrence !== 'none'
    ) {
      const nextDueDate = calculateNextDueDate(
        result.dueDate,
        result.recurrence,
        result.recurrenceDays,
      )
      await db.insert(tasks).values({
        projectId: result.projectId,
        title: result.title,
        description: result.description,
        priority: result.priority,
        status: 'todo',
        dueDate: nextDueDate,
        position: result.position,
        recurrence: result.recurrence,
        recurrenceDays: result.recurrenceDays,
      })
    }

    return result
  })

export const deleteTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    await assertTaskOwned(data.id, user)
    await db.delete(tasks).where(eq(tasks.id, data.id))
    return { success: true }
  })

export const reorderTasks = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      userId: string
      items: { id: string; position: number; status?: string }[]
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser(data.userId)
    if (data.items.length === 0) return { success: true }

    const ids = data.items.map((i) => i.id)
    const owned = await db
      .select({ id: tasks.id })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(inArray(tasks.id, ids), eq(projects.userId, user.id)))
    const ownedIds = new Set(owned.map((o) => o.id))
    if (ownedIds.size !== ids.length) {
      throw new Error('Some tasks do not belong to this user')
    }

    await Promise.all(
      data.items.map((item) => {
        const updates: Record<string, unknown> = { position: item.position }
        if (item.status) updates.status = item.status
        return db.update(tasks).set(updates).where(eq(tasks.id, item.id))
      }),
    )
    return { success: true }
  })
