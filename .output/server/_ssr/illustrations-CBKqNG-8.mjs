import { t as api } from "./utils-DYVNqSxv.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/illustrations-CBKqNG-8.js
var import_jsx_runtime = require_jsx_runtime();
var taskKeys = {
	byProject: (projectId) => [
		"tasks",
		"project",
		projectId
	],
	detail: (id) => ["tasks", id]
};
var viewKeys = {
	today: ["views", "today"],
	upcoming: ["views", "upcoming"]
};
function useTodayTasks() {
	return useQuery({
		queryKey: viewKeys.today,
		queryFn: api.views.today
	});
}
function useUpcomingTasks() {
	return useQuery({
		queryKey: viewKeys.upcoming,
		queryFn: api.views.upcoming
	});
}
function useTasks(projectId) {
	return useQuery({
		queryKey: taskKeys.byProject(projectId),
		queryFn: () => api.tasks.listByProject(projectId)
	});
}
function useTask(id) {
	return useQuery({
		queryKey: taskKeys.detail(id),
		queryFn: () => api.tasks.get(id),
		enabled: !!id
	});
}
function useCreateTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.tasks.create(data),
		onSuccess: (result) => {
			qc.invalidateQueries({ queryKey: taskKeys.byProject(result.projectId) });
			qc.invalidateQueries({ queryKey: viewKeys.today });
			qc.invalidateQueries({ queryKey: viewKeys.upcoming });
		}
	});
}
function useUpdateTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.tasks.update(id, data),
		onSuccess: (result, { id }) => {
			qc.invalidateQueries({ queryKey: taskKeys.byProject(result.projectId) });
			qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
			qc.invalidateQueries({ queryKey: viewKeys.today });
			qc.invalidateQueries({ queryKey: viewKeys.upcoming });
		}
	});
}
function useDeleteTask() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }) => api.tasks.delete(id),
		onSuccess: (_data, { projectId }) => {
			qc.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
			qc.invalidateQueries({ queryKey: viewKeys.today });
			qc.invalidateQueries({ queryKey: viewKeys.upcoming });
		}
	});
}
function EmptyState({ icon, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-16 px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-20 h-20 flex items-center justify-center rounded-full bg-bg-secondary text-text-muted mb-6",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-medium text-text-primary text-center",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-muted text-center max-w-xs",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: action
			})
		]
	});
}
function IllustrationProjects() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "48",
		height: "48",
		viewBox: "0 0 48 48",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "6",
				y: "14",
				width: "36",
				height: "26",
				rx: "3",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6 14V12C6 10.3431 7.34315 9 9 9H18L22 14",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "36",
				cy: "12",
				r: "4",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeDasharray: "2 2"
			})
		]
	});
}
function IllustrationTasks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "48",
		height: "48",
		viewBox: "0 0 48 48",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10",
				y: "8",
				width: "28",
				height: "32",
				rx: "3",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 18L20 22L28 14",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "16",
				y1: "28",
				x2: "32",
				y2: "28",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				opacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "16",
				y1: "34",
				x2: "28",
				y2: "34",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				opacity: "0.3"
			})
		]
	});
}
function IllustrationToday() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "48",
		height: "48",
		viewBox: "0 0 48 48",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "10",
				width: "32",
				height: "30",
				rx: "3",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "8",
				y1: "18",
				x2: "40",
				y2: "18",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "16",
				y1: "7",
				x2: "16",
				y2: "13",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "32",
				y1: "7",
				x2: "32",
				y2: "13",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "28",
				r: "5",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 21V23M24 33V35M17 28H19M29 28H31",
				stroke: "currentColor",
				strokeWidth: "1",
				strokeLinecap: "round",
				opacity: "0.5"
			})
		]
	});
}
function IllustrationSearch() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "48",
		height: "48",
		viewBox: "0 0 48 48",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "22",
				r: "12",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "31",
				y1: "31",
				x2: "40",
				y2: "40",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M19 18C19 16.3431 20.3431 15 22 15C23.6569 15 25 16.3431 25 18C25 19.6569 23.5 20 22 21",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "25",
				r: "0.5",
				fill: "currentColor"
			})
		]
	});
}
//#endregion
export { IllustrationToday as a, useDeleteTask as c, useTodayTasks as d, useUpcomingTasks as f, IllustrationTasks as i, useTask as l, IllustrationProjects as n, taskKeys as o, useUpdateTask as p, IllustrationSearch as r, useCreateTask as s, EmptyState as t, useTasks as u };
