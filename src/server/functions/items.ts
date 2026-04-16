import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { items } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const listItemsByTask = createServerFn({ method: 'GET' })
  .inputValidator((data: { taskId: string }) => data)
  .handler(async ({ data }) => {
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
    const { id, ...fields } = data
    const updates: Record<string, unknown> = {}
    if (fields.title !== undefined) updates.title = fields.title.trim()
    if (fields.description !== undefined)
      updates.description = fields.description
    if (fields.isCompleted !== undefined)
      updates.isCompleted = fields.isCompleted
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
    await db.delete(items).where(eq(items.id, data.id))
    return { success: true }
  })

export const reorderItems = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { items: { id: string; position: number }[] }) => data,
  )
  .handler(async ({ data }) => {
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
