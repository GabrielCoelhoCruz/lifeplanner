import { r as __toESM } from "../_runtime.mjs";
import { d as useNavigate, u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as api } from "./utils-DYVNqSxv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { A as m$1, D as s$4, E as s, S as m, T as n$2, a as s$3, c as n$3, f as a, g as m$2, i as n$4, t as n$1, u as n, v as s$2, w as s$1, x as n$5 } from "../_libs/phosphor-icons__react.mjs";
import { a as DialogHeader, i as DialogFooter, l as usePomodoro, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-x439j2z8.mjs";
import { a as closestCenter, d as useSensors, f as CSS, i as PointerSensor, l as useDroppable, n as DragOverlay, t as DndContext, u as useSensor } from "../_libs/@dnd-kit/core+[...].mjs";
import { t as Route } from "./projects._projectId-DRXsSlnu.mjs";
import { a as useDebounce, l as useUpdateProject, n as Input, o as useDeleteProject, r as SearchBar, s as useProject, t as Fab } from "./input-DpoM4_DS.mjs";
import { c as useDeleteTask, i as IllustrationTasks, l as useTask, o as taskKeys, p as useUpdateTask, r as IllustrationSearch, s as useCreateTask, t as EmptyState, u as useTasks } from "./illustrations-CBKqNG-8.mjs";
import { t as Button } from "./button-DU_X_Ukl.mjs";
import { n as isOverdue, r as toInputDate, t as formatDatePt } from "./date-CL6R-gw5.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as verticalListSortingStrategy, n as arrayMove, r as useSortable, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._projectId-Ydy_LpbC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var priorityColors$1 = {
	high: "bg-priority-high",
	medium: "bg-priority-medium",
	low: "bg-priority-low"
};
function TaskRow({ task, onToggle, onClick, sortable = false }) {
	const isDone = task.status === "done";
	const overdue = !isDone && isOverdue(task.dueDate);
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: task.id,
		disabled: !sortable
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : void 0,
			position: "relative",
			zIndex: isDragging ? 50 : void 0
		},
		className: "flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer",
		onClick: () => onClick(task),
		children: [
			sortable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "shrink-0 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary touch-none",
				...attributes,
				...listeners,
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, { size: 16 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onToggle(task);
				},
				"aria-label": isDone ? "Reabrir tarefa" : "Marcar como concluída",
				className: "shrink-0 cursor-pointer",
				children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
					size: 20,
					weight: "fill",
					className: "text-status-done animate-check-pop"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
					size: 20,
					className: "text-text-muted"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex-1 text-sm truncate", isDone && "line-through text-text-muted"),
				children: task.title
			}),
			task.recurrence && task.recurrence !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, {
				size: 14,
				className: "text-text-muted shrink-0"
			}),
			(task.itemCount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-status-done rounded-full transition-all duration-300",
						style: { width: `${(task.itemDoneCount ?? 0) / task.itemCount * 100}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-mono text-text-muted",
					children: [
						task.itemDoneCount ?? 0,
						"/",
						task.itemCount
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full shrink-0", priorityColors$1[task.priority]) }),
			task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-xs font-mono shrink-0", overdue ? "text-priority-high" : "text-text-muted"),
				children: formatDatePt(task.dueDate)
			})
		]
	});
}
/** Lightweight clone rendered inside DragOverlay */
function TaskRowOverlay({ task }) {
	const isDone = task.status === "done";
	const overdue = !isDone && isOverdue(task.dueDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 px-4 py-3 bg-bg-elevated border border-border rounded-lg shadow-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
				size: 16,
				className: "text-text-muted shrink-0"
			}),
			isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
				size: 20,
				weight: "fill",
				className: "text-status-done shrink-0"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
				size: 20,
				className: "text-text-muted shrink-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex-1 text-sm truncate", isDone && "line-through text-text-muted"),
				children: task.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full shrink-0", priorityColors$1[task.priority]) }),
			task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-xs font-mono shrink-0", overdue ? "text-priority-high" : "text-text-muted"),
				children: formatDatePt(task.dueDate)
			})
		]
	});
}
var priorityColors = {
	high: "bg-priority-high",
	medium: "bg-priority-medium",
	low: "bg-priority-low"
};
function KanbanCard({ task, onClick }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : void 0
		},
		type: "button",
		onClick: () => onClick(task),
		className: "w-full text-left bg-bg-elevated rounded-md border border-border p-3 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing touch-none",
		...attributes,
		...listeners,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-text-primary line-clamp-2",
				children: task.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full", priorityColors[task.priority]) }),
					task.recurrence && task.recurrence !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, {
						size: 14,
						className: "text-text-muted shrink-0"
					}),
					task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-mono text-text-muted",
						children: formatDatePt(task.dueDate)
					})
				]
			}),
			(task.itemCount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 h-1 bg-bg-secondary rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-status-done rounded-full",
						style: { width: `${(task.itemDoneCount ?? 0) / task.itemCount * 100}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-mono text-text-muted",
					children: [
						task.itemDoneCount ?? 0,
						"/",
						task.itemCount
					]
				})]
			})
		]
	});
}
/** Lightweight clone rendered inside DragOverlay for kanban */
function KanbanCardOverlay({ task }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-[280px] text-left bg-bg-elevated rounded-md border border-border p-3 shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-text-primary line-clamp-2",
			children: task.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full", priorityColors[task.priority]) }), task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-mono text-text-muted",
				children: formatDatePt(task.dueDate)
			})]
		})]
	});
}
function QuickAddTask({ projectId }) {
	const [isAdding, setIsAdding] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const createTask = useCreateTask();
	(0, import_react.useEffect)(() => {
		if (isAdding && inputRef.current) inputRef.current.focus();
	}, [isAdding]);
	function handleSubmit(e) {
		e?.preventDefault();
		if (!title.trim()) return;
		createTask.mutate({
			projectId,
			title: title.trim()
		}, {
			onSuccess: () => {
				setTitle("");
				inputRef.current?.focus();
			},
			onError: () => {
				toast.error("Erro ao criar tarefa");
			}
		});
	}
	function handleKeyDown(e) {
		if (e.key === "Escape") {
			setTitle("");
			setIsAdding(false);
		}
	}
	if (!isAdding) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setIsAdding(true),
		className: "flex items-center gap-2 w-full px-4 py-3 text-sm text-text-muted hover:text-text-secondary hover:bg-bg-secondary/50 transition-colors rounded-lg cursor-pointer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { size: 18 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adicionar tarefa..." })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "flex items-center gap-3 px-4 py-2 border border-accent/30 rounded-lg bg-bg-elevated",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
				size: 18,
				className: "text-accent shrink-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "text",
				value: title,
				onChange: (e) => setTitle(e.target.value),
				onKeyDown: handleKeyDown,
				onBlur: () => {
					if (!title.trim()) setIsAdding(false);
				},
				placeholder: "Nome da tarefa... (Enter para criar, Esc para cancelar)",
				className: "flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
			}),
			title.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "text-xs font-medium text-accent hover:text-accent-hover px-2 py-1 rounded transition-colors",
				children: "Criar"
			})
		]
	});
}
var columns = [
	{
		key: "todo",
		label: "A fazer",
		color: "bg-status-todo"
	},
	{
		key: "in_progress",
		label: "Em progresso",
		color: "bg-status-progress"
	},
	{
		key: "done",
		label: "Concluído",
		color: "bg-status-done"
	}
];
function DroppableColumn({ id, col, tasks, onTaskClick, projectId }) {
	const { setNodeRef, isOver } = useDroppable({ id });
	const taskIds = tasks.map((t) => t.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		className: cn("min-w-[280px] md:min-w-0 bg-bg-secondary rounded-md p-3 flex flex-col gap-2 transition-colors snap-start", isOver && "ring-2 ring-accent/40"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2.5 h-2.5 rounded-full", col.color) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-text-primary",
						children: col.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-mono text-text-muted ml-auto",
						children: tasks.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
				items: taskIds,
				strategy: verticalListSortingStrategy,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2 min-h-[40px]",
					children: tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanCard, {
						task,
						onClick: onTaskClick
					}, task.id))
				})
			}),
			id === "todo" && projectId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAddTask, { projectId })
		]
	});
}
function KanbanBoard({ tasks, onTaskClick, projectId }) {
	const queryClient = useQueryClient();
	const [activeTask, setActiveTask] = import_react.useState(null);
	const [localTasks, setLocalTasks] = import_react.useState(tasks);
	import_react.useEffect(() => {
		setLocalTasks(tasks);
	}, [tasks]);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
	const tasksByColumn = import_react.useMemo(() => {
		const map = {
			todo: [],
			in_progress: [],
			done: []
		};
		for (const t of localTasks) {
			const col = map[t.status];
			if (col) col.push(t);
		}
		return map;
	}, [localTasks]);
	function findColumn(taskId) {
		for (const key of Object.keys(tasksByColumn)) if (tasksByColumn[key].some((t) => t.id === taskId)) return key;
	}
	function handleDragStart(event) {
		setActiveTask(localTasks.find((t) => t.id === event.active.id) ?? null);
	}
	function handleDragOver(event) {
		const { active, over } = event;
		if (!over) return;
		const activeId = active.id;
		const overId = over.id;
		const activeCol = findColumn(activeId);
		let overCol;
		if ([
			"todo",
			"in_progress",
			"done"
		].includes(overId)) overCol = overId;
		else overCol = findColumn(overId);
		if (!activeCol || !overCol || activeCol === overCol) return;
		setLocalTasks((prev) => prev.map((t) => t.id === activeId ? {
			...t,
			status: overCol
		} : t));
	}
	async function handleDragEnd(event) {
		setActiveTask(null);
		const { active, over } = event;
		if (!over) return;
		const activeId = active.id;
		const overId = over.id;
		const activeCol = findColumn(activeId);
		let overCol;
		if ([
			"todo",
			"in_progress",
			"done"
		].includes(overId)) overCol = overId;
		else overCol = findColumn(overId);
		if (!activeCol || !overCol) return;
		const colTasks = [...tasksByColumn[overCol]];
		if (activeCol === overCol) {
			const oldIndex = colTasks.findIndex((t) => t.id === activeId);
			const newIndex = colTasks.findIndex((t) => t.id === overId);
			if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
			const orderItems = arrayMove(colTasks, oldIndex, newIndex).map((t, i) => ({
				id: t.id,
				position: i
			}));
			setLocalTasks((prev) => {
				const updated = [...prev];
				for (const item of orderItems) {
					const idx = updated.findIndex((t) => t.id === item.id);
					if (idx !== -1) updated[idx] = {
						...updated[idx],
						position: item.position
					};
				}
				return updated;
			});
			try {
				await api.tasks.reorder(orderItems);
				queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
			} catch {
				toast.error("Erro ao reordenar tarefas. Tente novamente.");
				queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
			}
		} else {
			const targetTasks = colTasks;
			const activeIndex = targetTasks.findIndex((t) => t.id === activeId);
			let finalTasks;
			if (overId !== overCol && activeIndex !== -1) {
				const overIndex = targetTasks.findIndex((t) => t.id === overId);
				if (overIndex !== -1 && activeIndex !== overIndex) finalTasks = arrayMove(targetTasks, activeIndex, overIndex);
				else finalTasks = targetTasks;
			} else finalTasks = targetTasks;
			const orderItems = finalTasks.map((t, i) => ({
				id: t.id,
				position: i,
				status: overCol
			}));
			setLocalTasks((prev) => {
				const updated = [...prev];
				for (const item of orderItems) {
					const idx = updated.findIndex((t) => t.id === item.id);
					if (idx !== -1) updated[idx] = {
						...updated[idx],
						position: item.position,
						status: item.status
					};
				}
				return updated;
			});
			try {
				await api.tasks.reorder(orderItems);
				queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
			} catch {
				toast.error("Erro ao reordenar tarefas. Tente novamente.");
				queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
			}
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DndContext, {
		sensors,
		collisionDetection: closestCenter,
		onDragStart: handleDragStart,
		onDragOver: handleDragOver,
		onDragEnd: handleDragEnd,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:snap-none",
			children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DroppableColumn, {
				id: col.key,
				col,
				tasks: tasksByColumn[col.key],
				onTaskClick,
				projectId
			}, col.key))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragOverlay, {
			dropAnimation: null,
			children: activeTask ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanCardOverlay, { task: activeTask }) : null
		})]
	});
}
function ViewToggle({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center bg-bg-secondary rounded-full p-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange("list"),
			"aria-label": "Visualização em lista",
			className: cn("flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer", value === "list" ? "bg-bg-elevated shadow-sm text-text-primary" : "text-text-muted hover:text-text-secondary"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$2, { size: 18 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange("kanban"),
			"aria-label": "Visualização em kanban",
			className: cn("flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer", value === "kanban" ? "bg-bg-elevated shadow-sm text-text-primary" : "text-text-muted hover:text-text-secondary"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, { size: 18 })
		})]
	});
}
var config$1 = {
	high: {
		label: "Alta",
		dot: "bg-priority-high",
		selectedBg: "bg-priority-high/10",
		selectedBorder: "border-priority-high"
	},
	medium: {
		label: "Média",
		dot: "bg-priority-medium",
		selectedBg: "bg-priority-medium/10",
		selectedBorder: "border-priority-medium"
	},
	low: {
		label: "Baixa",
		dot: "bg-priority-low",
		selectedBg: "bg-priority-low/10",
		selectedBorder: "border-priority-low"
	}
};
function PriorityBadge({ priority, selected = false, onClick }) {
	const c = config$1[priority];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer", selected ? `${c.selectedBg} ${c.selectedBorder} text-text-primary` : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full", c.dot) }), c.label]
	});
}
function CreateTaskDialog({ projectId, open, onOpenChange }) {
	const [title, setTitle] = import_react.useState("");
	const [description, setDescription] = import_react.useState("");
	const [priority, setPriority] = import_react.useState("medium");
	const [dueDate, setDueDate] = import_react.useState("");
	const [recurrence, setRecurrence] = import_react.useState("none");
	const createTask = useCreateTask();
	const recurrenceOptions = [
		{
			value: "none",
			label: "Sem repetição"
		},
		{
			value: "daily",
			label: "Diariamente"
		},
		{
			value: "weekdays",
			label: "Dias úteis (Seg-Sex)"
		},
		{
			value: "weekly",
			label: "Semanalmente"
		},
		{
			value: "monthly",
			label: "Mensalmente"
		}
	];
	function handleSubmit(e) {
		e.preventDefault();
		if (!title.trim()) return;
		createTask.mutate({
			projectId,
			title: title.trim(),
			description,
			priority,
			dueDate: dueDate ? /* @__PURE__ */ new Date(dueDate + "T00:00:00") : void 0,
			recurrence
		}, {
			onSuccess: () => {
				setTitle("");
				setDescription("");
				setPriority("medium");
				setDueDate("");
				setRecurrence("none");
				onOpenChange(false);
				toast.success("Tarefa criada");
			},
			onError: () => {
				toast.error("Erro ao criar tarefa. Tente novamente.");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova Tarefa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Adicione uma nova tarefa ao projeto." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "task-title",
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Título"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "task-title",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Ex: Finalizar relatório...",
					className: "mt-1",
					autoFocus: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "task-description",
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Descrição"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "task-description",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "Opcional",
					rows: 2,
					className: "mt-1 flex w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Prioridade"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 flex gap-1",
					children: [
						"high",
						"medium",
						"low"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
						priority: p,
						selected: priority === p,
						onClick: () => setPriority(p)
					}, p))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "task-due-date",
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Data de entrega"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "task-due-date",
					type: "date",
					value: dueDate,
					onChange: (e) => setDueDate(e.target.value),
					className: "mt-1"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, { size: 14 }), "Repetição"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: recurrence,
					onChange: (e) => setRecurrence(e.target.value),
					className: "mt-1 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
					children: recurrenceOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: opt.value,
						children: opt.label
					}, opt.value))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !title.trim(),
					children: "Criar tarefa"
				})] })
			]
		})] })
	});
}
var SheetContext = import_react.createContext({
	open: false,
	onOpenChange: () => {}
});
function Sheet({ open = false, onOpenChange, children }) {
	const value = import_react.useMemo(() => ({
		open,
		onOpenChange: onOpenChange ?? (() => {})
	}), [open, onOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContext.Provider, {
		value,
		children
	});
}
function SheetPortal({ children }) {
	const { open } = import_react.useContext(SheetContext);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function SheetOverlay({ className, ...props }) {
	const { onOpenChange } = import_react.useContext(SheetContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-50 bg-text-primary/60 backdrop-blur-sm animate-fade-in", className),
		onClick: () => onOpenChange(false),
		...props
	});
}
var sheetVariants = cva("fixed z-50 gap-4 bg-bg-elevated shadow-lg transition-transform duration-300 ease-in-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b border-border",
		bottom: "inset-x-0 bottom-0 border-t border-border",
		left: "inset-y-0 left-0 h-full w-3/4 border-r border-border sm:max-w-sm",
		right: "inset-y-0 right-0 h-full border-l border-border"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => {
	const { onOpenChange } = import_react.useContext(SheetContext);
	import_react.useEffect(() => {
		function onKeyDown(e) {
			if (e.key === "Escape") onOpenChange(false);
		}
		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
		};
	}, [onOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn(sheetVariants({ side }), "w-full md:w-[480px]", className),
		onClick: (e) => e.stopPropagation(),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer z-10",
			onClick: () => onOpenChange(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Fechar"
			})]
		}), children]
	})] });
});
SheetContent.displayName = "SheetContent";
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col space-y-2 text-left", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("text-lg font-semibold text-text-primary", className),
		...props
	});
}
var config = {
	todo: {
		label: "A fazer",
		dot: "bg-status-todo",
		selectedBg: "bg-status-todo/20",
		selectedBorder: "border-text-muted"
	},
	in_progress: {
		label: "Em progresso",
		dot: "bg-status-progress",
		selectedBg: "bg-status-progress/10",
		selectedBorder: "border-status-progress"
	},
	done: {
		label: "Concluído",
		dot: "bg-status-done",
		selectedBg: "bg-status-done/10",
		selectedBorder: "border-status-done"
	}
};
function StatusBadge({ status, selected = false, onClick }) {
	const c = config[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer", selected ? `${c.selectedBg} ${c.selectedBorder} text-text-primary` : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-2 h-2 rounded-full", c.dot) }), c.label]
	});
}
function ItemRow({ item, onToggle, sortable = false }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id,
		disabled: !sortable
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : void 0,
			position: "relative",
			zIndex: isDragging ? 50 : void 0
		},
		className: cn("flex items-center gap-2 pr-4 py-2 cursor-pointer", sortable ? "pl-2" : "pl-10", item.isCompleted && "opacity-50"),
		onClick: () => onToggle(item),
		children: [
			sortable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "shrink-0 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary touch-none px-1",
				...attributes,
				...listeners,
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, { size: 14 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				role: "checkbox",
				"aria-checked": item.isCompleted,
				"aria-label": item.isCompleted ? "Desmarcar item" : "Marcar item",
				children: item.isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$2, {
					size: 16,
					weight: "fill",
					className: "text-status-done shrink-0"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$3, {
					size: 16,
					className: "text-text-muted shrink-0"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-sm", item.isCompleted && "line-through text-text-muted"),
				children: item.title
			})
		]
	});
}
var itemKeys = { byTask: (taskId) => [
	"items",
	"task",
	taskId
] };
function useItems(taskId) {
	return useQuery({
		queryKey: itemKeys.byTask(taskId),
		queryFn: () => api.items.listByTask(taskId),
		enabled: !!taskId
	});
}
function useCreateItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data) => api.items.create(data),
		onSuccess: (result) => {
			qc.invalidateQueries({ queryKey: itemKeys.byTask(result.taskId) });
		}
	});
}
function useUpdateItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => api.items.update(id, data),
		onSuccess: (result) => {
			qc.invalidateQueries({ queryKey: itemKeys.byTask(result.taskId) });
		}
	});
}
function useDeleteItem() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }) => api.items.delete(id),
		onSuccess: (_, { taskId }) => {
			qc.invalidateQueries({ queryKey: itemKeys.byTask(taskId) });
		}
	});
}
function TaskDetailPanel({ taskId, open, onOpenChange }) {
	const queryClient = useQueryClient();
	const { data: task } = useTask(taskId ?? "");
	const { data: items = [] } = useItems(taskId ?? "");
	const { start: startPomodoro, isRunning: pomodoroRunning } = usePomodoro();
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();
	const createItem = useCreateItem();
	const updateItem = useUpdateItem();
	const deleteItem = useDeleteItem();
	const [title, setTitle] = import_react.useState("");
	const [description, setDescription] = import_react.useState("");
	const [priority, setPriority] = import_react.useState("medium");
	const [status, setStatus] = import_react.useState("todo");
	const [dueDate, setDueDate] = import_react.useState("");
	const [recurrence, setRecurrence] = import_react.useState("none");
	const [newItemTitle, setNewItemTitle] = import_react.useState("");
	const recurrenceOptions = [
		{
			value: "none",
			label: "Sem repetição"
		},
		{
			value: "daily",
			label: "Diariamente"
		},
		{
			value: "weekdays",
			label: "Dias úteis (Seg-Sex)"
		},
		{
			value: "weekly",
			label: "Semanalmente"
		},
		{
			value: "monthly",
			label: "Mensalmente"
		}
	];
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
	const itemIds = import_react.useMemo(() => items.map((i) => i.id), [items]);
	import_react.useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description ?? "");
			setPriority(task.priority);
			setStatus(task.status);
			setDueDate(toInputDate(task.dueDate));
			setRecurrence(task.recurrence || "none");
		}
	}, [task]);
	function handleSave() {
		if (!taskId) return;
		updateTask.mutate({
			id: taskId,
			data: {
				title,
				description,
				priority,
				status,
				dueDate: dueDate ? /* @__PURE__ */ new Date(dueDate + "T00:00:00") : null,
				recurrence
			}
		}, {
			onSuccess: () => {
				onOpenChange(false);
				toast.success("Tarefa salva");
			},
			onError: () => {
				toast.error("Erro ao salvar tarefa. Tente novamente.");
			}
		});
	}
	function handleDeleteTask() {
		if (!taskId || !task) return;
		if (!window.confirm("Tem certeza? Esta ação não pode ser desfeita.")) return;
		deleteTask.mutate({
			id: taskId,
			projectId: task.projectId
		}, {
			onSuccess: () => {
				onOpenChange(false);
				toast.success("Tarefa excluída");
			},
			onError: () => {
				toast.error("Erro ao excluir tarefa. Tente novamente.");
			}
		});
	}
	function handleAddItem() {
		if (!newItemTitle.trim() || !taskId) return;
		createItem.mutate({
			taskId,
			title: newItemTitle.trim()
		}, {
			onSuccess: () => {
				toast.success("Item adicionado");
			},
			onError: () => {
				toast.error("Erro ao adicionar item. Tente novamente.");
			}
		});
		setNewItemTitle("");
	}
	async function handleItemDragEnd(event) {
		if (!taskId) return;
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = items.findIndex((i) => i.id === active.id);
		const newIndex = items.findIndex((i) => i.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;
		const reordered = arrayMove(items, oldIndex, newIndex);
		queryClient.setQueryData(itemKeys.byTask(taskId), reordered.map((item, i) => ({
			...item,
			position: i
		})));
		const orderItems = reordered.map((item, i) => ({
			id: item.id,
			position: i
		}));
		try {
			await api.items.reorder(orderItems);
		} catch {
			toast.error("Erro ao reordenar itens. Tente novamente.");
			queryClient.invalidateQueries({ queryKey: itemKeys.byTask(taskId) });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			side: "right",
			className: "overflow-y-auto p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 pt-10 flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "sr-only",
						children: "Detalhes da tarefa"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "detail-title",
								className: "text-xs font-medium text-text-muted uppercase tracking-wider",
								children: "Título"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "detail-title",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "detail-description",
								className: "text-xs font-medium text-text-muted uppercase tracking-wider",
								children: "Descrição"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "detail-description",
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 3,
								className: "mt-1 flex w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-text-muted uppercase tracking-wider",
								children: "Prioridade"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex gap-1",
								children: [
									"high",
									"medium",
									"low"
								].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, {
									priority: p,
									selected: priority === p,
									onClick: () => setPriority(p)
								}, p))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-text-muted uppercase tracking-wider",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex gap-1",
								children: [
									"todo",
									"in_progress",
									"done"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: s,
									selected: status === s,
									onClick: () => setStatus(s)
								}, s))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "detail-due-date",
								className: "text-xs font-medium text-text-muted uppercase tracking-wider",
								children: "Data de entrega"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "detail-due-date",
								type: "date",
								value: dueDate,
								onChange: (e) => setDueDate(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, { size: 14 }), "Repetição"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: recurrence,
								onChange: (e) => setRecurrence(e.target.value),
								className: "mt-1 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
								children: recurrenceOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: opt.value,
									children: opt.label
								}, opt.value))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-medium text-text-muted uppercase tracking-wider",
						children: "Checklist"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 border border-border rounded-md overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
							sensors,
							collisionDetection: closestCenter,
							onDragEnd: handleItemDragEnd,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
								items: itemIds,
								strategy: verticalListSortingStrategy,
								children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemRow, {
											item,
											onToggle: () => updateItem.mutate({
												id: item.id,
												data: { isCompleted: !item.isCompleted }
											}),
											sortable: true
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => deleteItem.mutate({
											id: item.id,
											taskId: item.taskId
										}, {
											onSuccess: () => {
												toast.success("Item removido");
											},
											onError: () => {
												toast.error("Erro ao remover item. Tente novamente.");
											}
										}),
										"aria-label": "Remover item",
										className: "pr-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-text-muted hover:text-priority-high cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$4, { size: 14 })
									})]
								}, item.id))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-4 py-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
								size: 14,
								className: "text-text-muted shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Adicionar item...",
								value: newItemTitle,
								onChange: (e) => setNewItemTitle(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleAddItem(),
								className: "flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
							})]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleDeleteTask,
							className: "flex items-center gap-2 text-sm text-priority-high hover:text-red-700 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$4, { size: 16 }), "Excluir tarefa"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [task && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => startPomodoro({
									id: task.id,
									title: task.title,
									projectId: task.projectId
								}),
								disabled: pomodoroRunning,
								className: "flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$3, { size: 16 }), pomodoroRunning ? "Foco ativo" : "Iniciar foco"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleSave,
								disabled: !title.trim(),
								children: "Salvar"
							})]
						})]
					})
				]
			})
		})
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
function EditProjectDialog({ project, open, onOpenChange }) {
	const [name, setName] = import_react.useState(project.name);
	const [description, setDescription] = import_react.useState(project.description ?? "");
	const [color, setColor] = import_react.useState(project.color ?? PRESET_COLORS[0]);
	const updateProject = useUpdateProject();
	import_react.useEffect(() => {
		if (open) {
			setName(project.name);
			setDescription(project.description ?? "");
			setColor(project.color ?? PRESET_COLORS[0]);
		}
	}, [open, project]);
	function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		updateProject.mutate({
			id: project.id,
			data: {
				name: name.trim(),
				description,
				color
			}
		}, {
			onSuccess: () => {
				toast.success("Projeto atualizado");
				onOpenChange(false);
			},
			onError: () => {
				toast.error("Erro ao atualizar projeto");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Atualize as informações do projeto." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Nome"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Ex: Trabalho, Estudos...",
					className: "mt-1",
					autoFocus: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-text-muted uppercase tracking-wider",
					children: "Descrição"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
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
					children: "Salvar"
				})] })
			]
		})] })
	});
}
function DeleteProjectDialog({ projectId, projectName, open, onOpenChange }) {
	const deleteProject = useDeleteProject();
	const navigate = useNavigate();
	function handleDelete() {
		deleteProject.mutate(projectId, {
			onSuccess: () => {
				onOpenChange(false);
				navigate({ to: "/" });
			},
			onError: () => {
				toast.error("Erro ao excluir projeto");
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Excluir projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
			"Tem certeza que deseja excluir ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: projectName }),
			"? Todas as tarefas serão excluídas. Esta ação não pode ser desfeita."
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			onClick: () => onOpenChange(false),
			children: "Cancelar"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "destructive",
			onClick: handleDelete,
			disabled: deleteProject.isPending,
			children: deleteProject.isPending ? "Excluindo..." : "Excluir"
		})] })] })
	});
}
var DropdownMenuContext = import_react.createContext({
	open: false,
	onOpenChange: () => {}
});
function DropdownMenu({ children }) {
	const [open, setOpen] = import_react.useState(false);
	const value = import_react.useMemo(() => ({
		open,
		onOpenChange: setOpen
	}), [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContext.Provider, {
		value,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative inline-block",
			children
		})
	});
}
function DropdownMenuTrigger({ children, className, ...props }) {
	const { open, onOpenChange } = import_react.useContext(DropdownMenuContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("cursor-pointer", className),
		onClick: (e) => {
			e.stopPropagation();
			onOpenChange(!open);
		},
		...props,
		children
	});
}
function DropdownMenuContent({ className, children, align = "end", ...props }) {
	const { open, onOpenChange } = import_react.useContext(DropdownMenuContext);
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (!open) return;
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) onOpenChange(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open, onOpenChange]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg-elevated p-1 shadow-md", align === "end" && "right-0", align === "start" && "left-0", align === "center" && "left-1/2 -translate-x-1/2", className),
		...props,
		children
	});
}
function DropdownMenuItem({ className, children, onClick, ...props }) {
	const { onOpenChange } = import_react.useContext(DropdownMenuContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-text-primary outline-none transition-colors hover:bg-bg-secondary", className),
		onClick: (e) => {
			onClick?.(e);
			onOpenChange(false);
		},
		...props,
		children
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("-mx-1 my-1 h-px bg-border", className),
		...props
	});
}
function ProjectDetailPage() {
	const { projectId } = Route.useParams();
	const { view } = Route.useSearch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: project, isLoading: projectLoading } = useProject(projectId);
	const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId);
	const updateTask = useUpdateTask();
	const [createOpen, setCreateOpen] = import_react.useState(false);
	const [selectedTaskId, setSelectedTaskId] = import_react.useState(null);
	const [detailOpen, setDetailOpen] = import_react.useState(false);
	const [search, setSearch] = import_react.useState("");
	const debouncedSearch = useDebounce(search, 300);
	const [activeTask, setActiveTask] = import_react.useState(null);
	const [editOpen, setEditOpen] = import_react.useState(false);
	const [deleteOpen, setDeleteOpen] = import_react.useState(false);
	const currentView = view ?? "list";
	const filteredTasks = import_react.useMemo(() => {
		if (!debouncedSearch.trim()) return tasks;
		const query = debouncedSearch.toLowerCase();
		return tasks.filter((t) => t.title.toLowerCase().includes(query));
	}, [tasks, debouncedSearch]);
	const taskIds = import_react.useMemo(() => filteredTasks.map((t) => t.id), [filteredTasks]);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
	function setView(v) {
		navigate({
			to: "/projects/$projectId",
			params: { projectId },
			search: v === "list" ? {} : { view: v },
			replace: true
		});
	}
	function handleToggle(task) {
		updateTask.mutate({
			id: task.id,
			data: { status: task.status === "done" ? "todo" : "done" }
		});
	}
	function handleTaskClick(task) {
		setSelectedTaskId(task.id);
		setDetailOpen(true);
	}
	function handleDragStart(event) {
		setActiveTask(filteredTasks.find((t) => t.id === event.active.id) ?? null);
	}
	async function handleDragEnd(event) {
		setActiveTask(null);
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
		const newIndex = filteredTasks.findIndex((t) => t.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;
		const reordered = arrayMove(filteredTasks, oldIndex, newIndex);
		queryClient.setQueryData(taskKeys.byProject(projectId), (old) => {
			if (!old) return old;
			const reorderedIds = reordered.map((t) => t.id);
			const updated = old.map((t) => {
				const idx = reorderedIds.indexOf(t.id);
				if (idx !== -1) return {
					...t,
					position: idx
				};
				return t;
			});
			updated.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
			return updated;
		});
		const orderItems = reordered.map((t, i) => ({
			id: t.id,
			position: i
		}));
		try {
			await api.tasks.reorder(orderItems);
		} catch {
			toast.error("Erro ao reordenar tarefas. Tente novamente.");
			queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
		}
	}
	if (projectLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-7 md:px-16 md:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-28 bg-bg-secondary rounded animate-pulse" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-8 w-48 bg-bg-secondary rounded animate-pulse" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-bg-secondary rounded animate-pulse" }, i))
			})
		]
	});
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-7 md:px-16 md:py-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-text-muted",
			children: "Projeto não encontrado."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-accent text-sm mt-2 inline-block",
			children: "Voltar"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-7 md:px-16 md:py-12 animate-fade-in-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$4, { size: 14 }), "Meus Projetos"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl md:text-4xl font-normal text-text-primary tracking-tight truncate",
						children: project.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						className: "p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors flex-shrink-0",
						"aria-label": "Opções do projeto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$5, {
							size: 22,
							weight: "bold"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => setEditOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a, { size: 16 }), "Editar projeto"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => setDeleteOpen(true),
							className: "text-priority-high",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$4, { size: 16 }), "Excluir projeto"]
						})
					] })] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewToggle, {
					value: currentView,
					onChange: setView
				})]
			}),
			project.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-text-secondary",
				children: project.description
			}),
			tasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
					value: search,
					onChange: setSearch,
					placeholder: "Buscar tarefas..."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: tasksLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-bg-secondary rounded animate-pulse" }, i))
				}) : tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAddTask, { projectId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IllustrationTasks, {}),
						title: "Nenhuma tarefa ainda",
						description: "Adicione tarefas para começar a organizar este projeto."
					})]
				}) : filteredTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAddTask, { projectId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IllustrationSearch, {}),
						title: "Nenhum resultado",
						description: `Nenhuma tarefa encontrada para "${search}".`
					})]
				}) : currentView === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAddTask, { projectId }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DndContext, {
					sensors,
					collisionDetection: closestCenter,
					onDragStart: handleDragStart,
					onDragEnd: handleDragEnd,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
						items: taskIds,
						strategy: verticalListSortingStrategy,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border border-border rounded-lg overflow-hidden bg-bg-elevated",
							children: filteredTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
								task,
								onToggle: handleToggle,
								onClick: handleTaskClick,
								sortable: true
							}, task.id))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragOverlay, {
						dropAnimation: null,
						children: activeTask ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRowOverlay, { task: activeTask }) : null
					})]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanBoard, {
					tasks: filteredTasks,
					onTaskClick: handleTaskClick,
					projectId
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fab, { onClick: () => setCreateOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateTaskDialog, {
				projectId,
				open: createOpen,
				onOpenChange: setCreateOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskDetailPanel, {
				taskId: selectedTaskId,
				open: detailOpen,
				onOpenChange: setDetailOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditProjectDialog, {
				project,
				open: editOpen,
				onOpenChange: setEditOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteProjectDialog, {
				projectId: project.id,
				projectName: project.name,
				open: deleteOpen,
				onOpenChange: setDeleteOpen
			})
		]
	});
}
//#endregion
export { ProjectDetailPage as component };
