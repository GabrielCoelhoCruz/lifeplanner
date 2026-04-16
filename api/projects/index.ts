import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { projects } from '../../src/server/db/schema'
import { asc } from 'drizzle-orm'

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const result = await db.select().from(projects).orderBy(asc(projects.position))
      return res.json(result)
    } catch (error) {
      console.error('Error fetching projects:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

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

  return res.status(405).json({ error: 'Method not allowed' })
}
