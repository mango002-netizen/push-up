import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as formatEur } from "./core-Dlm6ZISz.mjs";
import { n as SiteFooter, r as SiteHeader, t as Button } from "./site-footer-Xl2cLnw5.mjs";
import { i as Route$2 } from "./router-BI2doANS.mjs";
import { r as format, t as es } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fame-DQnaCQax.js
var import_jsx_runtime = require_jsx_runtime();
function FamePage() {
	const { entries } = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
						children: "Archivo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-medium tracking-tight sm:text-6xl",
						children: "Salón de la fama"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-lg text-muted-foreground",
						children: "Cada vez que un logo se convierte en #1, queda grabado. El tamaño más grande de su era."
					}),
					entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 rounded-xl bg-card px-6 py-16 text-center shadow-(--shadow-border)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: "Todavía no hay coronas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/bid",
								children: "Sé el primero"
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-card p-4 shadow-(--shadow-border)",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: e.logoData,
									alt: `Logo de ${e.name}`,
									className: "logo-img aspect-square w-full rounded-md object-contain"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-4 font-display text-xl font-medium tracking-tight",
									children: e.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-sm text-muted-foreground tabular-nums",
									children: [formatEur(e.totalCents), " al coronarse"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: format(new Date(e.crownedAt), "d MMM yyyy, HH:mm", { locale: es })
								})
							]
						}, e.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { FamePage as component };
