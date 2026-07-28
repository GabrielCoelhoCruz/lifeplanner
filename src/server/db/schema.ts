import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low'])
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'done'])
export const recurrenceEnum = pgEnum('recurrence', ['daily', 'weekly', 'monthly', 'weekdays', 'none'])

export const contexts = pgTable(
  'contexts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    description: text('description').default('').notNull(),
    color: text('color').notNull(),
    icon: text('icon'),
    position: integer('position').default(0).notNull(),
    archivedAt: timestamp('archived_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserContext: uniqueIndex('contexts_user_lower_name_unq').on(
      table.userId,
      sql`lower(${table.name})`,
    ),
  }),
)

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description').default(''),
  contextId: uuid('context_id').references(() => contexts.id, {
    onDelete: 'restrict',
  }).notNull(),
  color: text('color').default('#6366F1'),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  priority: priorityEnum('priority').default('medium').notNull(),
  status: statusEnum('status').default('todo').notNull(),
  dueDate: timestamp('due_date'),
  position: integer('position').default(0),
  recurrence: recurrenceEnum('recurrence').default('none').notNull(),
  recurrenceDays: text('recurrence_days'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  isCompleted: boolean('is_completed').default(false).notNull(),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Context = typeof contexts.$inferSelect
export type NewContext = typeof contexts.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
