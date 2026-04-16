import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_db'
import { projects, tasks, items } from '../../src/server/db/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { projects: importProjects, tasks: importTasks, items: importItems } = req.body

    if (!Array.isArray(importProjects)) {
      return res.status(400).json({ error: 'Formato inválido' })
    }

    const projectIdMap = new Map<string, string>() // old ID -> new ID
    const taskIdMap = new Map<string, string>()

    // 1. Create projects and map old IDs to new IDs
    for (const p of importProjects) {
      const [created] = await db.insert(projects).values({
        name: p.name,
        description: p.description || '',
        color: p.color || '#6366F1',
        position: p.position || 0,
      }).returning()
      projectIdMap.set(p.id, created.id)
    }

    // 2. Create tasks with mapped project IDs
    if (Array.isArray(importTasks)) {
      for (const t of importTasks) {
        const newProjectId = projectIdMap.get(t.projectId || t.project_id)
        if (!newProjectId) continue // skip orphaned tasks
        const [created] = await db.insert(tasks).values({
          projectId: newProjectId,
          title: t.title,
          description: t.description || '',
          priority: t.priority || 'medium',
          status: t.status || 'todo',
          dueDate: t.dueDate || t.due_date ? new Date(t.dueDate || t.due_date) : null,
          recurrence: t.recurrence || 'none',
          recurrenceDays: t.recurrenceDays || t.recurrence_days || null,
          position: t.position || 0,
        }).returning()
        taskIdMap.set(t.id, created.id)
      }
    }

    // 3. Create items with mapped task IDs
    if (Array.isArray(importItems)) {
      for (const i of importItems) {
        const newTaskId = taskIdMap.get(i.taskId || i.task_id)
        if (!newTaskId) continue // skip orphaned items
        await db.insert(items).values({
          taskId: newTaskId,
          title: i.title,
          description: i.description || '',
          isCompleted: i.isCompleted || i.is_completed || false,
          position: i.position || 0,
        })
      }
    }

    return res.json({
      success: true,
      imported: {
        projects: projectIdMap.size,
        tasks: taskIdMap.size,
        items: importItems ? importItems.filter((i: { taskId?: string; task_id?: string }) => taskIdMap.has(i.taskId || i.task_id || '')).length : 0,
      },
    })
  } catch (error) {
    console.error('Import error:', error)
    return res.status(500).json({ error: 'Erro ao importar dados' })
  }
}
