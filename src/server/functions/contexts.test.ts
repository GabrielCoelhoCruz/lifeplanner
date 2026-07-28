import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the db + auth layers so the context rules can be verified without a live
// database. The stub builder resolves a value we control per-call.
vi.mock('../db', () => ({ db: { select: vi.fn() } }))
vi.mock('../auth', () => ({
  requireUser: vi.fn(),
  type: { AuthUser: {} },
}))

import { db } from '../db'
import { requireUser, type AuthUser } from '../auth'
import { getTableConfig, PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'
import { contexts } from '../db/schema'
import {
  normalizeContextName,
  validateContextName,
  assertContextOwned,
} from './contexts'

const user: AuthUser = { id: 'user-1', email: 'a@b.com', name: 'A', image: null }

type ChainablePromise = Promise<unknown> & Record<string, unknown>

function builder(resolveValue: unknown) {
  // A genuine Promise resolving to the value we control, but also answering the
  // drizzle chain methods (from/where/orderBy/values/set/returning) by returning
  // a fresh chainable promise. Awaiting yields `resolveValue`.
  const chain = (resolvedValue: unknown): ChainablePromise => {
    const p = Promise.resolve(resolvedValue)
    return new Proxy(p, {
      get(target, prop) {
        if (
          ['from', 'where', 'orderBy', 'values', 'set', 'returning'].includes(
            prop as string,
          )
        ) {
          return () => chain(resolvedValue)
        }
        const nativeValue = Reflect.get(target, prop, target)
        return typeof nativeValue === 'function'
          ? nativeValue.bind(target)
          : nativeValue
      },
    }) as ChainablePromise
  }
  return chain(resolveValue) as never
}

function mockSelect(value: unknown) {
  vi.mocked(db.select).mockReturnValue(builder(value))
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(requireUser).mockResolvedValue(user)
})

describe('normalizeContextName', () => {
  it('trims and collapses internal whitespace', () => {
    expect(normalizeContextName('  CIA  ')).toBe('CIA')
    expect(normalizeContextName('Learned   Hand')).toBe('Learned Hand')
    expect(normalizeContextName('\tPessoal\n')).toBe('Pessoal')
  })
})

describe('validateContextName', () => {
  it('returns the normalized name for valid input', () => {
    expect(validateContextName('  Learned   Hand ')).toBe('Learned Hand')
  })

  it('throws on empty or whitespace-only input', () => {
    expect(() => validateContextName('')).toThrow('Context name is required')
    expect(() => validateContextName('   ')).toThrow('Context name is required')
    expect(() => validateContextName(undefined)).toThrow('Context name is required')
  })
})

describe('assertContextOwned', () => {
  it('returns the context when it belongs to the user', async () => {
    const row = { id: 'ctx-1', userId: 'user-1', name: 'CIA' }
    mockSelect([row])
    expect(await assertContextOwned('ctx-1', user)).toEqual(row)
  })

  it('throws when the context does not belong to the user', async () => {
    mockSelect([])
    await expect(assertContextOwned('ctx-other', user)).rejects.toThrow(
      'Context not found',
    )
  })
})


describe('cross-user isolation (schema-enforced rules)', () => {
  it('assertContextOwned matches on user_id, rejecting another user row', async () => {
    // A row exists but belongs to a different user -> must throw.
    mockSelect([{ id: 'ctx-1', userId: 'user-2', name: 'CIA' }])
    await expect(assertContextOwned('ctx-1', user)).rejects.toThrow(
      'Context not found',
    )
  })

  it('preserves user casing; case-insensitive uniqueness is delegated to the DB unique index', () => {
    // The function layer only trims/collapses whitespace and keeps the user's
    // casing. Uniqueness for `CIA` vs `cia` is enforced by the unique index
    // `contexts_user_lower_name_unq` at the database level.
    expect(validateContextName('CIA')).toBe('CIA')
    expect(validateContextName('cia')).toBe('cia')
  })

  it('defines a per-user case-insensitive unique index', () => {
    const index = getTableConfig(contexts).indexes.find(
      ({ config }) => config.name === 'contexts_user_lower_name_unq',
    )

    expect(index?.config.unique).toBe(true)
    expect(index?.config.columns).toHaveLength(2)
    expect(index?.config.columns[0]).toMatchObject({ name: 'user_id' })
    const nameExpression = new PgDialect().sqlToQuery(
      index!.config.columns[1] as SQL,
    ).sql
    expect(nameExpression).toBe('lower("contexts"."name")')
  })
})
