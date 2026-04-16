import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { tasks, items } from '../../src/server/db/schema'
import { eq, asc, sql, inArray, count } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const VALID_PRIORITIES = ['high', 'medium', 'low'] as const
const VALID_STATUSES = ['todo', 'in_progress', 'done'] as const

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET = list tasks by projectId query param
  if (req.method === 'GET') {
    const projectId = req.query.projectId as string

    if (!projectId || !UUID_REGEX.test(projectId)) {
      return res.status(400).json({ error: 'projectId query param é obrigatório e deve ser um UUID válido' })
    }

    try {
      const taskList = await db.select().from(tasks).where(eq(tasks.projectId, projectId)).orderBy(asc(tasks.position))

      const taskIds = taskList.map(t => t.id)
      if (taskIds.length > 0) {
        const counts = await db
          .select({
            taskId: items.taskId,
            total: count(),
            done: count(sql`CASE WHEN ${items.isCompleted} = true THEN 1 END`),
          })
          .from(items)
          .where(inArray(items.taskId, taskIds))
          .groupBy(items.taskId)

        const countMap = new Map(
          counts.map(c => [c.taskId, { total: Number(c.total), done: Number(c.done) }])
        )

        return res.json(taskList.map(t => ({
          ...t,
          itemCount: countMap.get(t.id)?.total ?? 0,
          itemDoneCount: countMap.get(t.id)?.done ?? 0,
        })))
      }

      return res.json(taskList.map(t => ({ ...t, itemCount: 0, itemDoneCount: 0 })))
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST = create task
  if (req.method === 'POST') {
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

  // PATCH = reorder tasks (batch)
  if (req.method === 'PATCH') {
    try {
      const { items: orderItems } = req.body as { items: { id: string; position: number; status?: string }[] }

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
        if (item.status !== undefined && !(VALID_STATUSES as readonly string[]).includes(item.status)) {
          return res.status(400).json({ error: `Status inválido para item ${item.id}` })
        }
      }

      await Promise.all(orderItems.map((item) => {
        const updates: Record<string, unknown> = { position: item.position }
        if (item.status) updates.status = item.status
        return db.update(tasks).set(updates).where(eq(tasks.id, item.id))
      }))
      return res.json({ success: true })
    } catch (error) {
      console.error('Error reordering tasks:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
