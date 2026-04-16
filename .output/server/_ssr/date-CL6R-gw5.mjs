//#region node_modules/.nitro/vite/services/ssr/assets/date-CL6R-gw5.js
var MONTHS_PT = [
	"jan",
	"fev",
	"mar",
	"abr",
	"mai",
	"jun",
	"jul",
	"ago",
	"set",
	"out",
	"nov",
	"dez"
];
function formatDatePt(date) {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	if (isNaN(d.getTime())) return "";
	return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`;
}
function isOverdue(date) {
	if (!date) return false;
	const d = typeof date === "string" ? new Date(date) : date;
	if (isNaN(d.getTime())) return false;
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	return d < today;
}
function toInputDate(date) {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	if (isNaN(d.getTime())) return "";
	return d.toISOString().split("T")[0];
}
//#endregion
export { isOverdue as n, toInputDate as r, formatDatePt as t };
