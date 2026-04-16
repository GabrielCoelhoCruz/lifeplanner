import { Router } from 'express'
import { db } from '../db'
import { tasks } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const tasksRouter = Router()

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const VALID_PRIORITIES = ['high', 'medium', 'low'] as const
const VALID_STATUSES = ['todo', 'in_progress', 'done'] as const

tasksRouter.get('/project/:projectId', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.projectId)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    const result = await db.select().from(tasks).where(eq(tasks.projectId, req.params.projectId)).orderBy(asc(tasks.position))
    res.json(result)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

tasksRouter.get('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    const [result] = await db.select().from(tasks).where(eq(tasks.id, req.params.id))
    if (!result) return res.status(404).json({ error: 'Task not found' })
    res.json(result)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

tasksRouter.post('/', async (req, res) => {
  try {
    const { projectId, title, description, priority, status, dueDate } = req.body

    if (!projectId || typeof projectId !== 'string' || !UUID_REGEX.test(projectId)) {
      return res.status(400).json({ error: 'projectId é obrigatório e deve ser um UUID válido' })
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `Prioridade deve ser: ${VALID_PRIORITIES.join(', ')}` })
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status deve ser: ${VALID_STATUSES.join(', ')}` })
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Descrição deve ser uma string' })
    }

    const [result] = await db.insert(tasks).values({
      projectId,
      title: title.trim(),
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    }).returning()
    res.status(201).json(result)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

tasksRouter.patch('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const { title, description, priority, status, dueDate, position } = req.body

    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: 'Título deve ser uma string não vazia' })
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `Prioridade deve ser: ${VALID_PRIORITIES.join(', ')}` })
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status deve ser: ${VALID_STATUSES.join(', ')}` })
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Descrição deve ser uma string' })
    }
    if (position !== undefined && (typeof position !== 'number' || !Number.isFinite(position))) {
      return res.status(400).json({ error: 'Posição deve ser um número válido' })
    }

    if (title === undefined && description === undefined && priority === undefined && status === undefined && dueDate === undefined && position === undefined) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (title !== undefined) updates.title = title.trim()
    if (description !== undefined) updates.description = description
    if (priority !== undefined) updates.priority = priority
    if (status !== undefined) updates.status = status
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null
    if (position !== undefined) updates.position = position
    const [result] = await db.update(tasks).set(updates).where(eq(tasks.id, req.params.id)).returning()
    if (!result) return res.status(404).json({ error: 'Task not found' })
    res.json(result)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

tasksRouter.delete('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    await db.delete(tasks).where(eq(tasks.id, req.params.id))
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

tasksRouter.patch('/reorder/batch', async (req, res) => {
  try {
    const { items: orderItems } = req.body as { items: { id: string; position: number; status?: string }[] }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: 'Lista de itens é obrigatória' })
    }

    for (const item of orderItems) {
      if (!item.id || !UUID_REGEX.test(item.id)) {
        return res.status(400).json({ error: `ID inválido: ${item.id}` })
      }
      if (typeof item.position !== 'number' || !Number.isFinite(item.position)) {
        return res.status(400).json({ error: `Posição inválida para item ${item.id}` })
      }
      if (item.status !== undefined && !VALID_STATUSES.includes(item.status as typeof VALID_STATUSES[number])) {
        return res.status(400).json({ error: `Status inválido para item ${item.id}` })
      }
    }

    await Promise.all(orderItems.map((item) => {
      const updates: Record<string, unknown> = { position: item.position }
      if (item.status) updates.status = item.status
      return db.update(tasks).set(updates).where(eq(tasks.id, item.id))
    }))
    res.json({ success: true })
  } catch (error) {
    console.error('Error reordering tasks:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
