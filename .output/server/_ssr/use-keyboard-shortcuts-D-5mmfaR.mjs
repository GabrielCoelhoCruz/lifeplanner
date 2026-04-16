import { r as __toESM } from "../_runtime.mjs";
import { d as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-keyboard-shortcuts-D-5mmfaR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useKeyboardShortcuts(handlers = {}) {
	const navigate = useNavigate();
	const pendingPrefix = (0, import_react.useRef)(null);
	const prefixTimeout = (0, import_react.useRef)(null);
	const handlersRef = (0, import_react.useRef)(handlers);
	handlersRef.current = handlers;
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			const target = e.target;
			if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable || target.closest("[role=\"dialog\"]") || target.closest("[role=\"alertdialog\"]")) return;
			const key = e.key.toLowerCase();
			if (pendingPrefix.current === "g") {
				pendingPrefix.current = null;
				if (prefixTimeout.current) clearTimeout(prefixTimeout.current);
				e.preventDefault();
				switch (key) {
					case "h":
						navigate({ to: "/" });
						break;
					case "t":
						navigate({ to: "/today" });
						break;
					case "s":
						navigate({ to: "/settings" });
						break;
				}
				return;
			}
			switch (key) {
				case "g":
					e.preventDefault();
					pendingPrefix.current = "g";
					prefixTimeout.current = setTimeout(() => {
						pendingPrefix.current = null;
					}, 1e3);
					break;
				case "n":
					e.preventDefault();
					if (handlersRef.current.onNewTask) handlersRef.current.onNewTask();
					else if (handlersRef.current.onNewProject) handlersRef.current.onNewProject();
					break;
				case "p":
					e.preventDefault();
					handlersRef.current.onNewProject?.();
					break;
				case "/":
					e.preventDefault();
					handlersRef.current.onFocusSearch?.();
					break;
				case "?":
					e.preventDefault();
					handlersRef.current.onShowHelp?.();
					break;
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			if (prefixTimeout.current) clearTimeout(prefixTimeout.current);
		};
	}, [navigate]);
}
//#endregion
export { useKeyboardShortcuts as t };
