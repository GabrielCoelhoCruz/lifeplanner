import { r as __toESM } from "../_runtime.mjs";
import { t as api } from "./utils-DYVNqSxv.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-notification-checker-K2UtiDBF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeContext = (0, import_react.createContext)(null);
function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem("settings:theme");
	if (stored === "light" || stored === "dark") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)(getInitialTheme);
	(0, import_react.useEffect)(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("settings:theme", theme);
	}, [theme]);
	const setTheme = (t) => setThemeState(t);
	const toggleTheme = () => setThemeState((prev) => prev === "light" ? "dark" : "light");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			setTheme,
			toggleTheme
		},
		children
	});
}
function useTheme() {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
async function requestNotificationPermission() {
	if (!("Notification" in window)) return false;
	if (Notification.permission === "granted") return true;
	if (Notification.permission === "denied") return false;
	return await Notification.requestPermission() === "granted";
}
function getNotificationSetting() {
	return localStorage.getItem("lifeplanner-notifications") === "true";
}
function setNotificationSetting(enabled) {
	localStorage.setItem("lifeplanner-notifications", String(enabled));
}
function showTaskNotification(taskTitle, timeInfo) {
	if (!getNotificationSetting()) return;
	if (Notification.permission !== "granted") return;
	new Notification("LifePlanner", {
		body: `"${taskTitle}" — prazo em ${timeInfo}`,
		icon: "/icons/icon.svg",
		tag: `task-${taskTitle.slice(0, 20)}`,
		requireInteraction: false
	});
}
var CHECK_INTERVAL = 900 * 1e3;
var NOTIFIED_KEY = "lifeplanner-notified-tasks";
function getNotifiedTasks() {
	try {
		const stored = localStorage.getItem(NOTIFIED_KEY);
		return stored ? new Set(JSON.parse(stored)) : /* @__PURE__ */ new Set();
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function markTaskNotified(taskId) {
	const notified = getNotifiedTasks();
	notified.add(taskId);
	const arr = Array.from(notified).slice(-100);
	localStorage.setItem(NOTIFIED_KEY, JSON.stringify(arr));
}
function formatDueDate(dueDate) {
	const date = new Date(dueDate);
	const now = /* @__PURE__ */ new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffHours = Math.round(diffMs / (1e3 * 60 * 60));
	if (diffHours < 0) return "atrasada!";
	if (diffHours < 1) return "menos de 1 hora";
	if (diffHours < 24) return `${diffHours} horas`;
	return `${Math.round(diffHours / 24)} dias`;
}
async function checkAndNotify() {
	if (!getNotificationSetting()) return;
	if (Notification.permission !== "granted") return;
	try {
		const todayTasks = await api.views.today();
		const notified = getNotifiedTasks();
		for (const { task } of todayTasks) {
			if (notified.has(task.id)) continue;
			if (!task.dueDate) continue;
			showTaskNotification(task.title, formatDueDate(task.dueDate));
			markTaskNotified(task.id);
		}
	} catch (error) {
		console.error("Notification check failed:", error);
	}
}
function useNotificationChecker() {
	const intervalRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timeout = setTimeout(checkAndNotify, 5e3);
		intervalRef.current = setInterval(checkAndNotify, CHECK_INTERVAL);
		return () => {
			clearTimeout(timeout);
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);
}
//#endregion
export { useNotificationChecker as a, setNotificationSetting as i, checkAndNotify as n, useTheme as o, requestNotificationPermission as r, ThemeProvider as t };
