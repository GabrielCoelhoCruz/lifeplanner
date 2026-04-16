import { Router } from 'express'
import { db } from '../db'
import { tasks, projects } from '../db/schema'
import { eq, lte, gte, and, ne, asc, desc } from 'drizzle-orm'

export const viewsRouter = Router()

// GET /api/views/today — tasks due today or overdue, grouped by status
viewsRouter.get('/today', async (_req, res) => {
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

    res.json(result)
  } catch (error) {
    console.error('Today view error:', error)
    res.status(500).json({ error: 'Erro ao carregar visão de hoje' })
  }
})

// GET /api/views/upcoming — tasks due in the next 7 days (not overdue, not done)
viewsRouter.get('/upcoming', async (_req, res) => {
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

    res.json(result)
  } catch (error) {
    console.error('Upcoming view error:', error)
    res.status(500).json({ error: 'Erro ao carregar próximas tarefas' })
  }
})
