import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { projects, tasks, items } from '../../src/server/db/schema'
import { asc } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const allProjects = await db.select().from(projects).orderBy(asc(projects.position))
    const allTasks = await db.select().from(tasks).orderBy(asc(tasks.position))
    const allItems = await db.select().from(items).orderBy(asc(items.position))
    return res.json({ projects: allProjects, tasks: allTasks, items: allItems })
  } catch (error) {
    console.error('Export error:', error)
    return res.status(500).json({ error: 'Erro ao exportar dados' })
  }
}
