import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { projects } from '../../src/server/db/schema'
import { asc, eq } from 'drizzle-orm'

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET = list projects
  if (req.method === 'GET') {
    try {
      const result = await db.select().from(projects).orderBy(asc(projects.position))
      return res.json(result)
    } catch (error) {
      console.error('Error fetching projects:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST = create project
  if (req.method === 'POST') {
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
      return res.status(201).json(result)
    } catch (error) {
      console.error('Error creating project:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // PATCH = reorder projects (batch)
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

      await Promise.all(orderItems.map((item) => db.update(projects).set({ position: item.position }).where(eq(projects.id, item.id))))
      return res.json({ success: true })
    } catch (error) {
      console.error('Error reordering projects:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
