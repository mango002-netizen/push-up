export const MIN_CENTS = 500;
export const MAX_CENTS = 5_000_000;
export const AMOUNT_PRESETS = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000] as const;

export const LOGO_DATA_MAX = 220_000;

export type Brand = {
  id: string;
  name: string;
  url: string;
  xHandle: string | null;
  logoData: string;
  totalCents: number;
  rank: number;
  widthPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type BoardStats = {
  lastBidName: string | null;
  lastBidCents: number | null;
  lastBidAt: string | null;
  totalRaisedCents: number;
  numberOneId: string | null;
  bidCount: number;
  brandCount: number;
};

export type Board = {
  brands: Brand[];
  stats: BoardStats;
};

export type HallEntry = {
  id: string;
  brandId: string;
  name: string;
  logoData: string;
  totalCents: number;
  crownedAt: string;
};

export type PaymentIntent = {
  id: string;
  brandId: string | null;
  name: string;
  url: string;
  xHandle: string | null;
  logoData: string;
  amountCents: number;
  status: "pending" | "paid" | "cancelled";
};

export type PayResult = {
  brandId: string;
  name: string;
  totalCents: number;
  rank: number;
  crowned: boolean;
  previousRank: number | null;
};

export function formatEur(cents: number): string {
  const euros = cents / 100;
  const whole = Number.isInteger(euros);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(euros);
}

export function formatPixels(px: number): string {
  return new Intl.NumberFormat("es-ES").format(Math.max(0, Math.round(px)));
}

/** Square-root scale: #1 fills ~92% of the column, the tail stays readable. */
export function widthPercentForAmount(amount: number, maxAmount: number): number {
  if (maxAmount <= 0 || amount <= 0) return 16;
  const ratio = Math.sqrt(amount / maxAmount);
  return 16 + ratio * 76;
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("URL requerida");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProto);
  } catch {
    throw new Error("URL no válida");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("La URL debe ser http o https");
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
  return `${url.protocol}//${host}${path}${url.search}`;
}

export function normalizeHandle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const h = raw.trim().replace(/^@+/, "").slice(0, 32);
  if (!h) return null;
  if (!/^[A-Za-z0-9_]+$/.test(h)) {
    throw new Error("El handle de X solo admite letras, números y _");
  }
  return h;
}

export function isSafeLogoData(data: string): boolean {
  if (data.length < 32 || data.length > LOGO_DATA_MAX) return false;
  return /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(data);
}

export function isSeedLogoData(data: string): boolean {
  return data.startsWith("data:image/svg+xml;base64,") && data.length < LOGO_DATA_MAX;
}

export function xProfileUrl(handle: string): string {
  return `https://x.com/${handle}`;
}

export function shareTweetText(input: {
  name: string;
  rank: number;
  totalCents: number;
  origin: string;
}): string {
  return [
    `Acabo de hacer mi logo más grande que el tuyo en LogoRank.`,
    `${input.name} es #${input.rank} · ${formatEur(input.totalCents)}`,
    input.origin,
  ].join("\n");
}

export function shareIntentUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function isoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}
