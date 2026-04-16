import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { tasks } from '../../src/server/db/schema'
import { eq } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const VALID_PRIORITIES = ['high', 'medium', 'low'] as const
const VALID_STATUSES = ['todo', 'in_progress', 'done'] as const

function calculateNextDueDate(
  currentDueDate: Date | null,
  recurrence: string,
  recurrenceDays: string | null
): Date {
  const base = currentDueDate ? new Date(currentDueDate) : new Date()

  switch (recurrence) {
    case 'daily':
      base.setDate(base.getDate() + 1)
      break
    case 'weekly':
      base.setDate(base.getDate() + 7)
      break
    case 'monthly':
      base.setMonth(base.getMonth() + 1)
      break
    case 'weekdays': {
      const days = (recurrenceDays || '1,2,3,4,5').split(',').map(Number)
      const next = new Date(base)
      next.setDate(next.getDate() + 1)
      let safety = 0
      while (!days.includes(next.getDay()) && safety < 7) {
        next.setDate(next.getDate() + 1)
        safety++
      }
      return next
    }
  }
  return base
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string

  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  if (req.method === 'GET') {
    try {
      const [result] = await db.select().from(tasks).where(eq(tasks.id, id))
      if (!result) return res.status(404).json({ error: 'Task not found' })
      return res.json(result)
    } catch (error) {
      console.error('Error fetching task:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { title, description, priority, status, dueDate, position, recurrence, recurrenceDays } = req.body

      if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: 'Título deve ser uma string não vazia' })
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
      if (position !== undefined && (typeof position !== 'number' || !Number.isFinite(position))) {
        return res.status(400).json({ error: 'Posição deve ser um número válido' })
      }

      if (title === undefined && description === undefined && priority === undefined && status === undefined && dueDate === undefined && position === undefined && recurrence === undefined && recurrenceDays === undefined) {
        return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' })
      }

      const updates: Record<string, unknown> = { updatedAt: new Date() }
      if (title !== undefined) updates.title = title.trim()
      if (description !== undefined) updates.description = description
      if (priority !== undefined) updates.priority = priority
      if (status !== undefined) updates.status = status
      if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null
      if (position !== undefined) updates.position = position
      if (recurrence !== undefined) updates.recurrence = recurrence
      if (recurrenceDays !== undefined) updates.recurrenceDays = recurrenceDays
      const [result] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning()
      if (!result) return res.status(404).json({ error: 'Task not found' })

      // Auto-create next occurrence for recurring tasks marked as done
      if (updates.status === 'done' && result.recurrence && result.recurrence !== 'none') {
        const nextDueDate = calculateNextDueDate(result.dueDate, result.recurrence, result.recurrenceDays)
        await db.insert(tasks).values({
          projectId: result.projectId,
          title: result.title,
          description: result.description,
          priority: result.priority,
          status: 'todo',
          dueDate: nextDueDate,
          position: result.position,
          recurrence: result.recurrence,
          recurrenceDays: result.recurrenceDays,
        })
      }

      return res.json(result)
    } catch (error) {
      console.error('Error updating task:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(tasks).where(eq(tasks.id, id))
      return res.status(204).send('')
    } catch (error) {
      console.error('Error deleting task:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
