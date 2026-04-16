import { Router } from 'express'
import { db } from '../db'
import { items } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const itemsRouter = Router()

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

itemsRouter.get('/task/:taskId', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.taskId)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    const result = await db.select().from(items).where(eq(items.taskId, req.params.taskId)).orderBy(asc(items.position))
    res.json(result)
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

itemsRouter.post('/', async (req, res) => {
  try {
    const { taskId, title, description } = req.body

    if (!taskId || typeof taskId !== 'string' || !UUID_REGEX.test(taskId)) {
      return res.status(400).json({ error: 'taskId é obrigatório e deve ser um UUID válido' })
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Descrição deve ser uma string' })
    }

    const [result] = await db.insert(items).values({ taskId, title: title.trim(), description }).returning()
    res.status(201).json(result)
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

itemsRouter.patch('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const { title, description, isCompleted, position } = req.body

    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: 'Título deve ser uma string não vazia' })
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Descrição deve ser uma string' })
    }
    if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
      return res.status(400).json({ error: 'isCompleted deve ser um booleano' })
    }
    if (position !== undefined && (typeof position !== 'number' || !Number.isFinite(position))) {
      return res.status(400).json({ error: 'Posição deve ser um número válido' })
    }

    if (title === undefined && description === undefined && isCompleted === undefined && position === undefined) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' })
    }

    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title.trim()
    if (description !== undefined) updates.description = description
    if (isCompleted !== undefined) updates.isCompleted = isCompleted
    if (position !== undefined) updates.position = position
    const [result] = await db.update(items).set(updates).where(eq(items.id, req.params.id)).returning()
    if (!result) return res.status(404).json({ error: 'Item not found' })
    res.json(result)
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

itemsRouter.delete('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    await db.delete(items).where(eq(items.id, req.params.id))
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

itemsRouter.patch('/reorder/batch', async (req, res) => {
  try {
    const { items: orderItems } = req.body as { items: { id: string; position: number }[] }

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
    }

    await Promise.all(orderItems.map((item) => db.update(items).set({ position: item.position }).where(eq(items.id, item.id))))
    res.json({ success: true })
  } catch (error) {
    console.error('Error reordering items:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
