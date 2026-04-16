import { c as createServerFn } from "./esm-CjOGw2QJ.mjs";
import { a as and, i as desc, l as lte, o as eq, r as asc, s as gte, u as ne } from "../_libs/drizzle-orm.mjs";
import { a as tasks, i as projects, n as db, t as createServerRpc } from "./db-sjXmvybg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/views-DZwte_pq.js
var getTodayTasks_createServerFn_handler = createServerRpc({
	id: "dc2c4f06f53b62c76988946912f66b4012cd3537723a522646172299a743d898",
	name: "getTodayTasks",
	filename: "src/server/functions/views.ts"
}, (opts) => getTodayTasks.__executeServer(opts));
var getTodayTasks = createServerFn({ method: "GET" }).handler(getTodayTasks_createServerFn_handler, async () => {
	const endOfDay = /* @__PURE__ */ new Date(/* @__PURE__ */ new Date());
	endOfDay.setHours(23, 59, 59, 999);
	return db.select({
		task: tasks,
		projectName: projects.name,
		projectColor: projects.color
	}).from(tasks).leftJoin(projects, eq(tasks.projectId, projects.id)).where(and(ne(tasks.status, "done"), lte(tasks.dueDate, endOfDay))).orderBy(asc(tasks.dueDate), desc(tasks.priority));
});
var getUpcomingTasks_createServerFn_handler = createServerRpc({
	id: "717771167de3bfbcd5d9de4769feba6e32019978669fd7454656333e5c2817f3",
	name: "getUpcomingTasks",
	filename: "src/server/functions/views.ts"
}, (opts) => getUpcomingTasks.__executeServer(opts));
var getUpcomingTasks = createServerFn({ method: "GET" }).handler(getUpcomingTasks_createServerFn_handler, async () => {
	const now = /* @__PURE__ */ new Date();
	const startOfTomorrow = new Date(now);
	startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
	startOfTomorrow.setHours(0, 0, 0, 0);
	const endOfWeek = new Date(now);
	endOfWeek.setDate(endOfWeek.getDate() + 7);
	endOfWeek.setHours(23, 59, 59, 999);
	return db.select({
		task: tasks,
		projectName: projects.name,
		projectColor: projects.color
	}).from(tasks).leftJoin(projects, eq(tasks.projectId, projects.id)).where(and(ne(tasks.status, "done"), gte(tasks.dueDate, startOfTomorrow), lte(tasks.dueDate, endOfWeek))).orderBy(asc(tasks.dueDate));
});
//#endregion
export { getTodayTasks_createServerFn_handler, getUpcomingTasks_createServerFn_handler };
