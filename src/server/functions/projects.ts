import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { projects, contexts } from '../db/schema'
import { eq, and, asc, getTableColumns } from 'drizzle-orm'
import { requireUser, type AuthUser } from '../auth'
import type { Project } from '../db/schema'

export type ProjectWithContext = Project & {
  contextName: string
  contextColor: string
}

async function assertContextOwned(
  contextId: string,
  user: AuthUser,
): Promise<{ id: string; name: string }> {
  const [ctx] = await db
    .select({ id: contexts.id, name: contexts.name })
    .from(contexts)
    .where(and(eq(contexts.id, contextId), eq(contexts.userId, user.id)))
  if (!ctx) throw new Error('Context not found')
  return ctx
}

export const listProjects = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    return db
      .select({
        ...getTableColumns(projects),
        contextName: contexts.name,
        contextColor: contexts.color,
      })
      .from(projects)
      .innerJoin(contexts, eq(projects.contextId, contexts.id))
      .where(eq(projects.userId, user.id))
      .orderBy(asc(projects.position))
  },
)

export const getProject = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [result] = await db
      .select({
        ...getTableColumns(projects),
        contextName: contexts.name,
        contextColor: contexts.color,
      })
      .from(projects)
      .innerJoin(contexts, eq(projects.contextId, contexts.id))
      .where(and(eq(projects.id, data.id), eq(projects.userId, user.id)))
    if (!result) throw new Error('Project not found')
    return result
  })

export const createProject = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      name: string
      description?: string
      contextId: string
      color?: string
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    if (!data.name?.trim()) throw new Error('Nome é obrigatório')

    await assertContextOwned(data.contextId, user)

    const [result] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name: data.name.trim(),
        description: data.description || '',
        contextId: data.contextId,
        color: data.color || '#6366F1',
      })
      .returning()
    return result
  })

export const updateProject = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      id: string
      name?: string
      description?: string
      contextId?: string
      color?: string
      position?: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    const { id, ...fields } = data
    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (fields.name !== undefined) updates.name = fields.name.trim()
    if (fields.description !== undefined) updates.description = fields.description
    if (fields.position !== undefined) updates.position = fields.position
    if (fields.color !== undefined) updates.color = fields.color

    if (fields.contextId !== undefined) {
      const ctx = await assertContextOwned(fields.contextId, user)
      updates.contextId = ctx.id
    }

    const [result] = await db
      .update(projects)
      .set(updates)
      .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
      .returning()
    if (!result) throw new Error('Project not found')
    return result
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await db
      .delete(projects)
      .where(and(eq(projects.id, data.id), eq(projects.userId, user.id)))
    return { success: true }
  })

export const reorderProjects = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { items: { id: string; position: number }[] }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    await Promise.all(
      data.items.map((item) =>
        db
          .update(projects)
          .set({ position: item.position })
          .where(and(eq(projects.id, item.id), eq(projects.userId, user.id))),
      ),
    )
    return { success: true }
  })
