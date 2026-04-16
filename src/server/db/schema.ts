import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low'])
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'done'])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
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
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
