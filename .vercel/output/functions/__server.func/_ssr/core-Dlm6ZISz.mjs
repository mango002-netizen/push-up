//#region node_modules/.nitro/vite/services/ssr/assets/core-Dlm6ZISz.js
var MAX_CENTS = 5e6;
var AMOUNT_PRESETS = [
	500,
	1e3,
	2500,
	5e3,
	1e4,
	25e3,
	5e4,
	1e5
];
function formatEur(cents) {
	const euros = cents / 100;
	const whole = Number.isInteger(euros);
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: whole ? 0 : 2,
		maximumFractionDigits: whole ? 0 : 2
	}).format(euros);
}
function formatPixels(px) {
	return new Intl.NumberFormat("es-ES").format(Math.max(0, Math.round(px)));
}
/** Square-root scale: #1 fills ~92% of the column, the tail stays readable. */
function widthPercentForAmount(amount, maxAmount) {
	if (maxAmount <= 0 || amount <= 0) return 16;
	return 16 + Math.sqrt(amount / maxAmount) * 76;
}
function normalizeUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("URL requerida");
	const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	let url;
	try {
		url = new URL(withProto);
	} catch {
		throw new Error("URL no válida");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("La URL debe ser http o https");
	const host = url.hostname.toLowerCase().replace(/^www\./, "");
	const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
	return `${url.protocol}//${host}${path}${url.search}`;
}
function normalizeHandle(raw) {
	if (!raw) return null;
	const h = raw.trim().replace(/^@+/, "").slice(0, 32);
	if (!h) return null;
	if (!/^[A-Za-z0-9_]+$/.test(h)) throw new Error("El handle de X solo admite letras, números y _");
	return h;
}
function isSafeLogoData(data) {
	if (data.length < 32 || data.length > 22e4) return false;
	return /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(data);
}
function isSeedLogoData(data) {
	return data.startsWith("data:image/svg+xml;base64,") && data.length < 22e4;
}
function xProfileUrl(handle) {
	return `https://x.com/${handle}`;
}
function shareTweetText(input) {
	return [
		`Acabo de hacer mi logo más grande que el tuyo en LogoRank.`,
		`${input.name} es #${input.rank} · ${formatEur(input.totalCents)}`,
		input.origin
	].join("\n");
}
function shareIntentUrl(text) {
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
function isoDate(value) {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") return value;
	return (/* @__PURE__ */ new Date()).toISOString();
}
//#endregion
export { isSafeLogoData as a, normalizeHandle as c, shareTweetText as d, widthPercentForAmount as f, formatPixels as i, normalizeUrl as l, MAX_CENTS as n, isSeedLogoData as o, xProfileUrl as p, formatEur as r, isoDate as s, AMOUNT_PRESETS as t, shareIntentUrl as u };
