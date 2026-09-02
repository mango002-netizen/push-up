import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as createIntent } from "./api-DW8tokSB.mjs";
import { a as ImagePlus } from "../_libs/lucide-react.mjs";
import { n as SiteFooter, r as SiteHeader, t as Button } from "./site-footer-Xl2cLnw5.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Label, r as Input, t as AmountPicker } from "./boost-dialog-CqC9dKFM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bid-DQ7amaG-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_EDGE = 512;
async function resizeLogoFile(file) {
	if (!file.type.startsWith("image/")) throw new Error("El archivo tiene que ser una imagen");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No se pudo leer el logo");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, width, height);
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	let quality = .9;
	let data = canvas.toDataURL("image/jpeg", quality);
	while (data.length > 22e4 && quality > .45) {
		quality -= .1;
		data = canvas.toDataURL("image/jpeg", quality);
	}
	if (data.length > 22e4) throw new Error("El logo sigue siendo demasiado pesado. Prueba una imagen más simple.");
	return data;
}
function BidForm() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("");
	const [xHandle, setXHandle] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)(null);
	const [cents, setCents] = (0, import_react.useState)(2500);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFile(file) {
		if (!file) return;
		try {
			const data = await resizeLogoFile(file);
			setLogo(data);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "No se pudo leer el logo");
		}
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!logo) {
			toast.error("Sube un logo");
			return;
		}
		setBusy(true);
		try {
			const { intent } = await createIntent({ data: {
				name,
				url,
				xHandle: xHandle || void 0,
				logoData: logo,
				amountCents: cents
			} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "product",
					children: "Nombre del producto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "product",
					required: true,
					maxLength: 80,
					placeholder: "Northbeam",
					value: name,
					onChange: (e) => setName(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "url",
						children: "URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "url",
						required: true,
						inputMode: "url",
						placeholder: "https://tu-producto.com",
						value: url,
						onChange: (e) => setUrl(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Si la URL ya está en el ranking, tu puja se suma al logo existente."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "x",
					children: "Handle de X (opcional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "x",
					placeholder: "@tumarca",
					value: xHandle,
					onChange: (e) => setXHandle(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Logo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-card px-4 py-6 text-center shadow-(--shadow-border) transition-[box-shadow] duration-150 hover:shadow-(--shadow-border-hover)",
					children: [logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo,
						alt: "Vista previa del logo",
						className: "logo-img size-24 rounded-md object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "PNG, JPG o WEBP. Se recorta a 512 px."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/png,image/jpeg,image/webp,image/svg+xml",
						className: "sr-only",
						onChange: (e) => onFile(e.target.files?.[0])
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmountPicker, {
				cents,
				onChange: setCents
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "w-full",
				disabled: busy,
				children: busy ? "Preparando…" : "Continuar al pago"
			})
		]
	});
}
function BidPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
						children: "Nueva puja"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-medium tracking-tight",
						children: "Hazte más grande."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "El ranking es público. Identificamos tu marca por la URL — puedes volver a pujar cuando quieras."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BidForm, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 text-sm text-muted-foreground",
						children: [
							"¿Ya estás en el tablero?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-foreground underline-offset-4 hover:underline",
								children: "Impúlsate desde el ranking"
							}),
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { BidPage as component };
