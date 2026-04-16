import { r as __toESM } from "../_runtime.mjs";
import { u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as api } from "./utils-DYVNqSxv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime, i as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { D as s, b as s$4, k as s$1, l as c, m as s$2, o as s$3, r as s$5 } from "../_libs/phosphor-icons__react.mjs";
import { t as Button } from "./button-DU_X_Ukl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as setNotificationSetting, n as checkAndNotify, o as useTheme, r as requestNotificationPermission } from "./use-notification-checker-K2UtiDBF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-C4D2VgiO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: decorative ? "none" : "separator",
	"aria-orientation": !decorative ? orientation : void 0,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = "Separator";
function useLocalToggle(key, defaultValue = false) {
	const [value, setValue] = import_react.useState(() => {
		try {
			const stored = localStorage.getItem(key);
			return stored !== null ? stored === "true" : defaultValue;
		} catch {
			return defaultValue;
		}
	});
	function toggle() {
		const next = !value;
		setValue(next);
		try {
			localStorage.setItem(key, String(next));
		} catch {}
	}
	return [value, toggle];
}
function Toggle({ checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: onChange,
		className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? "bg-accent" : "bg-bg-secondary"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}` })
	});
}
function SettingsPage() {
	const { theme, toggleTheme } = useTheme();
	const queryClient = useQueryClient();
	const [notifications, toggleNotifications] = useLocalToggle("settings:notifications", true);
	const [sounds, toggleSounds] = useLocalToggle("settings:sounds", true);
	const fileInputRef = import_react.useRef(null);
	async function handleToggleNotifications() {
		if (!notifications) {
			if (!await requestNotificationPermission()) {
				toast.error("Permissão de notificações negada pelo navegador.");
				return;
			}
			setNotificationSetting(true);
			toggleNotifications();
			toast.success("Notificações ativadas! Você será avisado sobre tarefas próximas do prazo.");
			checkAndNotify();
		} else {
			setNotificationSetting(false);
			toggleNotifications();
			toast.info("Notificações desativadas.");
		}
	}
	const [importing, setImporting] = import_react.useState(false);
	async function handleExport() {
		try {
			const data = await api.data.exportAll();
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `lifeplanner-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Dados exportados");
		} catch (err) {
			console.error("Export failed:", err);
			toast.error("Erro ao exportar. Tente novamente.");
		}
	}
	async function handleImport(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setImporting(true);
		try {
			const text = await file.text();
			const data = JSON.parse(text);
			if (!data.projects || !Array.isArray(data.projects)) {
				toast.error("Arquivo inválido: nenhum projeto encontrado.");
				return;
			}
			const result = await api.data.importAll(data);
			toast.success(`Importados: ${result.imported.projects} projetos, ${result.imported.tasks} tarefas, ${result.imported.items} itens`);
			queryClient.invalidateQueries();
		} catch (err) {
			console.error("Import failed:", err);
			toast.error("Erro ao importar dados. Tente novamente.");
		} finally {
			setImporting(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-7 md:px-16 md:py-12 max-w-2xl animate-fade-in-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, { size: 14 }), "Meus Projetos"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 text-3xl md:text-4xl font-normal text-text-primary tracking-tight",
				children: "Configurações"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 bg-bg-elevated border border-border rounded-lg overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
								size: 20,
								className: "text-text-secondary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-text-primary",
								children: "Notificações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-text-muted",
								children: "Receber lembretes de tarefas"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							checked: notifications,
							onChange: handleToggleNotifications
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
								size: 20,
								className: "text-text-secondary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-text-primary",
								children: "Sons"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-text-muted",
								children: "Reproduzir sons ao concluir tarefas"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							checked: sounds,
							onChange: toggleSounds
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, {
								size: 20,
								className: "text-text-secondary"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$3, {
								size: 20,
								className: "text-text-secondary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-text-primary",
								children: "Tema"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-text-muted",
								children: "Alterne entre tema claro e escuro"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-text-muted",
								children: theme === "dark" ? "Escuro" : "Claro"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: theme === "dark",
								onChange: toggleTheme
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$4, {
								size: 20,
								className: "text-text-secondary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-text-primary",
								children: "Exportar dados"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-text-muted",
								children: "Baixar todos os dados como JSON"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExport,
							children: "Exportar JSON"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 bg-bg-elevated border border-border rounded-lg overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$5, {
							size: 20,
							className: "text-text-secondary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-text-primary",
							children: "Importar dados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-text-muted",
							children: "Restaurar dados a partir de um arquivo JSON"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: ".json",
						onChange: handleImport,
						className: "hidden"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: importing,
						onClick: () => fileInputRef.current?.click(),
						children: importing ? "Importando..." : "Importar JSON"
					})] })]
				})
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
