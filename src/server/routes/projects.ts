import { Router } from 'express'
import { db } from '../db'
import { projects } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const projectsRouter = Router()

projectsRouter.get('/', async (_req, res) => {
  const result = await db.select().from(projects).orderBy(asc(projects.position))
  res.json(result)
})

projectsRouter.get('/:id', async (req, res) => {
  const [result] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!result) return res.status(404).json({ error: 'Project not found' })
  res.json(result)
})

projectsRouter.post('/', async (req, res) => {
  const { name, description, color } = req.body
  const [result] = await db.insert(projects).values({ name, description, color }).returning()
  res.status(201).json(result)
})

projectsRouter.patch('/:id', async (req, res) => {
  const { name, description, color, position } = req.body
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (name !== undefined) updates.name = name
  if (description !== undefined) updates.description = description
  if (color !== undefined) updates.color = color
  if (position !== undefined) updates.position = position
  const [result] = await db.update(projects).set(updates).where(eq(projects.id, req.params.id)).returning()
  if (!result) return res.status(404).json({ error: 'Project not found' })
  res.json(result)
})

projectsRouter.delete('/:id', async (req, res) => {
  await db.delete(projects).where(eq(projects.id, req.params.id))
  res.status(204).send()
})

projectsRouter.patch('/reorder/batch', async (req, res) => {
  const { items: orderItems } = req.body as { items: { id: string; position: number }[] }
  await Promise.all(orderItems.map((item) => db.update(projects).set({ position: item.position }).where(eq(projects.id, item.id))))
  res.json({ success: true })
})
