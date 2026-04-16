import { Router } from 'express'
import { db } from '../db'
import { tasks } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const tasksRouter = Router()

tasksRouter.get('/project/:projectId', async (req, res) => {
  const result = await db.select().from(tasks).where(eq(tasks.projectId, req.params.projectId)).orderBy(asc(tasks.position))
  res.json(result)
})

tasksRouter.get('/:id', async (req, res) => {
  const [result] = await db.select().from(tasks).where(eq(tasks.id, req.params.id))
  if (!result) return res.status(404).json({ error: 'Task not found' })
  res.json(result)
})

tasksRouter.post('/', async (req, res) => {
  const { projectId, title, description, priority, status, dueDate } = req.body
  const [result] = await db.insert(tasks).values({ projectId, title, description, priority, status, dueDate: dueDate ? new Date(dueDate) : null }).returning()
  res.status(201).json(result)
})

tasksRouter.patch('/:id', async (req, res) => {
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  const { title, description, priority, status, dueDate, position } = req.body
  if (title !== undefined) updates.title = title
  if (description !== undefined) updates.description = description
  if (priority !== undefined) updates.priority = priority
  if (status !== undefined) updates.status = status
  if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null
  if (position !== undefined) updates.position = position
  const [result] = await db.update(tasks).set(updates).where(eq(tasks.id, req.params.id)).returning()
  if (!result) return res.status(404).json({ error: 'Task not found' })
  res.json(result)
})

tasksRouter.delete('/:id', async (req, res) => {
  await db.delete(tasks).where(eq(tasks.id, req.params.id))
  res.status(204).send()
})

tasksRouter.patch('/reorder/batch', async (req, res) => {
  const { items: orderItems } = req.body as { items: { id: string; position: number; status?: string }[] }
  await Promise.all(orderItems.map((item) => {
    const updates: Record<string, unknown> = { position: item.position }
    if (item.status) updates.status = item.status
    return db.update(tasks).set(updates).where(eq(tasks.id, item.id))
  }))
  res.json({ success: true })
})
