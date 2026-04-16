import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { tasks, projects } from '../../src/server/db/schema'
import { eq, lte, and, ne, asc, desc } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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
