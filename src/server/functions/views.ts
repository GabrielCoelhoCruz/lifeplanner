import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { tasks, projects, contexts } from '../db/schema'
import { eq, lte, gte, and, ne, asc, sql } from 'drizzle-orm'
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
        projectContext: contexts.name,
        projectContextId: projects.contextId,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .innerJoin(contexts, eq(projects.contextId, contexts.id))
      .where(
        and(
          eq(projects.userId, user.id),
          ne(tasks.status, 'done'),
          lte(tasks.dueDate, endOfDay),
        ),
      )
      .orderBy(
        asc(tasks.dueDate),
        sql`case ${tasks.priority} when 'high' then 1 when 'medium' then 2 else 3 end`,
      )
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
        projectContext: contexts.name,
        projectContextId: projects.contextId,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .innerJoin(contexts, eq(projects.contextId, contexts.id))
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
