import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { items } from '../../src/server/db/schema'
import { eq, asc } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET = list items by taskId query param
  if (req.method === 'GET') {
    const taskId = req.query.taskId as string

    if (!taskId || !UUID_REGEX.test(taskId)) {
      return res.status(400).json({ error: 'taskId query param é obrigatório e deve ser um UUID válido' })
    }

    try {
      const result = await db.select().from(items).where(eq(items.taskId, taskId)).orderBy(asc(items.position))
      return res.json(result)
    } catch (error) {
      console.error('Error fetching items:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST = create item
  if (req.method === 'POST') {
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
      return res.status(201).json(result)
    } catch (error) {
      console.error('Error creating item:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // PATCH = reorder items (batch)
  if (req.method === 'PATCH') {
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
      return res.json({ success: true })
    } catch (error) {
      console.error('Error reordering items:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
