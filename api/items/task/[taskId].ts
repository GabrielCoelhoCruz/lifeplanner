import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../_db'
import { items } from '../../../src/server/db/schema'
import { eq, asc } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const taskId = req.query.taskId as string

  if (!taskId || !UUID_REGEX.test(taskId)) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const result = await db.select().from(items).where(eq(items.taskId, taskId)).orderBy(asc(items.position))
    return res.json(result)
  } catch (error) {
    console.error('Error fetching items:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
