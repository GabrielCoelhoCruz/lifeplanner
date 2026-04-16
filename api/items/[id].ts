import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { items } from '../../src/server/db/schema'
import { eq } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string

  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  if (req.method === 'PATCH') {
    try {
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
      const [result] = await db.update(items).set(updates).where(eq(items.id, id)).returning()
      if (!result) return res.status(404).json({ error: 'Item not found' })
      return res.json(result)
    } catch (error) {
      console.error('Error updating item:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(items).where(eq(items.id, id))
      return res.status(204).send('')
    } catch (error) {
      console.error('Error deleting item:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
