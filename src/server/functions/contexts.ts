import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { contexts } from '../db/schema'
import { eq, and, asc, isNull } from 'drizzle-orm'
import { requireUser, type AuthUser } from '../auth'

export interface NewContextInput {
  name: string
  description?: string
  color: string
  icon?: string | null
}

export interface UpdateContextInput {
  name?: string
  description?: string
  color?: string
  icon?: string | null
}

/**
 * Normalize a context name for comparison and storage: trim and collapse
 * internal whitespace. Uniqueness is case-insensitive (enforced by the DB
 * unique index on lower(name)), so callers must not rely on casing to
 * differentiate two contexts.
 */
export function normalizeContextName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

/**
 * Validate a desired context name, returning the normalized value or throwing
 * if it is empty. Pure + synchronous so it is trivially unit-testable.
 */
export function validateContextName(raw: string | undefined): string {
  const name = normalizeContextName(raw ?? '')
  if (!name) throw new Error('Context name is required')
  return name
}

/**
 * Pure ownership check used by every mutation/query path. Throws when the
 * context does not belong to the acting user. The DB `where(user_id)` clause is
 * the primary guard; we re-assert ownership in code as defense-in-depth so a
 * missed join or filter can never leak another user's context.
 */
export async function assertContextOwned(
  contextId: string,
  user: AuthUser,
): Promise<typeof contexts.$inferSelect> {
  const [row] = await db
    .select()
    .from(contexts)
    .where(and(eq(contexts.id, contextId), eq(contexts.userId, user.id)))
  if (!row) throw new Error('Context not found')
  if (row.userId !== user.id) throw new Error('Context not found')
  return row
}


export const listContexts = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await requireUser()
  return db
    .select()
    .from(contexts)
    .where(eq(contexts.userId, user.id))
    .orderBy(asc(contexts.position), asc(contexts.name))
})

export const getContext = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser()
    return assertContextOwned(data.id, user)
  })

export const createContext = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { name: string; description?: string; color: string; icon?: string | null }) =>
      data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    const name = validateContextName(data.name)
    const [result] = await db
      .insert(contexts)
      .values({
        userId: user.id,
        name,
        description: data.description ?? '',
        color: data.color,
        icon: data.icon ?? null,
      })
      .returning()
    return result
  })

export const updateContext = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      id: string
      name?: string
      description?: string
      color?: string
      icon?: string | null
    }) => data,
  )
  .handler(async ({ data }) => {
    const user = await requireUser()
    const existing = await assertContextOwned(data.id, user)

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (data.name !== undefined) updates.name = validateContextName(data.name)
    if (data.description !== undefined) updates.description = data.description
    if (data.color !== undefined) updates.color = data.color
    if (data.icon !== undefined) updates.icon = data.icon

    const [result] = await db
      .update(contexts)
      .set(updates)
      .where(
        and(eq(contexts.id, existing.id), eq(contexts.userId, user.id)),
      )
      .returning()
    return result
  })

/**
 * Archive (soft-delete) a context. Existing projects retain their foreign key
 * and remain readable; archived contexts disappear only from normal selectors.
 * Hard deletion is intentionally unavailable while projects may reference it.
 */
export const archiveContext = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const existing = await assertContextOwned(data.id, user)
    if (existing.archivedAt) return existing

    const [result] = await db
      .update(contexts)
      .set({ archivedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(contexts.id, existing.id), eq(contexts.userId, user.id)),
      )
      .returning()
    return result
  })

/** List only contexts the user can still attach projects to. */
export const listActiveContexts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    return db
      .select()
      .from(contexts)
      .where(and(eq(contexts.userId, user.id), isNull(contexts.archivedAt)))
      .orderBy(asc(contexts.position), asc(contexts.name))
  },
)
