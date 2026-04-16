import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./esm-CjOGw2QJ.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-B__KQ4-9.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DYVNqSxv.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listProjects = createServerFn({ method: "GET" }).handler(createSsrRpc("4dde8bd06266ba40c24140aa368a8c6777e8810a855099919785d960cec48ec4"));
var getProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("de9fe7b16d1316c6d295eb1fb6302791ccef3a2ebeca6ddde8e3abff87a51c1f"));
var createProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("5d475d1d5cf689d9378c7339d45920efa839f4d6df9f052d36b2819e1a050821"));
var updateProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("86280f1db890cfa449e66a96bfa0ce521574c9e3c8377db539bbd2452c3aef33"));
var deleteProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("e4d07e86a0c4d277e3964614a0b00eca2c161e2030b1600e58c8f68300db5241"));
var reorderProjects = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("d3166f8c97960ba9bff7ef516e82350e8c4790b2e09626e769dab5d5402a5949"));
var listTasksByProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("78244f76f4a8778f3b41e9ef2b038ea22cf75a86fd7bc26e777d772372df1ee4"));
var getTask = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("fb3ff5a475bb822183c36e8e0e310d34073880d75692486d7bcfacd90e9a2a49"));
var createTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("19a4051b7944a28da1fc0360c2768a6fc7fa491a79568625d856f950ed4438a3"));
var updateTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("66388cbad3f1d3318d2ffba456dfbe11b475663679524de4728cb9224ba28c13"));
var deleteTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("c91482dd4980c6a4470252ea4368438b5d0b6cf6dce434d5c239a89a6ff804df"));
var reorderTasks = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("781f738a15916d6ffec1472b1f1765152b3530831cedd8d799984975121521ce"));
var listItemsByTask = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("fe583b64ca8997c643da4eedbaeb3730f4b94598cda06a17f39cfc49fd1fc5e4"));
var createItem = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("d3bc8515713a4cc0d6561e83dbc65caa07788ac063402e2e7d6d0d842d788d99"));
var updateItem = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("1fa016ac4ccf813b7608cc09d913e3ed8c7090d013b9c140b7eea5becde42dda"));
var deleteItem = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("ce8fef10b706b5bfa70c78f60486ee886bc1ffce5fecfe7f6bddceae7052e9ec"));
var reorderItems = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("cdf5ae907f6c2ec2cd4dcfd95913d820a49911baffe617898c011fba333912e9"));
var getTodayTasks = createServerFn({ method: "GET" }).handler(createSsrRpc("dc2c4f06f53b62c76988946912f66b4012cd3537723a522646172299a743d898"));
var getUpcomingTasks = createServerFn({ method: "GET" }).handler(createSsrRpc("717771167de3bfbcd5d9de4769feba6e32019978669fd7454656333e5c2817f3"));
var exportAllData = createServerFn({ method: "GET" }).handler(createSsrRpc("1b04b0da3f81f69cee69a8e07052ef264ff8778d06c80f61e2f9288412681da2"));
var importAllData = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("3597380c0393400e5831aae30e704324f8a5571d755134083366fbc1a0c8483a"));
/** Convert null to undefined for server function compatibility */
function nu(v) {
	return v ?? void 0;
}
var api = {
	projects: {
		list: () => listProjects(),
		get: (id) => getProject({ data: { id } }),
		create: (data) => createProject({ data: {
			name: data.name,
			description: nu(data.description),
			color: nu(data.color)
		} }),
		update: (id, data) => updateProject({ data: {
			id,
			name: data.name ?? void 0,
			description: nu(data.description),
			color: nu(data.color),
			position: nu(data.position)
		} }),
		delete: (id) => deleteProject({ data: { id } }),
		reorder: (items) => reorderProjects({ data: { items } })
	},
	tasks: {
		listByProject: (projectId) => listTasksByProject({ data: { projectId } }),
		get: (id) => getTask({ data: { id } }),
		create: (data) => createTask({ data: {
			projectId: data.projectId,
			title: data.title,
			description: nu(data.description),
			priority: nu(data.priority),
			status: nu(data.status),
			dueDate: data.dueDate ? data.dueDate.toISOString() : void 0,
			recurrence: nu(data.recurrence),
			recurrenceDays: nu(data.recurrenceDays)
		} }),
		update: (id, data) => updateTask({ data: {
			id,
			title: data.title ?? void 0,
			description: nu(data.description),
			priority: nu(data.priority),
			status: nu(data.status),
			dueDate: data.dueDate ? data.dueDate.toISOString() : data.dueDate === null ? null : void 0,
			position: nu(data.position),
			recurrence: nu(data.recurrence),
			recurrenceDays: nu(data.recurrenceDays)
		} }),
		delete: (id) => deleteTask({ data: { id } }),
		reorder: (items) => reorderTasks({ data: { items } })
	},
	items: {
		listByTask: (taskId) => listItemsByTask({ data: { taskId } }),
		create: (data) => createItem({ data: {
			taskId: data.taskId,
			title: data.title,
			description: nu(data.description)
		} }),
		update: (id, data) => updateItem({ data: {
			id,
			title: data.title ?? void 0,
			description: nu(data.description),
			isCompleted: data.isCompleted ?? void 0,
			position: nu(data.position)
		} }),
		delete: (id) => deleteItem({ data: { id } }),
		reorder: (items) => reorderItems({ data: { items } })
	},
	views: {
		today: () => getTodayTasks(),
		upcoming: () => getUpcomingTasks()
	},
	data: {
		exportAll: () => exportAllData(),
		importAll: (data) => importAllData({ data: {
			projects: data.projects,
			tasks: data.tasks,
			items: data.items
		} })
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { cn as n, api as t };
