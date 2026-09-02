import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatPixels, p as xProfileUrl, r as formatEur } from "./core-Dlm6ZISz.mjs";
import { r as getBoard } from "./api-DW8tokSB.mjs";
import { o as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as cn, n as SiteFooter, r as SiteHeader, t as Button } from "./site-footer-Xl2cLnw5.mjs";
import { n as BoostDialog } from "./boost-dialog-CqC9dKFM.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Route$4 } from "./router-BI2doANS.mjs";
import { n as formatDistanceToNow, t as es } from "../_libs/date-fns.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-_UncOw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LogoRow({ brand, onBoost, measureRef }) {
	const rank = String(brand.rank).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("flex flex-col items-center", brand.rank === 1 && "pt-2"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex w-full items-baseline justify-between gap-3 px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-3xl font-medium tracking-tight text-muted-foreground/70 sm:text-4xl",
					children: rank
				}), brand.rank === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase",
					children: "Número uno"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: measureRef,
				className: "logo-frame mx-auto max-w-full",
				style: { ["--logo-w"]: `${brand.widthPercent}%` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("overflow-hidden rounded-lg bg-card shadow-(--shadow-border)", brand.rank === 1 ? "rounded-xl" : "rounded-md"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: brand.logoData,
						alt: `Logo de ${brand.name}`,
						className: "logo-img aspect-square w-full object-contain"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex w-full flex-col items-center gap-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-medium tracking-tight sm:text-2xl",
						children: brand.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-sm text-muted-foreground tabular-nums",
						children: [formatEur(brand.totalCents), " acumulados"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: brand.url,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm text-foreground hover:bg-muted",
								children: ["Visitar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
							}),
							brand.xHandle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: xProfileUrl(brand.xHandle),
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-11 items-center rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
								children: ["@", brand.xHandle]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => onBoost(brand),
								children: "Impulsar"
							})
						]
					})
				]
			})
		]
	});
}
function StatsBar({ stats, numberOnePixels }) {
	const [nowTick, setNowTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNowTick((n) => n + 1), 3e4);
		return () => window.clearInterval(id);
	}, []);
	const last = stats.lastBidAt && stats.lastBidName && stats.lastBidCents != null ? `${stats.lastBidName} · ${formatEur(stats.lastBidCents)} · ${formatDistanceToNow(new Date(stats.lastBidAt), {
		locale: es,
		addSuffix: true
	})}` : "Aún no hay pujas";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border shadow-(--shadow-border) sm:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Total recaudado",
				value: formatEur(stats.totalRaisedCents)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Última puja",
				value: last
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Píxeles del #1",
				value: numberOnePixels != null ? `${formatPixels(numberOnePixels)} px` : "—"
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 font-mono text-sm text-foreground tabular-nums sm:text-[15px]",
			children: value
		})]
	});
}
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		decorative,
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function RankingBoard({ board }) {
	const [boost, setBoost] = (0, import_react.useState)(null);
	const [pixels, setPixels] = (0, import_react.useState)(null);
	const frameRef = (0, import_react.useRef)(null);
	const setMeasure = (0, import_react.useCallback)((el) => {
		frameRef.current = el;
	}, []);
	(0, import_react.useEffect)(() => {
		const el = frameRef.current;
		if (!el) {
			setPixels(null);
			return;
		}
		const update = () => {
			const w = el.clientWidth;
			const h = el.clientHeight;
			setPixels(w * h);
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [board.brands[0]?.id, board.brands[0]?.widthPercent]);
	if (board.brands.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-6 py-16 text-center shadow-(--shadow-border)",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: "Nadie ha pujado todavía"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "Sé el primero. El #1 ocupa casi toda la pantalla."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsBar, {
				stats: board.stats,
				numberOnePixels: pixels
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-14",
				children: board.brands.map((brand, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "stagger-in",
					style: { animationDelay: `${Math.min(i, 8) * 40}ms` },
					children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mb-14" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoRow, {
						brand,
						onBoost: setBoost,
						measureRef: brand.rank === 1 ? setMeasure : void 0
					})]
				}, brand.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoostDialog, {
				brand: boost,
				onClose: () => setBoost(null)
			})
		]
	});
}
function Home() {
	const initial = Route$4.useLoaderData();
	const board = useQuery({
		queryKey: ["board"],
		queryFn: () => getBoard(),
		initialData: initial,
		refetchInterval: 4e3
	}).data ?? initial;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-12 max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
								children: "Ranking público"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl",
								children: "Paga para ser visto."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg",
								children: "Sube el logo de tu producto y puja. Quien más haya pagado en total ocupa el #1 — y su marca cubre casi toda la pantalla."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/bid",
										children: "Subir un logo"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "secondary",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/fame",
										children: "Salón de la fama"
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankingBoard, { board })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				n: "01",
				t: "Sube tu logo",
				d: "Nombre, URL y marca. Sin cuentas."
			},
			{
				n: "02",
				t: "Puja desde 5 €",
				d: "Cada euro se suma al total acumulado."
			},
			{
				n: "03",
				t: "El tamaño crece",
				d: "La escala usa la raíz de lo pujado."
			},
			{
				n: "04",
				t: "El #1 lo ocupa todo",
				d: "Casi el ancho de la pantalla en el móvil."
			}
		].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-lg bg-card px-4 py-4 shadow-(--shadow-border)",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-muted-foreground tabular-nums",
					children: s.n
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-lg font-medium tracking-tight",
					children: s.t
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted-foreground",
					children: s.d
				})
			]
		}, s.n))
	});
}
//#endregion
export { Home as component };
