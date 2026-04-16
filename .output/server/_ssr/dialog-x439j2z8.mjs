import { r as __toESM } from "../_runtime.mjs";
import { n as cn } from "./utils-DYVNqSxv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as n } from "../_libs/phosphor-icons__react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-x439j2z8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PomodoroContext = (0, import_react.createContext)(null);
var DEFAULT_MINUTES = 25;
function PomodoroProvider({ children }) {
	const [activeTask, setActiveTask] = (0, import_react.useState)(null);
	const [isRunning, setIsRunning] = (0, import_react.useState)(false);
	const [isPaused, setIsPaused] = (0, import_react.useState)(false);
	const [secondsRemaining, setSecondsRemaining] = (0, import_react.useState)(0);
	const [totalSeconds, setTotalSeconds] = (0, import_react.useState)(0);
	const intervalRef = (0, import_react.useRef)(null);
	const clearTimer = (0, import_react.useCallback)(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);
	const handleComplete = (0, import_react.useCallback)(() => {
		clearTimer();
		setIsRunning(false);
		setIsPaused(false);
		if (Notification.permission === "granted") new Notification("LifePlanner — Pomodoro concluido!", {
			body: `Sessao de foco para "${activeTask?.title}" finalizada. Hora de uma pausa!`,
			icon: "/icons/icon.svg"
		});
		try {
			const audioCtx = new AudioContext();
			const oscillator = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			oscillator.connect(gain);
			gain.connect(audioCtx.destination);
			oscillator.frequency.value = 800;
			gain.gain.value = .1;
			oscillator.start();
			gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + 1);
			oscillator.stop(audioCtx.currentTime + 1);
		} catch {}
		setActiveTask(null);
		setSecondsRemaining(0);
	}, [clearTimer, activeTask]);
	const start = (0, import_react.useCallback)((task, minutes = DEFAULT_MINUTES) => {
		clearTimer();
		const total = minutes * 60;
		setActiveTask(task);
		setTotalSeconds(total);
		setSecondsRemaining(total);
		setIsRunning(true);
		setIsPaused(false);
		intervalRef.current = setInterval(() => {
			setSecondsRemaining((prev) => {
				if (prev <= 1) return 0;
				return prev - 1;
			});
		}, 1e3);
	}, [clearTimer]);
	(0, import_react.useEffect)(() => {
		if (isRunning && !isPaused && secondsRemaining === 0 && totalSeconds > 0) handleComplete();
	}, [
		secondsRemaining,
		isRunning,
		isPaused,
		totalSeconds,
		handleComplete
	]);
	const pause = (0, import_react.useCallback)(() => {
		clearTimer();
		setIsPaused(true);
	}, [clearTimer]);
	const resume = (0, import_react.useCallback)(() => {
		setIsPaused(false);
		intervalRef.current = setInterval(() => {
			setSecondsRemaining((prev) => {
				if (prev <= 1) return 0;
				return prev - 1;
			});
		}, 1e3);
	}, []);
	const stop = (0, import_react.useCallback)(() => {
		clearTimer();
		setIsRunning(false);
		setIsPaused(false);
		setActiveTask(null);
		setSecondsRemaining(0);
		setTotalSeconds(0);
	}, [clearTimer]);
	(0, import_react.useEffect)(() => clearTimer, [clearTimer]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PomodoroContext.Provider, {
		value: {
			isRunning,
			isPaused,
			secondsRemaining,
			totalSeconds,
			activeTask,
			start,
			pause,
			resume,
			stop
		},
		children
	});
}
function usePomodoro() {
	const ctx = (0, import_react.useContext)(PomodoroContext);
	if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
	return ctx;
}
function formatTime(seconds) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
var DialogContext = import_react.createContext({
	open: false,
	onOpenChange: () => {}
});
function Dialog({ open = false, onOpenChange, children }) {
	const value = import_react.useMemo(() => ({
		open,
		onOpenChange: onOpenChange ?? (() => {})
	}), [open, onOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContext.Provider, {
		value,
		children
	});
}
function DialogPortal({ children }) {
	const { open } = import_react.useContext(DialogContext);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function DialogOverlay({ className, ...props }) {
	const { onOpenChange } = import_react.useContext(DialogContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-50 bg-text-primary/60 backdrop-blur-sm animate-in fade-in-0", className),
		onClick: () => onOpenChange(false),
		...props
	});
}
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => {
	const { onOpenChange } = import_react.useContext(DialogContext);
	import_react.useEffect(() => {
		function onKeyDown(e) {
			if (e.key === "Escape") onOpenChange(false);
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-bg-elevated p-5 sm:p-6 shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95", className),
		onClick: (e) => e.stopPropagation(),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer",
			onClick: () => onOpenChange(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Fechar"
			})]
		})]
	})] });
});
DialogContent.displayName = "DialogContent";
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("text-lg font-semibold leading-none tracking-tight text-text-primary", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-text-secondary", className),
		...props
	});
}
//#endregion
export { DialogHeader as a, formatTime as c, DialogFooter as i, usePomodoro as l, DialogContent as n, DialogTitle as o, DialogDescription as r, PomodoroProvider as s, Dialog as t };
