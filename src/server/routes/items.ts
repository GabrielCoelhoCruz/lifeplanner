import { Router } from 'express'
import { db } from '../db'
import { items } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const itemsRouter = Router()

itemsRouter.get('/task/:taskId', async (req, res) => {
  const result = await db.select().from(items).where(eq(items.taskId, req.params.taskId)).orderBy(asc(items.position))
  res.json(result)
})

itemsRouter.post('/', async (req, res) => {
  const { taskId, title, description } = req.body
  const [result] = await db.insert(items).values({ taskId, title, description }).returning()
  res.status(201).json(result)
})

itemsRouter.patch('/:id', async (req, res) => {
  const updates: Record<string, unknown> = {}
  const { title, description, isCompleted, position } = req.body
  if (title !== undefined) updates.title = title
  if (description !== undefined) updates.description = description
  if (isCompleted !== undefined) updates.isCompleted = isCompleted
  if (position !== undefined) updates.position = position
  const [result] = await db.update(items).set(updates).where(eq(items.id, req.params.id)).returning()
  if (!result) return res.status(404).json({ error: 'Item not found' })
  res.json(result)
})

itemsRouter.delete('/:id', async (req, res) => {
  await db.delete(items).where(eq(items.id, req.params.id))
  res.status(204).send()
})

itemsRouter.patch('/reorder/batch', async (req, res) => {
  const { items: orderItems } = req.body as { items: { id: string; position: number }[] }
  await Promise.all(orderItems.map((item) => db.update(items).set({ position: item.position }).where(eq(items.id, item.id))))
  res.json({ success: true })
})
