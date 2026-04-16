import { c as createFileRoute, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._projectId-DRXsSlnu.js
var $$splitComponentImporter = () => import("./projects._projectId-Ydy_LpbC.mjs");
var Route = createFileRoute("/projects/$projectId")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (search) => ({ view: search.view === "kanban" ? "kanban" : void 0 })
});
//#endregion
export { Route as t };
