//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B__KQ4-9.js
var manifest = {
	"78244f76f4a8778f3b41e9ef2b038ea22cf75a86fd7bc26e777d772372df1ee4": {
		functionName: "listTasksByProject_createServerFn_handler",
		importer: () => import("./_ssr/tasks-BF2hfVhy.mjs")
	},
	"fb3ff5a475bb822183c36e8e0e310d34073880d75692486d7bcfacd90e9a2a49": {
		functionName: "getTask_createServerFn_handler",
		importer: () => import("./_ssr/tasks-BF2hfVhy.mjs")
	},
	"19a4051b7944a28da1fc0360c2768a6fc7fa491a79568625d856f950ed4438a3": {
		functionName: "createTask_createServerFn_handler",
		importer: () => import("./_ssr/tasks-BF2hfVhy.mjs")
	},
	"66388cbad3f1d3318d2ffba456dfbe11b475663679524de4728cb9224ba28c13": {
		functionName: "updateTask_createServerFn_handler",
		importer: () => import("./_ssr/tasks-BF2hfVhy.mjs")
	},
	"c91482dd4980c6a4470252ea4368438b5d0b6cf6dce434d5c239a89a6ff804df": {
		functionName: "deleteTask_createServerFn_handler",
		importer: () => import("./_ssr/tasks-BF2hfVhy.mjs")
	},
	"781f738a15916d6ffec1472b1f1765152b3530831cedd8d799984975121521ce": {
		functionName: "reorderTasks_createServerFn_handler",
		importer: () => import("./_ssr/tasks-BF2hfVhy.mjs")
	},
	"1b04b0da3f81f69cee69a8e07052ef264ff8778d06c80f61e2f9288412681da2": {
		functionName: "exportAllData_createServerFn_handler",
		importer: () => import("./_ssr/data-BZFLFMwC.mjs")
	},
	"3597380c0393400e5831aae30e704324f8a5571d755134083366fbc1a0c8483a": {
		functionName: "importAllData_createServerFn_handler",
		importer: () => import("./_ssr/data-BZFLFMwC.mjs")
	},
	"fe583b64ca8997c643da4eedbaeb3730f4b94598cda06a17f39cfc49fd1fc5e4": {
		functionName: "listItemsByTask_createServerFn_handler",
		importer: () => import("./_ssr/items-DAqww_z6.mjs")
	},
	"d3bc8515713a4cc0d6561e83dbc65caa07788ac063402e2e7d6d0d842d788d99": {
		functionName: "createItem_createServerFn_handler",
		importer: () => import("./_ssr/items-DAqww_z6.mjs")
	},
	"1fa016ac4ccf813b7608cc09d913e3ed8c7090d013b9c140b7eea5becde42dda": {
		functionName: "updateItem_createServerFn_handler",
		importer: () => import("./_ssr/items-DAqww_z6.mjs")
	},
	"ce8fef10b706b5bfa70c78f60486ee886bc1ffce5fecfe7f6bddceae7052e9ec": {
		functionName: "deleteItem_createServerFn_handler",
		importer: () => import("./_ssr/items-DAqww_z6.mjs")
	},
	"cdf5ae907f6c2ec2cd4dcfd95913d820a49911baffe617898c011fba333912e9": {
		functionName: "reorderItems_createServerFn_handler",
		importer: () => import("./_ssr/items-DAqww_z6.mjs")
	},
	"4dde8bd06266ba40c24140aa368a8c6777e8810a855099919785d960cec48ec4": {
		functionName: "listProjects_createServerFn_handler",
		importer: () => import("./_ssr/projects-DL8UgjNU.mjs")
	},
	"de9fe7b16d1316c6d295eb1fb6302791ccef3a2ebeca6ddde8e3abff87a51c1f": {
		functionName: "getProject_createServerFn_handler",
		importer: () => import("./_ssr/projects-DL8UgjNU.mjs")
	},
	"5d475d1d5cf689d9378c7339d45920efa839f4d6df9f052d36b2819e1a050821": {
		functionName: "createProject_createServerFn_handler",
		importer: () => import("./_ssr/projects-DL8UgjNU.mjs")
	},
	"86280f1db890cfa449e66a96bfa0ce521574c9e3c8377db539bbd2452c3aef33": {
		functionName: "updateProject_createServerFn_handler",
		importer: () => import("./_ssr/projects-DL8UgjNU.mjs")
	},
	"e4d07e86a0c4d277e3964614a0b00eca2c161e2030b1600e58c8f68300db5241": {
		functionName: "deleteProject_createServerFn_handler",
		importer: () => import("./_ssr/projects-DL8UgjNU.mjs")
	},
	"d3166f8c97960ba9bff7ef516e82350e8c4790b2e09626e769dab5d5402a5949": {
		functionName: "reorderProjects_createServerFn_handler",
		importer: () => import("./_ssr/projects-DL8UgjNU.mjs")
	},
	"dc2c4f06f53b62c76988946912f66b4012cd3537723a522646172299a743d898": {
		functionName: "getTodayTasks_createServerFn_handler",
		importer: () => import("./_ssr/views-DZwte_pq.mjs")
	},
	"717771167de3bfbcd5d9de4769feba6e32019978669fd7454656333e5c2817f3": {
		functionName: "getUpcomingTasks_createServerFn_handler",
		importer: () => import("./_ssr/views-DZwte_pq.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
