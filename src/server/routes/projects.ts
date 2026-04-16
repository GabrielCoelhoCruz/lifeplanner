import { Router } from 'express'
import { db } from '../db'
import { projects } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const projectsRouter = Router()

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

projectsRouter.get('/', async (_req, res) => {
  try {
    const result = await db.select().from(projects).orderBy(asc(projects.position))
    res.json(result)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

projectsRouter.get('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    const [result] = await db.select().from(projects).where(eq(projects.id, req.params.id))
    if (!result) return res.status(404).json({ error: 'Project not found' })
    res.json(result)
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

projectsRouter.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório' })
    }
    if (color !== undefined && (typeof color !== 'string' || !HEX_COLOR_REGEX.test(color))) {
      return res.status(400).json({ error: 'Cor deve ser uma string hexadecimal válida (ex: #ff0000)' })
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Descrição deve ser uma string' })
    }

    const [result] = await db.insert(projects).values({ name: name.trim(), description, color }).returning()
    res.status(201).json(result)
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

projectsRouter.patch('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const { name, description, color, position } = req.body

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'Nome deve ser uma string não vazia' })
    }
    if (color !== undefined && (typeof color !== 'string' || !HEX_COLOR_REGEX.test(color))) {
      return res.status(400).json({ error: 'Cor deve ser uma string hexadecimal válida (ex: #ff0000)' })
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Descrição deve ser uma string' })
    }
    if (position !== undefined && (typeof position !== 'number' || !Number.isFinite(position))) {
      return res.status(400).json({ error: 'Posição deve ser um número válido' })
    }

    if (name === undefined && description === undefined && color === undefined && position === undefined) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (name !== undefined) updates.name = name.trim()
    if (description !== undefined) updates.description = description
    if (color !== undefined) updates.color = color
    if (position !== undefined) updates.position = position
    const [result] = await db.update(projects).set(updates).where(eq(projects.id, req.params.id)).returning()
    if (!result) return res.status(404).json({ error: 'Project not found' })
    res.json(result)
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

projectsRouter.delete('/:id', async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    await db.delete(projects).where(eq(projects.id, req.params.id))
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

projectsRouter.patch('/reorder/batch', async (req, res) => {
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

    await Promise.all(orderItems.map((item) => db.update(projects).set({ position: item.position }).where(eq(projects.id, item.id))))
    res.json({ success: true })
  } catch (error) {
    console.error('Error reordering projects:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
