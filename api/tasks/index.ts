import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { tasks } from '../../src/server/db/schema'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const VALID_PRIORITIES = ['high', 'medium', 'low'] as const
const VALID_STATUSES = ['todo', 'in_progress', 'done'] as const

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { projectId, title, description, priority, status, dueDate, recurrence, recurrenceDays } = req.body

    if (!projectId || typeof projectId !== 'string' || !UUID_REGEX.test(projectId)) {
      return res.status(400).json({ error: 'projectId é obrigatório e deve ser um UUID válido' })
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }
    if (priority !== undefined && !(VALID_PRIORITIES as readonly string[]).includes(priority)) {
      return res.status(400).json({ error: `Prioridade deve ser: ${VALID_PRIORITIES.join(', ')}` })
    }
    if (status !== undefined && !(VALID_STATUSES as readonly string[]).includes(status)) {
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
      recurrence: recurrence || 'none',
      recurrenceDays: recurrenceDays || null,
    }).returning()
    return res.status(201).json(result)
  } catch (error) {
    console.error('Error creating task:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
