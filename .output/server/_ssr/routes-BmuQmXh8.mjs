import { r as __toESM } from "../_runtime.mjs";
import { d as useNavigate, u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./utils-DYVNqSxv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { O as c } from "../_libs/phosphor-icons__react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-x439j2z8.mjs";
import { a as useDebounce, c as useProjects, i as useCreateProject, n as Input, r as SearchBar, t as Fab } from "./input-DpoM4_DS.mjs";
import { n as IllustrationProjects, r as IllustrationSearch, t as EmptyState, u as useTasks } from "./illustrations-CBKqNG-8.mjs";
import { t as Button } from "./button-DU_X_Ukl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useKeyboardShortcuts } from "./use-keyboard-shortcuts-D-5mmfaR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BmuQmXh8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectCard({ project, pendingCount, doneCount }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => navigate({
			to: "/projects/$projectId",
			params: { projectId: project.id }
		}),
		className: "text-left w-full bg-bg-elevated border border-border rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[3px] w-full",
			style: { backgroundColor: project.color ?? "#6366F1" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl font-normal text-text-primary truncate",
					children: project.name
				}),
				project.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-text-secondary line-clamp-2",
					children: project.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-text-muted",
						children: [pendingCount, " pendentes"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-status-done",
						children: [doneCount, " concluídas"]
					})]
				})
			]
		})]
	});
}
var PRESET_COLORS = [
	"#6366F1",
	"#0EA5E9",
	"#14B8A6",
	"#F59E0B",
	"#EC4899",
	"#8B5CF6",
	"#EF4444",
	"#84CC16"
];
function CreateProjectDialog({ open, onOpenChange }) {
	const [name, setName] = import_react.useState("");
	const [description, setDescription] = import_react.useState("");
	const [color, setColor] = import_react.useState(PRESET_COLORS[0]);
	const createProject = useCreateProject();
	function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		createProject.mutate({
			name: name.trim(),
			description,
			color
		}, {
			onSuccess: () => {
				setName("");
				setDescription("");
				setColor(PRESET_COLORS[0]);
				onOpenChange(false);
				toast.success("Projeto criado");
			},
			onError: () => {
				toast.error("Erro ao criar projeto. Tente novamente.");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo Projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Crie um novo projeto para organizar suas tarefas." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "project-name",
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Nome"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "project-name",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Ex: Trabalho, Estudos...",
					className: "mt-1",
					autoFocus: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "project-description",
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Descrição"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "project-description",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "Opcional",
					rows: 2,
					className: "mt-1 flex w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Cor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: PRESET_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setColor(c),
						"aria-label": `Cor ${c}`,
						className: cn("w-10 h-10 rounded-full transition-all cursor-pointer", color === c ? "ring-2 ring-offset-2 ring-accent scale-110" : "hover:scale-110"),
						style: { backgroundColor: c }
					}, c))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !name.trim(),
					children: "Criar projeto"
				})] })
			]
		})] })
	});
}
function ProjectCardWithCounts({ project }) {
	const { data: tasks = [] } = useTasks(project.id);
	const pendingCount = tasks.filter((t) => t.status !== "done").length;
	const doneCount = tasks.filter((t) => t.status === "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
		project,
		pendingCount,
		doneCount
	});
}
function DashboardPage() {
	const { data: projects, isLoading } = useProjects();
	const [search, setSearch] = import_react.useState("");
	const debouncedSearch = useDebounce(search, 300);
	const [createOpen, setCreateOpen] = import_react.useState(false);
	useKeyboardShortcuts({
		onNewProject: () => setCreateOpen(true),
		onFocusSearch: () => document.getElementById("search-input")?.focus()
	});
	const filtered = import_react.useMemo(() => {
		if (!projects) return [];
		if (!debouncedSearch.trim()) return projects;
		const q = debouncedSearch.toLowerCase();
		return projects.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q));
	}, [projects, debouncedSearch]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-7 md:px-16 md:py-12 animate-fade-in-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl md:text-5xl font-normal text-text-primary tracking-tight",
				children: "Meus Projetos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-text-secondary",
				children: "Organize sua vida em um só lugar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/today",
					className: "inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { size: 18 }), "Ver tarefas de hoje"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
					value: search,
					onChange: setSearch,
					placeholder: "Buscar projetos..."
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
				style: { gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" },
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-36 bg-bg-secondary rounded-lg animate-pulse" }, i))
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: search ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IllustrationSearch, {}),
					title: "Nenhum resultado",
					description: `Nenhum projeto encontrado para "${search}".`
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IllustrationProjects, {}),
					title: "Nenhum projeto ainda",
					description: "Crie seu primeiro projeto para começar a organizar suas tarefas.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setCreateOpen(true),
						children: "Criar primeiro projeto"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 animate-stagger",
				style: { gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" },
				children: filtered.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCardWithCounts, { project }, project.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fab, { onClick: () => setCreateOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateProjectDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen
			})
		]
	});
}
//#endregion
export { DashboardPage as component };
