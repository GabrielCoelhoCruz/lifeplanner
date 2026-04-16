import { c as createServerFn } from "./esm-CjOGw2QJ.mjs";
import { o as eq, r as asc } from "../_libs/drizzle-orm.mjs";
import { i as projects, n as db, t as createServerRpc } from "./db-sjXmvybg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-DL8UgjNU.js
var listProjects_createServerFn_handler = createServerRpc({
	id: "4dde8bd06266ba40c24140aa368a8c6777e8810a855099919785d960cec48ec4",
	name: "listProjects",
	filename: "src/server/functions/projects.ts"
}, (opts) => listProjects.__executeServer(opts));
var listProjects = createServerFn({ method: "GET" }).handler(listProjects_createServerFn_handler, async () => {
	return db.select().from(projects).orderBy(asc(projects.position));
});
var getProject_createServerFn_handler = createServerRpc({
	id: "de9fe7b16d1316c6d295eb1fb6302791ccef3a2ebeca6ddde8e3abff87a51c1f",
	name: "getProject",
	filename: "src/server/functions/projects.ts"
}, (opts) => getProject.__executeServer(opts));
var getProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getProject_createServerFn_handler, async ({ data }) => {
	const [result] = await db.select().from(projects).where(eq(projects.id, data.id));
	if (!result) throw new Error("Project not found");
	return result;
});
var createProject_createServerFn_handler = createServerRpc({
	id: "5d475d1d5cf689d9378c7339d45920efa839f4d6df9f052d36b2819e1a050821",
	name: "createProject",
	filename: "src/server/functions/projects.ts"
}, (opts) => createProject.__executeServer(opts));
var createProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createProject_createServerFn_handler, async ({ data }) => {
	if (!data.name?.trim()) throw new Error("Nome é obrigatório");
	const [result] = await db.insert(projects).values({
		name: data.name.trim(),
		description: data.description || "",
		color: data.color || "#6366F1"
	}).returning();
	return result;
});
var updateProject_createServerFn_handler = createServerRpc({
	id: "86280f1db890cfa449e66a96bfa0ce521574c9e3c8377db539bbd2452c3aef33",
	name: "updateProject",
	filename: "src/server/functions/projects.ts"
}, (opts) => updateProject.__executeServer(opts));
var updateProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateProject_createServerFn_handler, async ({ data }) => {
	const { id, ...fields } = data;
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if (fields.name !== void 0) updates.name = fields.name.trim();
	if (fields.description !== void 0) updates.description = fields.description;
	if (fields.color !== void 0) updates.color = fields.color;
	if (fields.position !== void 0) updates.position = fields.position;
	const [result] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
	if (!result) throw new Error("Project not found");
	return result;
});
var deleteProject_createServerFn_handler = createServerRpc({
	id: "e4d07e86a0c4d277e3964614a0b00eca2c161e2030b1600e58c8f68300db5241",
	name: "deleteProject",
	filename: "src/server/functions/projects.ts"
}, (opts) => deleteProject.__executeServer(opts));
var deleteProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteProject_createServerFn_handler, async ({ data }) => {
	await db.delete(projects).where(eq(projects.id, data.id));
	return { success: true };
});
var reorderProjects_createServerFn_handler = createServerRpc({
	id: "d3166f8c97960ba9bff7ef516e82350e8c4790b2e09626e769dab5d5402a5949",
	name: "reorderProjects",
	filename: "src/server/functions/projects.ts"
}, (opts) => reorderProjects.__executeServer(opts));
var reorderProjects = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(reorderProjects_createServerFn_handler, async ({ data }) => {
	await Promise.all(data.items.map((item) => db.update(projects).set({ position: item.position }).where(eq(projects.id, item.id))));
	return { success: true };
});
//#endregion
export { createProject_createServerFn_handler, deleteProject_createServerFn_handler, getProject_createServerFn_handler, listProjects_createServerFn_handler, reorderProjects_createServerFn_handler, updateProject_createServerFn_handler };
