import { c as createServerFn } from "./esm-CjOGw2QJ.mjs";
import { r as asc } from "../_libs/drizzle-orm.mjs";
import { a as tasks, i as projects, n as db, r as items, t as createServerRpc } from "./db-sjXmvybg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-BZFLFMwC.js
var exportAllData_createServerFn_handler = createServerRpc({
	id: "1b04b0da3f81f69cee69a8e07052ef264ff8778d06c80f61e2f9288412681da2",
	name: "exportAllData",
	filename: "src/server/functions/data.ts"
}, (opts) => exportAllData.__executeServer(opts));
var exportAllData = createServerFn({ method: "GET" }).handler(exportAllData_createServerFn_handler, async () => {
	return {
		projects: await db.select().from(projects).orderBy(asc(projects.position)),
		tasks: await db.select().from(tasks).orderBy(asc(tasks.position)),
		items: await db.select().from(items).orderBy(asc(items.position))
	};
});
var importAllData_createServerFn_handler = createServerRpc({
	id: "3597380c0393400e5831aae30e704324f8a5571d755134083366fbc1a0c8483a",
	name: "importAllData",
	filename: "src/server/functions/data.ts"
}, (opts) => importAllData.__executeServer(opts));
var importAllData = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(importAllData_createServerFn_handler, async ({ data }) => {
	const importProjects = data.projects;
	const importTasks = data.tasks;
	const importItems = data.items;
	if (!Array.isArray(importProjects)) throw new Error("Formato inválido");
	const projectIdMap = /* @__PURE__ */ new Map();
	const taskIdMap = /* @__PURE__ */ new Map();
	for (const p of importProjects) {
		const [created] = await db.insert(projects).values({
			name: p.name,
			description: p.description || "",
			color: p.color || "#6366F1",
			position: p.position || 0
		}).returning();
		projectIdMap.set(p.id, created.id);
	}
	if (Array.isArray(importTasks)) for (const t of importTasks) {
		const newProjectId = projectIdMap.get(t.projectId || t.project_id);
		if (!newProjectId) continue;
		const [created] = await db.insert(tasks).values({
			projectId: newProjectId,
			title: t.title,
			description: t.description || "",
			priority: t.priority || "medium",
			status: t.status || "todo",
			dueDate: t.dueDate || t.due_date ? new Date(t.dueDate || t.due_date) : null,
			recurrence: t.recurrence || "none",
			recurrenceDays: t.recurrenceDays || t.recurrence_days || null,
			position: t.position || 0
		}).returning();
		taskIdMap.set(t.id, created.id);
	}
	if (Array.isArray(importItems)) for (const i of importItems) {
		const newTaskId = taskIdMap.get(i.taskId || i.task_id);
		if (!newTaskId) continue;
		await db.insert(items).values({
			taskId: newTaskId,
			title: i.title,
			description: i.description || "",
			isCompleted: i.isCompleted || i.is_completed || false,
			position: i.position || 0
		});
	}
	return {
		success: true,
		imported: {
			projects: projectIdMap.size,
			tasks: taskIdMap.size,
			items: importItems ? importItems.filter((i) => taskIdMap.has(i.taskId || i.task_id || "")).length : 0
		}
	};
});
//#endregion
export { exportAllData_createServerFn_handler, importAllData_createServerFn_handler };
