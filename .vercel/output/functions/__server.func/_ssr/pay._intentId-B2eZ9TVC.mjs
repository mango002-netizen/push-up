import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as formatEur } from "./core-Dlm6ZISz.mjs";
import { t as confirmPay } from "./api-DW8tokSB.mjs";
import { n as SiteFooter, r as SiteHeader, t as Button } from "./site-footer-Xl2cLnw5.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-BI2doANS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pay._intentId-B2eZ9TVC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PayPage() {
	const { intent } = Route.useLoaderData();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function pay() {
		setBusy(true);
		try {
			await wait(1100);
			const result = await confirmPay({ data: { intentId: intent.id } });
			await navigate({
				to: "/done/$brandId",
				params: { brandId: result.brandId },
				search: { crowned: result.crowned ? "1" : void 0 }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "El pago no se pudo completar");
			setBusy(false);
		}
	}
	const alreadyPaid = intent.status === "paid";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-md flex-1 px-4 py-10 sm:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
						children: "Confirmar puja"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-medium tracking-tight",
						children: "Pago"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-xl bg-card p-5 shadow-(--shadow-border)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: intent.logoData,
								alt: "",
								className: "logo-img size-16 rounded-md object-contain bg-muted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-lg font-medium",
									children: intent.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-muted-foreground",
									children: intent.url
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-baseline justify-between border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "Puja"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-2xl tabular-nums",
								children: formatEur(intent.amountCents)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: "Confirmación instantánea para el ranking público. En esta versión no se cobra una tarjeta real: la puja se publica al confirmar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "lg",
						className: "mt-6 w-full",
						onClick: pay,
						disabled: busy || alreadyPaid,
						children: busy ? "Procesando…" : alreadyPaid ? "Ya pagado" : `Pagar ${formatEur(intent.amountCents)}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function wait(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
//#endregion
export { PayPage as component };
