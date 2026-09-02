import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as shareTweetText, r as formatEur, u as shareIntentUrl } from "./core-Dlm6ZISz.mjs";
import { n as SiteFooter, r as SiteHeader, t as Button } from "./site-footer-Xl2cLnw5.mjs";
import { r as Route$1 } from "./router-BI2doANS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/done._brandId-COw9_wJr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CrownOverlay({ name, logoData, onDone }) {
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(onDone, 4200);
		return () => window.clearTimeout(t);
	}, [onDone]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "crown-layer fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground px-6 text-background",
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "crown-mark text-[11px] font-medium tracking-[0.22em] uppercase",
				children: "Nuevo número uno"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: logoData,
				alt: "",
				className: "crown-mark logo-img mt-8 size-40 rounded-lg bg-background object-contain sm:size-52",
				style: { animationDelay: "80ms" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "crown-mark mt-8 font-display text-4xl font-medium tracking-tight sm:text-6xl",
				style: { animationDelay: "140ms" },
				children: name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "crown-mark mt-3 max-w-sm text-center text-sm text-background/70",
				style: { animationDelay: "200ms" },
				children: "El ranking acaba de cambiar. El logo más caro del tablero es este."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				className: "crown-mark mt-8",
				style: { animationDelay: "260ms" },
				onClick: onDone,
				children: "Ver el ranking"
			})
		]
	});
}
function DonePage() {
	const { brandId } = Route$1.useParams();
	const { crowned } = Route$1.useSearch();
	const board = Route$1.useLoaderData();
	const brand = board.brands.find((b) => b.id === brandId);
	const [showCrown, setShowCrown] = (0, import_react.useState)(crowned === "1");
	const [share, setShare] = (0, import_react.useState)("#");
	const dismiss = (0, import_react.useCallback)(() => setShowCrown(false), []);
	(0, import_react.useEffect)(() => {
		if (!brand) return;
		setShare(shareIntentUrl(shareTweetText({
			name: brand.name,
			rank: brand.rank,
			totalCents: brand.totalCents,
			origin: window.location.origin
		})));
	}, [brand]);
	const above = brand ? board.brands.find((b) => b.rank === brand.rank - 1) : void 0;
	const gap = above && brand ? above.totalCents - brand.totalCents + 100 : null;
	if (!brand) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-lg flex-1 px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Puja publicada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "No encontramos esa marca en el ranking."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "Volver al ranking"
					})
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			showCrown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrownOverlay, {
				name: brand.name,
				logoData: brand.logoData,
				onDone: dismiss
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
						children: "Confirmado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-medium tracking-tight",
						children: brand.rank === 1 ? "Eres el número uno." : `Eres el #${brand.rank}.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 overflow-hidden rounded-xl bg-card p-4 shadow-(--shadow-border)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: brand.logoData,
							alt: "",
							className: "logo-img mx-auto aspect-square w-2/3 object-contain"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Marca",
								value: brand.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Posición",
								value: `#${brand.rank}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Total acumulado",
								value: formatEur(brand.totalCents),
								mono: true
							}),
							gap != null && above ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `Para superar a ${above.name}`,
								value: formatEur(gap),
								mono: true
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: share,
									target: "_blank",
									rel: "noreferrer",
									children: "Compartir en X"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "secondary",
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									children: "Ver el ranking"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/bid",
									children: "Pujar otra vez"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Row({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 border-b border-border pb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: mono ? "font-mono text-sm tabular-nums" : "text-sm font-medium",
			children: value
		})]
	});
}
//#endregion
export { DonePage as component };
