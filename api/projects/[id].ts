import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { projects } from '../../src/server/db/schema'
import { eq } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string

  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  if (req.method === 'GET') {
    try {
      const [result] = await db.select().from(projects).where(eq(projects.id, id))
      if (!result) return res.status(404).json({ error: 'Project not found' })
      return res.json(result)
    } catch (error) {
      console.error('Error fetching project:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PATCH') {
    try {
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
      const [result] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning()
      if (!result) return res.status(404).json({ error: 'Project not found' })
      return res.json(result)
    } catch (error) {
      console.error('Error updating project:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(projects).where(eq(projects.id, id))
      return res.status(204).send('')
    } catch (error) {
      console.error('Error deleting project:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
