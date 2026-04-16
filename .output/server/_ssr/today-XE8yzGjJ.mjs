import { u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./utils-DYVNqSxv.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as n, O as c$1, n as c } from "../_libs/phosphor-icons__react.mjs";
import { a as IllustrationToday, d as useTodayTasks, f as useUpcomingTasks, t as EmptyState } from "./illustrations-CBKqNG-8.mjs";
import { n as isOverdue, t as formatDatePt } from "./date-CL6R-gw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/today-XE8yzGjJ.js
var import_jsx_runtime = require_jsx_runtime();
var WEEKDAYS_PT = [
	"domingo",
	"segunda-feira",
	"terça-feira",
	"quarta-feira",
	"quinta-feira",
	"sexta-feira",
	"sábado"
];
var MONTHS_FULL_PT = [
	"janeiro",
	"fevereiro",
	"março",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro"
];
function formatTodayDate() {
	const now = /* @__PURE__ */ new Date();
	return `${WEEKDAYS_PT[now.getDay()]}, ${now.getDate()} de ${MONTHS_FULL_PT[now.getMonth()]}`;
}
var priorityColors = {
	high: "bg-priority-high",
	medium: "bg-priority-medium",
	low: "bg-priority-low"
};
function TodayTaskRow({ task, projectName, projectColor }) {
	const overdue = isOverdue(task.dueDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/projects/$projectId",
		params: { projectId: task.projectId },
		className: "flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-secondary/50 transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-2.5 h-2.5 rounded-full shrink-0",
				style: { backgroundColor: projectColor ?? "#6366F1" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-text-muted shrink-0 font-mono w-24 truncate",
				children: projectName ?? "Sem projeto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 text-sm text-text-primary truncate",
				children: task.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full shrink-0", priorityColors[task.priority]) }),
			task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-xs font-mono shrink-0", overdue ? "text-priority-high" : "text-text-muted"),
				children: formatDatePt(task.dueDate)
			})
		]
	});
}
function TodayPage() {
	const { data: todayData, isLoading: todayLoading } = useTodayTasks();
	const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingTasks();
	const isLoading = todayLoading || upcomingLoading;
	const startOfToday = /* @__PURE__ */ new Date(/* @__PURE__ */ new Date());
	startOfToday.setHours(0, 0, 0, 0);
	const overdueTasks = (todayData ?? []).filter((item) => item.task.dueDate && new Date(item.task.dueDate) < startOfToday);
	const todayTasks = (todayData ?? []).filter((item) => !item.task.dueDate || new Date(item.task.dueDate) >= startOfToday);
	const upcomingTasks = upcomingData ?? [];
	const formattedDate = formatTodayDate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-7 md:px-16 md:py-12 animate-fade-in-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl md:text-4xl font-normal text-text-primary tracking-tight",
				children: "Hoje"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-text-secondary font-mono",
				children: formattedDate
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-bg-secondary rounded-lg animate-pulse" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				overdueTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-medium text-priority-high uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { size: 16 }),
							" Atrasadas (",
							overdueTasks.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-0",
						children: overdueTasks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayTaskRow, { ...item }, item.task.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-medium text-text-muted uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c$1, { size: 16 }),
							" Hoje (",
							todayTasks.length,
							")"
						]
					}), todayTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IllustrationToday, {}),
						title: "Nada para hoje",
						description: "Nenhuma tarefa pendente. Aproveite o dia!"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-0",
						children: todayTasks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayTaskRow, { ...item }, item.task.id))
					})]
				}),
				upcomingTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-medium text-text-muted uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { size: 16 }),
							" Próximos 7 dias (",
							upcomingTasks.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-0",
						children: upcomingTasks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayTaskRow, { ...item }, item.task.id))
					})]
				})
			] })
		]
	});
}
//#endregion
export { TodayPage as component };
