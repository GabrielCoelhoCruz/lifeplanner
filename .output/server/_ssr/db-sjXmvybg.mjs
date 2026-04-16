import { i as TSS_SERVER_FUNCTION } from "./esm-CjOGw2QJ.mjs";
import "../_libs/dotenv.mjs";
import { t as cs } from "../_libs/neondatabase__serverless.mjs";
import { d as pgTable, f as uuid, g as boolean, h as integer, m as text, p as timestamp, t as drizzle, v as pgEnum } from "../_libs/drizzle-orm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-sjXmvybg.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var schema_exports = /* @__PURE__ */ __exportAll({
	items: () => items,
	priorityEnum: () => priorityEnum,
	projects: () => projects,
	recurrenceEnum: () => recurrenceEnum,
	statusEnum: () => statusEnum,
	tasks: () => tasks
});
var priorityEnum = pgEnum("priority", [
	"high",
	"medium",
	"low"
]);
var statusEnum = pgEnum("status", [
	"todo",
	"in_progress",
	"done"
]);
var recurrenceEnum = pgEnum("recurrence", [
	"daily",
	"weekly",
	"monthly",
	"weekdays",
	"none"
]);
var projects = pgTable("projects", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description").default(""),
	color: text("color").default("#6366F1"),
	position: integer("position").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var tasks = pgTable("tasks", {
	id: uuid("id").defaultRandom().primaryKey(),
	projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
	title: text("title").notNull(),
	description: text("description").default(""),
	priority: priorityEnum("priority").default("medium").notNull(),
	status: statusEnum("status").default("todo").notNull(),
	dueDate: timestamp("due_date"),
	position: integer("position").default(0),
	recurrence: recurrenceEnum("recurrence").default("none").notNull(),
	recurrenceDays: text("recurrence_days"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var items = pgTable("items", {
	id: uuid("id").defaultRandom().primaryKey(),
	taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
	title: text("title").notNull(),
	description: text("description").default(""),
	isCompleted: boolean("is_completed").default(false).notNull(),
	position: integer("position").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var db = drizzle(cs(process.env.DATABASE_URL), { schema: schema_exports });
//#endregion
export { tasks as a, projects as i, db as n, items as r, createServerRpc as t };
