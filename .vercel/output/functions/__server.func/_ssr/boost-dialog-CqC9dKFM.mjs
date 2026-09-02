import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as MAX_CENTS, r as formatEur, t as AMOUNT_PRESETS } from "./core-Dlm6ZISz.mjs";
import { n as createIntent } from "./api-DW8tokSB.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { i as cn, t as Button } from "./site-footer-Xl2cLnw5.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/boost-dialog-CqC9dKFM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-card px-3 text-base text-foreground shadow-(--shadow-border) transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-sm font-medium text-foreground", className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-card p-6 text-card-foreground shadow-(--shadow-border) duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Cerrar"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function BoostDialog({ brand, onClose }) {
	const navigate = useNavigate();
	const [cents, setCents] = (0, import_react.useState)(2500);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		if (!brand) return;
		setBusy(true);
		try {
			const { intent } = await createIntent({ data: {
				brandId: brand.id,
				amountCents: cents
			} });
			onClose();
			await navigate({
				to: "/pay/$intentId",
				params: { intentId: intent.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "No se pudo crear la puja");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!brand,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Impulsar ", brand?.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Cada euro se suma al total. El logo crece con la raíz de lo acumulado." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [brand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: brand.logoData,
					alt: "",
					className: "logo-img size-14 rounded-sm object-contain bg-muted"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: brand?.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-sm text-muted-foreground tabular-nums",
					children: [
						"Ahora ",
						brand ? formatEur(brand.totalCents) : "",
						" · #",
						brand?.rank
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmountPicker, {
				cents,
				onChange: setCents
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "lg",
				onClick: submit,
				disabled: busy,
				children: busy ? "Preparando…" : `Pujar ${formatEur(cents)}`
			})
		] })
	});
}
function AmountPicker({ cents, onChange }) {
	const euros = cents / 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
			children: AMOUNT_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChange(p),
				className: `h-11 whitespace-nowrap rounded-md px-2 font-mono text-sm tabular-nums shadow-(--shadow-border) transition-[background-color,box-shadow] duration-150 ${cents === p ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:shadow-(--shadow-border-hover)"}`,
				children: [p / 100, "€"]
			}, p))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "custom-amount",
					children: "Otra cantidad (€)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "custom-amount",
					type: "number",
					min: 5,
					max: MAX_CENTS / 100,
					step: 1,
					value: Number.isFinite(euros) ? euros : "",
					onChange: (e) => {
						const n = Number(e.target.value);
						if (!Number.isFinite(n)) return;
						onChange(Math.round(n * 100));
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Mínimo ",
						formatEur(500),
						" · máximo ",
						formatEur(MAX_CENTS)
					]
				})
			]
		})]
	});
}
//#endregion
export { Label as i, BoostDialog as n, Input as r, AmountPicker as t };
