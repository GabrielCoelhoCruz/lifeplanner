import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { tasks, projects } from '../db/schema'
import { eq, lte, gte, and, ne, asc, desc } from 'drizzle-orm'
import { requireUser } from '../auth'

export const getTodayTasks = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    return db
      .select({
        task: tasks,
        projectName: projects.name,
        projectColor: projects.color,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(projects.userId, user.id),
          ne(tasks.status, 'done'),
          lte(tasks.dueDate, endOfDay),
        ),
      )
      .orderBy(asc(tasks.dueDate), desc(tasks.priority))
  },
)

export const getUpcomingTasks = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    const now = new Date()
    const startOfTomorrow = new Date(now)
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)
    startOfTomorrow.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(now)
    endOfWeek.setDate(endOfWeek.getDate() + 7)
    endOfWeek.setHours(23, 59, 59, 999)

    return db
      .select({
        task: tasks,
        projectName: projects.name,
        projectColor: projects.color,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(projects.userId, user.id),
          ne(tasks.status, 'done'),
          gte(tasks.dueDate, startOfTomorrow),
          lte(tasks.dueDate, endOfWeek),
        ),
      )
      .orderBy(asc(tasks.dueDate))
  },
)
