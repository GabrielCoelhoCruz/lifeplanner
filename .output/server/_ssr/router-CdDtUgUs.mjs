import { r as __toESM } from "../_runtime.mjs";
import { a as createRouter, c as createFileRoute, l as createRootRoute, n as Scripts, o as Outlet, r as HeadContent, s as lazyRouteComponent, u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { O as c, _ as n, a as s, d as n$2, p as n$3, s as s$1, y as n$1 } from "../_libs/phosphor-icons__react.mjs";
import { a as DialogHeader, c as formatTime, l as usePomodoro, n as DialogContent, o as DialogTitle, s as PomodoroProvider, t as Dialog } from "./dialog-x439j2z8.mjs";
import { t as Route$4 } from "./projects._projectId-DRXsSlnu.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as useNotificationChecker, t as ThemeProvider } from "./use-notification-checker-K2UtiDBF.mjs";
import { t as useKeyboardShortcuts } from "./use-keyboard-shortcuts-D-5mmfaR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CdDtUgUs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Header({ onShowShortcuts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between px-5 py-4 md:px-16 bg-bg-elevated border-b border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-2xl font-normal text-text-primary tracking-tight",
				children: "LifePlanner"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "hidden md:flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/today",
					className: "text-sm font-medium text-text-secondary hover:text-text-primary transition-colors [&.active]:text-accent",
					children: "Hoje"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onShowShortcuts,
					className: "hidden md:flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors",
					title: "Atalhos de teclado",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "px-1 py-0.5 text-[10px] font-mono bg-bg-secondary rounded border border-border",
						children: "?"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/today",
					className: "md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors",
					"aria-label": "Tarefas de hoje",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { size: 22 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors",
					"aria-label": "Configurações",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, { size: 22 })
				})
			]
		})]
	});
}
var ErrorBoundary = class extends import_react.Component {
	state = { hasError: false };
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	render() {
		if (this.state.hasError) return this.props.fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center min-h-[50vh] gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg text-text-secondary",
				children: "Algo deu errado."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => this.setState({ hasError: false }),
				className: "px-4 py-2 bg-accent text-white rounded-md text-sm",
				children: "Tentar novamente"
			})]
		});
		return this.props.children;
	}
};
var shortcuts = [
	{
		keys: ["N"],
		description: "Nova tarefa"
	},
	{
		keys: ["P"],
		description: "Novo projeto"
	},
	{
		keys: ["/"],
		description: "Buscar"
	},
	{
		keys: ["G", "H"],
		description: "Ir para Dashboard"
	},
	{
		keys: ["G", "T"],
		description: "Ir para Hoje"
	},
	{
		keys: ["G", "S"],
		description: "Ir para Configurações"
	},
	{
		keys: ["?"],
		description: "Mostrar atalhos"
	},
	{
		keys: ["Esc"],
		description: "Fechar painel/dialog"
	}
];
function ShortcutsHelp({ open, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { size: 20 }), "Atalhos de teclado"]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 mt-2",
			children: shortcuts.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between py-2 border-b border-border last:border-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-text-secondary",
					children: s.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1",
					children: s.keys.map((k, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "px-2 py-1 text-xs font-mono bg-bg-secondary text-text-primary rounded border border-border",
						children: k
					}), j < s.keys.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-text-muted mx-1",
						children: "then"
					})] }, j))
				})]
			}, i))
		})] })
	});
}
function PomodoroBar() {
	const { isRunning, isPaused, secondsRemaining, totalSeconds, activeTask, pause, resume, stop } = usePomodoro();
	if (!isRunning && !isPaused) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-0 left-0 right-0 z-40 bg-bg-elevated border-t border-border shadow-lg animate-fade-in-up",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1 bg-bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-accent transition-all duration-1000 ease-linear",
				style: { width: `${totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds * 100 : 0}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-5 py-3 md:px-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
					size: 20,
					className: "text-accent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-text-primary truncate max-w-[200px]",
					children: activeTask?.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-text-muted",
					children: "Modo foco"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl font-mono text-text-primary tabular-nums",
					children: formatTime(secondsRemaining)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [isPaused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: resume,
						className: "p-2 rounded-lg text-accent hover:bg-bg-secondary transition-colors",
						"aria-label": "Continuar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$2, {
							size: 20,
							weight: "fill"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: pause,
						className: "p-2 rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors",
						"aria-label": "Pausar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$3, {
							size: 20,
							weight: "fill"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: stop,
						className: "p-2 rounded-lg text-priority-high hover:bg-bg-secondary transition-colors",
						"aria-label": "Parar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
							size: 20,
							weight: "fill"
						})
					})]
				})]
			})]
		})]
	});
}
var src_default = "/assets/index-CMgS5-eb.css";
var queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1e3 * 60 } } });
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "LifePlanner" },
			{
				name: "description",
				content: "Organize sua vida em um só lugar"
			},
			{
				name: "theme-color",
				content: "#FAFAF9"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: src_default
			},
			{
				rel: "icon",
				href: "/icons/icon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		],
		scripts: [{ children: `(function(){var t=localStorage.getItem('settings:theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)})()` }]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PomodoroProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootLayout, { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PomodoroBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-right",
				richColors: true,
				closeButton: true
			})
		] }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })] });
}
function RootLayout({ children }) {
	const [shortcutsOpen, setShortcutsOpen] = (0, import_react.useState)(false);
	useNotificationChecker();
	useKeyboardShortcuts({
		onShowHelp: () => setShortcutsOpen(true),
		onFocusSearch: () => {
			document.getElementById("search-input")?.focus();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onShowShortcuts: () => setShortcutsOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutsHelp, {
				open: shortcutsOpen,
				onOpenChange: setShortcutsOpen
			})
		]
	});
}
var $$splitComponentImporter$2 = () => import("./today-XE8yzGjJ.mjs");
var Route$2 = createFileRoute("/today")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./settings-C4D2VgiO.mjs");
var Route$1 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./routes-BmuQmXh8.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TodayRoute = Route$2.update({
	id: "/today",
	path: "/today",
	getParentRoute: () => Route$3
});
var SettingsRoute = Route$1.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	SettingsRoute,
	TodayRoute,
	ProjectsProjectIdRoute: Route$4.update({
		id: "/projects/$projectId",
		path: "/projects/$projectId",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
