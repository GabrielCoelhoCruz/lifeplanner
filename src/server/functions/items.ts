import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { items, tasks, projects } from '../db/schema'
import { eq, and, asc, inArray } from 'drizzle-orm'
import { requireUser, type AuthUser } from '../auth'

async function assertTaskOwned(taskId: string, user: AuthUser) {
  const [row] = await db
    .select({ id: tasks.id })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(eq(tasks.id, taskId), eq(projects.userId, user.id)))
  if (!row) throw new Error('Task not found')
}

async function assertItemOwned(itemId: string, user: AuthUser): Promise<string> {
  const [row] = await db
    .select({ taskId: items.taskId })
    .from(items)
    .innerJoin(tasks, eq(items.taskId, tasks.id))
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(eq(items.id, itemId), eq(projects.userId, user.id)))
  if (!row) throw new Error('Item not found')
  return row.taskId
}

export const listItemsByTask = createServerFn({ method: 'GET' })
  .inputValidator((data: { taskId: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await assertTaskOwned(data.taskId, user)
    return db
      .select()
      .from(items)
      .where(eq(items.taskId, data.taskId))
      .orderBy(asc(items.position))
  })

export const createItem = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { taskId: string; title: string; description?: string }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    await assertTaskOwned(data.taskId, user)
    if (!data.title?.trim()) throw new Error('Título é obrigatório')
    const [result] = await db
      .insert(items)
      .values({
        taskId: data.taskId,
        title: data.title.trim(),
        description: data.description,
      })
      .returning()
    return result
  })

export const updateItem = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      id: string
      title?: string
      description?: string
      isCompleted?: boolean
      position?: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    await assertItemOwned(data.id, user)

    const { id, ...fields } = data
    const updates: Record<string, unknown> = {}
    if (fields.title !== undefined) updates.title = fields.title.trim()
    if (fields.description !== undefined) updates.description = fields.description
    if (fields.isCompleted !== undefined) updates.isCompleted = fields.isCompleted
    if (fields.position !== undefined) updates.position = fields.position

    const [result] = await db
      .update(items)
      .set(updates)
      .where(eq(items.id, id))
      .returning()
    if (!result) throw new Error('Item not found')
    return result
  })

export const deleteItem = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await assertItemOwned(data.id, user)
    await db.delete(items).where(eq(items.id, data.id))
    return { success: true }
  })

export const reorderItems = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { items: { id: string; position: number }[] }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    if (data.items.length === 0) return { success: true }

    const ids = data.items.map((i) => i.id)
    const owned = await db
      .select({ id: items.id })
      .from(items)
      .innerJoin(tasks, eq(items.taskId, tasks.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(inArray(items.id, ids), eq(projects.userId, user.id)))
    if (owned.length !== ids.length) {
      throw new Error('Some items do not belong to this user')
    }

    await Promise.all(
      data.items.map((item) =>
        db
          .update(items)
          .set({ position: item.position })
          .where(eq(items.id, item.id)),
      ),
    )
    return { success: true }
  })
