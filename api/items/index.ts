import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { items } from '../../src/server/db/schema'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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
