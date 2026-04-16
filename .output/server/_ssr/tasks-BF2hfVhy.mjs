import { c as createServerFn } from "./esm-CjOGw2QJ.mjs";
import { _ as sql, c as inArray, n as count, o as eq, r as asc } from "../_libs/drizzle-orm.mjs";
import { a as tasks, n as db, r as items, t as createServerRpc } from "./db-sjXmvybg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-BF2hfVhy.js
function calculateNextDueDate(currentDueDate, recurrence, recurrenceDays) {
	const base = currentDueDate ? new Date(currentDueDate) : /* @__PURE__ */ new Date();
	switch (recurrence) {
		case "daily":
			base.setDate(base.getDate() + 1);
			break;
		case "weekly":
			base.setDate(base.getDate() + 7);
			break;
		case "monthly":
			base.setMonth(base.getMonth() + 1);
			break;
		case "weekdays": {
			const days = (recurrenceDays || "1,2,3,4,5").split(",").map(Number);
			const next = new Date(base);
			next.setDate(next.getDate() + 1);
			let safety = 0;
			while (!days.includes(next.getDay()) && safety < 7) {
				next.setDate(next.getDate() + 1);
				safety++;
			}
			return next;
		}
	}
	return base;
}
var listTasksByProject_createServerFn_handler = createServerRpc({
	id: "78244f76f4a8778f3b41e9ef2b038ea22cf75a86fd7bc26e777d772372df1ee4",
	name: "listTasksByProject",
	filename: "src/server/functions/tasks.ts"
}, (opts) => listTasksByProject.__executeServer(opts));
var listTasksByProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(listTasksByProject_createServerFn_handler, async ({ data }) => {
	const taskList = await db.select().from(tasks).where(eq(tasks.projectId, data.projectId)).orderBy(asc(tasks.position));
	const taskIds = taskList.map((t) => t.id);
	if (taskIds.length > 0) {
		const counts = await db.select({
			taskId: items.taskId,
			total: count(),
			done: count(sql`CASE WHEN ${items.isCompleted} = true THEN 1 END`)
		}).from(items).where(inArray(items.taskId, taskIds)).groupBy(items.taskId);
		const countMap = new Map(counts.map((c) => [c.taskId, {
			total: Number(c.total),
			done: Number(c.done)
		}]));
		return taskList.map((t) => ({
			...t,
			itemCount: countMap.get(t.id)?.total ?? 0,
			itemDoneCount: countMap.get(t.id)?.done ?? 0
		}));
	}
	return taskList.map((t) => ({
		...t,
		itemCount: 0,
		itemDoneCount: 0
	}));
});
var getTask_createServerFn_handler = createServerRpc({
	id: "fb3ff5a475bb822183c36e8e0e310d34073880d75692486d7bcfacd90e9a2a49",
	name: "getTask",
	filename: "src/server/functions/tasks.ts"
}, (opts) => getTask.__executeServer(opts));
var getTask = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getTask_createServerFn_handler, async ({ data }) => {
	const [result] = await db.select().from(tasks).where(eq(tasks.id, data.id));
	if (!result) throw new Error("Task not found");
	return result;
});
var createTask_createServerFn_handler = createServerRpc({
	id: "19a4051b7944a28da1fc0360c2768a6fc7fa491a79568625d856f950ed4438a3",
	name: "createTask",
	filename: "src/server/functions/tasks.ts"
}, (opts) => createTask.__executeServer(opts));
var createTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createTask_createServerFn_handler, async ({ data }) => {
	if (!data.title?.trim()) throw new Error("Título é obrigatório");
	const [result] = await db.insert(tasks).values({
		projectId: data.projectId,
		title: data.title.trim(),
		description: data.description,
		priority: data.priority || void 0,
		status: data.status || void 0,
		dueDate: data.dueDate ? new Date(data.dueDate) : null,
		recurrence: data.recurrence || "none",
		recurrenceDays: data.recurrenceDays || null
	}).returning();
	return result;
});
var updateTask_createServerFn_handler = createServerRpc({
	id: "66388cbad3f1d3318d2ffba456dfbe11b475663679524de4728cb9224ba28c13",
	name: "updateTask",
	filename: "src/server/functions/tasks.ts"
}, (opts) => updateTask.__executeServer(opts));
var updateTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateTask_createServerFn_handler, async ({ data }) => {
	const { id, ...fields } = data;
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if (fields.title !== void 0) updates.title = fields.title.trim();
	if (fields.description !== void 0) updates.description = fields.description;
	if (fields.priority !== void 0) updates.priority = fields.priority;
	if (fields.status !== void 0) updates.status = fields.status;
	if (fields.dueDate !== void 0) updates.dueDate = fields.dueDate ? new Date(fields.dueDate) : null;
	if (fields.position !== void 0) updates.position = fields.position;
	if (fields.recurrence !== void 0) updates.recurrence = fields.recurrence;
	if (fields.recurrenceDays !== void 0) updates.recurrenceDays = fields.recurrenceDays;
	const [result] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
	if (!result) throw new Error("Task not found");
	if (updates.status === "done" && result.recurrence && result.recurrence !== "none") {
		const nextDueDate = calculateNextDueDate(result.dueDate, result.recurrence, result.recurrenceDays);
		await db.insert(tasks).values({
			projectId: result.projectId,
			title: result.title,
			description: result.description,
			priority: result.priority,
			status: "todo",
			dueDate: nextDueDate,
			position: result.position,
			recurrence: result.recurrence,
			recurrenceDays: result.recurrenceDays
		});
	}
	return result;
});
var deleteTask_createServerFn_handler = createServerRpc({
	id: "c91482dd4980c6a4470252ea4368438b5d0b6cf6dce434d5c239a89a6ff804df",
	name: "deleteTask",
	filename: "src/server/functions/tasks.ts"
}, (opts) => deleteTask.__executeServer(opts));
var deleteTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteTask_createServerFn_handler, async ({ data }) => {
	await db.delete(tasks).where(eq(tasks.id, data.id));
	return { success: true };
});
var reorderTasks_createServerFn_handler = createServerRpc({
	id: "781f738a15916d6ffec1472b1f1765152b3530831cedd8d799984975121521ce",
	name: "reorderTasks",
	filename: "src/server/functions/tasks.ts"
}, (opts) => reorderTasks.__executeServer(opts));
var reorderTasks = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(reorderTasks_createServerFn_handler, async ({ data }) => {
	await Promise.all(data.items.map((item) => {
		const updates = { position: item.position };
		if (item.status) updates.status = item.status;
		return db.update(tasks).set(updates).where(eq(tasks.id, item.id));
	}));
	return { success: true };
});
//#endregion
export { createTask_createServerFn_handler, deleteTask_createServerFn_handler, getTask_createServerFn_handler, listTasksByProject_createServerFn_handler, reorderTasks_createServerFn_handler, updateTask_createServerFn_handler };
