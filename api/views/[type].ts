import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { tasks, projects } from '../../src/server/db/schema'
import { eq, lte, gte, and, ne, asc, desc } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const type = req.query.type as string

  if (type === 'today') {
    try {
      const now = new Date()
      const endOfDay = new Date(now)
      endOfDay.setHours(23, 59, 59, 999)

      const result = await db
        .select({
          task: tasks,
          projectName: projects.name,
          projectColor: projects.color,
        })
        .from(tasks)
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(
            ne(tasks.status, 'done'),
            lte(tasks.dueDate, endOfDay)
          )
        )
        .orderBy(asc(tasks.dueDate), desc(tasks.priority))

      return res.json(result)
    } catch (error) {
      console.error('Today view error:', error)
      return res.status(500).json({ error: 'Erro ao carregar visão de hoje' })
    }
  }

  if (type === 'upcoming') {
    try {
      const now = new Date()
      const startOfTomorrow = new Date(now)
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)
      startOfTomorrow.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(now)
      endOfWeek.setDate(endOfWeek.getDate() + 7)
      endOfWeek.setHours(23, 59, 59, 999)

      const result = await db
        .select({
          task: tasks,
          projectName: projects.name,
          projectColor: projects.color,
        })
        .from(tasks)
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(
            ne(tasks.status, 'done'),
            gte(tasks.dueDate, startOfTomorrow),
            lte(tasks.dueDate, endOfWeek)
          )
        )
        .orderBy(asc(tasks.dueDate))

      return res.json(result)
    } catch (error) {
      console.error('Upcoming view error:', error)
      return res.status(500).json({ error: 'Erro ao carregar próximas tarefas' })
    }
  }

  return res.status(400).json({ error: 'Invalid view type. Use "today" or "upcoming".' })
}
