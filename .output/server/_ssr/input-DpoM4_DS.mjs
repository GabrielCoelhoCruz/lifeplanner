import { r as __toESM } from "../_runtime.mjs";
import { n as cn, t as api } from "./utils-DYVNqSxv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { h as f, u as n } from "../_libs/phosphor-icons__react.mjs";
import { l as usePomodoro } from "./dialog-x439j2z8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-DpoM4_DS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var projectKeys = {
	all: ["projects"],
	detail: (id) => ["projects", id]
};
function useProjects() {
	return useQuery({
		queryKey: projectKeys.all,
		queryFn: api.projects.list
	});
}
function useProject(id) {
	return useQuery({
		queryKey: projectKeys.detail(id),
		queryFn: () => api.projects.get(id)
	});
}
function useCreateProject() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.projects.create(data),
		onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all })
	});
}
function useUpdateProject() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.projects.update(id, data),
		onSuccess: (_, { id }) => {
			qc.invalidateQueries({ queryKey: projectKeys.all });
			qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
		}
	});
}
function useDeleteProject() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id) => api.projects.delete(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all })
	});
}
function SearchBar({ value, onChange, placeholder = "Buscar...", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2 px-4 py-2.5 bg-bg-secondary rounded-full w-full md:w-80", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f, {
			size: 16,
			className: "text-text-muted shrink-0"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: "search-input",
			type: "text",
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
		})]
	});
}
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debouncedValue;
}
function Fab({ onClick, className }) {
	const { isRunning, isPaused } = usePomodoro();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-label": "Criar novo",
		className: cn("fixed right-5 md:right-8 z-40 transition-all duration-200", isRunning || isPaused ? "bottom-20" : "bottom-5 md:bottom-8", "w-14 h-14 rounded-full bg-accent text-white", "flex items-center justify-center", "shadow-lg hover:scale-110 hover:bg-accent-hover", "transition-all duration-200 cursor-pointer", "animate-scale-in", className),
		style: { animationDelay: "300ms" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
			size: 24,
			weight: "bold"
		})
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
export { useDebounce as a, useProjects as c, useCreateProject as i, useUpdateProject as l, Input as n, useDeleteProject as o, SearchBar as r, useProject as s, Fab as t };
