import { c as createServerFn } from "./esm-CjOGw2QJ.mjs";
import { o as eq, r as asc } from "../_libs/drizzle-orm.mjs";
import { n as db, r as items, t as createServerRpc } from "./db-sjXmvybg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/items-DAqww_z6.js
var listItemsByTask_createServerFn_handler = createServerRpc({
	id: "fe583b64ca8997c643da4eedbaeb3730f4b94598cda06a17f39cfc49fd1fc5e4",
	name: "listItemsByTask",
	filename: "src/server/functions/items.ts"
}, (opts) => listItemsByTask.__executeServer(opts));
var listItemsByTask = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(listItemsByTask_createServerFn_handler, async ({ data }) => {
	return db.select().from(items).where(eq(items.taskId, data.taskId)).orderBy(asc(items.position));
});
var createItem_createServerFn_handler = createServerRpc({
	id: "d3bc8515713a4cc0d6561e83dbc65caa07788ac063402e2e7d6d0d842d788d99",
	name: "createItem",
	filename: "src/server/functions/items.ts"
}, (opts) => createItem.__executeServer(opts));
var createItem = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createItem_createServerFn_handler, async ({ data }) => {
	if (!data.title?.trim()) throw new Error("Título é obrigatório");
	const [result] = await db.insert(items).values({
		taskId: data.taskId,
		title: data.title.trim(),
		description: data.description
	}).returning();
	return result;
});
var updateItem_createServerFn_handler = createServerRpc({
	id: "1fa016ac4ccf813b7608cc09d913e3ed8c7090d013b9c140b7eea5becde42dda",
	name: "updateItem",
	filename: "src/server/functions/items.ts"
}, (opts) => updateItem.__executeServer(opts));
var updateItem = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateItem_createServerFn_handler, async ({ data }) => {
	const { id, ...fields } = data;
	const updates = {};
	if (fields.title !== void 0) updates.title = fields.title.trim();
	if (fields.description !== void 0) updates.description = fields.description;
	if (fields.isCompleted !== void 0) updates.isCompleted = fields.isCompleted;
	if (fields.position !== void 0) updates.position = fields.position;
	const [result] = await db.update(items).set(updates).where(eq(items.id, id)).returning();
	if (!result) throw new Error("Item not found");
	return result;
});
var deleteItem_createServerFn_handler = createServerRpc({
	id: "ce8fef10b706b5bfa70c78f60486ee886bc1ffce5fecfe7f6bddceae7052e9ec",
	name: "deleteItem",
	filename: "src/server/functions/items.ts"
}, (opts) => deleteItem.__executeServer(opts));
var deleteItem = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteItem_createServerFn_handler, async ({ data }) => {
	await db.delete(items).where(eq(items.id, data.id));
	return { success: true };
});
var reorderItems_createServerFn_handler = createServerRpc({
	id: "cdf5ae907f6c2ec2cd4dcfd95913d820a49911baffe617898c011fba333912e9",
	name: "reorderItems",
	filename: "src/server/functions/items.ts"
}, (opts) => reorderItems.__executeServer(opts));
var reorderItems = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(reorderItems_createServerFn_handler, async ({ data }) => {
	await Promise.all(data.items.map((item) => db.update(items).set({ position: item.position }).where(eq(items.id, item.id))));
	return { success: true };
});
//#endregion
export { createItem_createServerFn_handler, deleteItem_createServerFn_handler, listItemsByTask_createServerFn_handler, reorderItems_createServerFn_handler, updateItem_createServerFn_handler };
