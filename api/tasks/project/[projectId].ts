import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../_db'
import { tasks, items } from '../../../src/server/db/schema'
import { eq, asc, sql, inArray, count } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const projectId = req.query.projectId as string

  if (!projectId || !UUID_REGEX.test(projectId)) {
    return res.status(400).json({ error: 'ID inválido' })
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
