import type { Sql } from "@/lib/db";

const PAPER = "#f3f1ec";
const INK = "#141413";

function uri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function card(bg: string, inner: string): string {
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="84" fill="${bg}"/>${inner}</svg>`,
  );
}

const LOGOS = {
  northbeam: card(
    INK,
    `<circle cx="256" cy="256" r="118" fill="none" stroke="${PAPER}" stroke-width="28"/><rect x="242" y="120" width="28" height="272" rx="8" fill="${PAPER}"/>`,
  ),
  orion: card(
    INK,
    `<path d="M256 86 L292 214 L428 214 L318 292 L358 420 L256 338 L154 420 L194 292 L84 214 L220 214 Z" fill="${PAPER}"/>`,
  ),
  fold: card(
    PAPER,
    `<path d="M128 128 H300 L384 212 V384 H128 Z" fill="${INK}"/><path d="M300 128 V212 H384" fill="none" stroke="${PAPER}" stroke-width="18" stroke-linejoin="miter"/>`,
  ),
  sable: card(
    INK,
    `<circle cx="256" cy="256" r="150" fill="none" stroke="${PAPER}" stroke-width="22"/><circle cx="256" cy="256" r="92" fill="none" stroke="${PAPER}" stroke-width="22"/><circle cx="256" cy="256" r="36" fill="${PAPER}"/>`,
  ),
  kindling: card(
    INK,
    `<rect x="118" y="220" width="44" height="160" rx="8" fill="${PAPER}"/><rect x="178" y="150" width="44" height="230" rx="8" fill="${PAPER}"/><rect x="238" y="96" width="44" height="284" rx="8" fill="${PAPER}"/><rect x="298" y="176" width="44" height="204" rx="8" fill="${PAPER}"/><rect x="358" y="248" width="44" height="132" rx="8" fill="${PAPER}"/>`,
  ),
  driftline: card(
    PAPER,
    `<rect x="72" y="236" width="368" height="40" rx="8" fill="${INK}" transform="rotate(-18 256 256)"/>`,
  ),
  hearth: card(
    INK,
    `<rect x="128" y="128" width="256" height="256" rx="36" fill="none" stroke="${PAPER}" stroke-width="28"/><rect x="196" y="210" width="120" height="120" rx="18" fill="${PAPER}"/>`,
  ),
  mono: card(
    PAPER,
    `<path d="M128 360 V168 L256 288 L384 168 V360" fill="none" stroke="${INK}" stroke-width="36" stroke-linejoin="miter" stroke-linecap="square"/>`,
  ),
  quarry: card(
    INK,
    `<rect x="118" y="118" width="120" height="120" rx="16" fill="${PAPER}"/><rect x="274" y="118" width="120" height="120" rx="16" fill="${PAPER}" opacity="0.45"/><rect x="118" y="274" width="120" height="120" rx="16" fill="${PAPER}" opacity="0.45"/><rect x="274" y="274" width="120" height="120" rx="16" fill="${PAPER}"/>`,
  ),
};

type SeedBrand = {
  id: string;
  name: string;
  url: string;
  xHandle: string;
  logo: string;
  totalCents: number;
};

const BRANDS: SeedBrand[] = [
  {
    id: "seed-northbeam",
    name: "Northbeam",
    url: "https://northbeam.studio",
    xHandle: "northbeam",
    logo: LOGOS.northbeam,
    totalCents: 248000,
  },
  {
    id: "seed-orion",
    name: "Orion Type",
    url: "https://oriontype.com",
    xHandle: "oriontype",
    logo: LOGOS.orion,
    totalCents: 210000,
  },
  {
    id: "seed-fold",
    name: "Fold Paper",
    url: "https://fold.paper",
    xHandle: "foldpaper",
    logo: LOGOS.fold,
    totalCents: 118000,
  },
  {
    id: "seed-sable",
    name: "Sable Audio",
    url: "https://sable.audio",
    xHandle: "sableaudio",
    logo: LOGOS.sable,
    totalCents: 86000,
  },
  {
    id: "seed-kindling",
    name: "Kindling",
    url: "https://kindling.co",
    xHandle: "kindlingco",
    logo: LOGOS.kindling,
    totalCents: 42000,
  },
  {
    id: "seed-driftline",
    name: "Driftline",
    url: "https://driftline.io",
    xHandle: "driftline",
    logo: LOGOS.driftline,
    totalCents: 27500,
  },
  {
    id: "seed-hearth",
    name: "Hearth",
    url: "https://hearth.supply",
    xHandle: "hearthsupply",
    logo: LOGOS.hearth,
    totalCents: 15500,
  },
  {
    id: "seed-mono",
    name: "Mono Tools",
    url: "https://mono.tools",
    xHandle: "monotools",
    logo: LOGOS.mono,
    totalCents: 9000,
  },
  {
    id: "seed-quarry",
    name: "Quarry",
    url: "https://quarry.site",
    xHandle: "quarrysite",
    logo: LOGOS.quarry,
    totalCents: 4500,
  },
];

export async function ensureSeed(sql: Sql): Promise<void> {
  const rows = await sql<{ c: number }>`select count(*)::int as c from brands`;
  if ((rows[0]?.c ?? 0) > 0) return;

  const now = Date.now();
  const totalRaised = BRANDS.reduce((s, b) => s + b.totalCents, 0);

  for (const [i, b] of BRANDS.entries()) {
    const created = new Date(now - (BRANDS.length - i) * 36e5).toISOString();
    await sql`
      insert into brands (id, name, url, x_handle, logo_data, total_cents, claim_token, created_at, updated_at)
      values (
        ${b.id}, ${b.name}, ${b.url}, ${b.xHandle}, ${b.logo}, ${b.totalCents},
        ${`seed-token-${b.id}`}, ${created}, ${created}
      )
    `;
    await sql`
      insert into bids (id, brand_id, amount_cents, created_at)
      values (${`bid-${b.id}`}, ${b.id}, ${b.totalCents}, ${created})
    `;
  }

  // Last bid is a small top-up on Fold, more recent.
  const lastAt = new Date(now - 8 * 60 * 1000).toISOString();
  await sql`
    insert into bids (id, brand_id, amount_cents, created_at)
    values ('bid-fold-bump', 'seed-fold', 4000, ${lastAt})
  `;
  await sql`update brands set total_cents = total_cents + 4000, updated_at = ${lastAt} where id = 'seed-fold'`;

  await sql`
    insert into hall_of_fame (id, brand_id, name, logo_data, total_cents, crowned_at)
    values (
      'fame-orion', 'seed-orion', 'Orion Type', ${LOGOS.orion}, 210000,
      ${new Date(now - 14 * 36e5).toISOString()}
    )
  `;
  await sql`
    insert into hall_of_fame (id, brand_id, name, logo_data, total_cents, crowned_at)
    values (
      'fame-northbeam', 'seed-northbeam', 'Northbeam', ${LOGOS.northbeam}, 248000,
      ${new Date(now - 5 * 36e5).toISOString()}
    )
  `;

  await sql`
    insert into board_stats (id, last_bid_name, last_bid_cents, last_bid_at, total_raised_cents, number_one_id)
    values (1, 'Fold Paper', 4000, ${lastAt}, ${totalRaised + 4000}, 'seed-northbeam')
    on conflict (id) do nothing
  `;
}
