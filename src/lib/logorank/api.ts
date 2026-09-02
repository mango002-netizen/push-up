import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { ensureSeed } from "@/lib/logorank/seed";
import {
  type Board,
  type BoardStats,
  type Brand,
  type HallEntry,
  type PayResult,
  type PaymentIntent,
  MAX_CENTS,
  MIN_CENTS,
  isoDate,
  isSafeLogoData,
  isSeedLogoData,
  normalizeHandle,
  normalizeUrl,
  widthPercentForAmount,
} from "@/lib/logorank/core";

type BrandRow = {
  id: string;
  name: string;
  url: string;
  x_handle: string | null;
  logo_data: string;
  total_cents: number;
  created_at: unknown;
  updated_at: unknown;
};

type StatsRow = {
  last_bid_name: string | null;
  last_bid_cents: number | null;
  last_bid_at: unknown;
  total_raised_cents: number;
  number_one_id: string | null;
};

function mapBrand(row: BrandRow, rank: number, maxCents: number): Brand {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    xHandle: row.x_handle,
    logoData: row.logo_data,
    totalCents: Number(row.total_cents),
    rank,
    widthPercent: widthPercentForAmount(Number(row.total_cents), maxCents),
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}

async function loadBoard(): Promise<Board> {
  const sql = await getSql();
  await ensureSeed(sql);

  const rows = await sql<BrandRow>`
    select id, name, url, x_handle, logo_data, total_cents, created_at, updated_at
    from brands
    order by total_cents desc, updated_at asc
  `;
  const maxCents = Number(rows[0]?.total_cents ?? 0);
  const brands = rows.map((row, i) => mapBrand(row, i + 1, maxCents));

  const statsRows = await sql<StatsRow>`
    select last_bid_name, last_bid_cents, last_bid_at, total_raised_cents, number_one_id
    from board_stats where id = 1
  `;
  const counts = await sql<{ bids: number; brands: number }>`
    select
      (select count(*)::int from bids) as bids,
      (select count(*)::int from brands) as brands
  `;
  const s = statsRows[0];
  const stats: BoardStats = {
    lastBidName: s?.last_bid_name ?? null,
    lastBidCents: s?.last_bid_cents ?? null,
    lastBidAt: s?.last_bid_at ? isoDate(s.last_bid_at) : null,
    totalRaisedCents: Number(s?.total_raised_cents ?? 0),
    numberOneId: s?.number_one_id ?? brands[0]?.id ?? null,
    bidCount: Number(counts[0]?.bids ?? 0),
    brandCount: Number(counts[0]?.brands ?? 0),
  };

  return { brands, stats };
}

export const getBoard = createServerFn({ method: "GET" }).handler(async () => {
  return loadBoard();
});

export const getHall = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  await ensureSeed(sql);
  const rows = await sql<{
    id: string;
    brand_id: string;
    name: string;
    logo_data: string;
    total_cents: number;
    crowned_at: unknown;
  }>`
    select id, brand_id, name, logo_data, total_cents, crowned_at
    from hall_of_fame
    order by crowned_at desc
  `;
  const entries: HallEntry[] = rows.map((r) => ({
    id: r.id,
    brandId: r.brand_id,
    name: r.name,
    logoData: r.logo_data,
    totalCents: Number(r.total_cents),
    crownedAt: isoDate(r.crowned_at),
  }));
  return { entries };
});

export const getBrand = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const board = await loadBoard();
    const brand = board.brands.find((b) => b.id === data.id);
    if (!brand) throw new Error("Marca no encontrada");
    return { brand, stats: board.stats };
  });

type CreateIntentInput = {
  brandId?: string;
  name?: string;
  url?: string;
  xHandle?: string;
  logoData?: string;
  amountCents: number;
};

function assertAmount(cents: number): void {
  if (!Number.isInteger(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
    throw new Error(`La puja debe estar entre ${MIN_CENTS / 100} € y ${MAX_CENTS / 100} €`);
  }
}

export const createIntent = createServerFn({ method: "POST" })
  .validator((d: CreateIntentInput) => d)
  .handler(async ({ data }) => {
    assertAmount(data.amountCents);
    const sql = await getSql();
    await ensureSeed(sql);

    let name: string;
    let url: string;
    let xHandle: string | null;
    let logoData: string;
    let brandId: string | null = null;
    let claimToken: string = crypto.randomUUID();

    if (data.brandId) {
      const existing = await sql<BrandRow>`
        select id, name, url, x_handle, logo_data, total_cents, created_at, updated_at
        from brands where id = ${data.brandId} limit 1
      `;
      const row = existing[0];
      if (!row) throw new Error("Ese logo no está en el ranking");
      name = row.name;
      url = row.url;
      xHandle = row.x_handle;
      logoData = row.logo_data;
      brandId = row.id;
    } else {
      const rawName = (data.name ?? "").trim();
      if (rawName.length < 1 || rawName.length > 80) {
        throw new Error("El nombre debe tener entre 1 y 80 caracteres");
      }
      name = rawName;
      url = normalizeUrl(data.url ?? "");
      xHandle = normalizeHandle(data.xHandle);
      const rawLogo = data.logoData ?? "";
      if (!isSafeLogoData(rawLogo)) {
        throw new Error("Sube un logo PNG, JPG o WEBP (máx. ~200 KB)");
      }
      logoData = rawLogo.replace(/\s/g, "");

      const dup = await sql<{ id: string; claim_token: string }>`
        select id, claim_token from brands where url = ${url} limit 1
      `;
      if (dup[0]) {
        brandId = dup[0].id;
        claimToken = dup[0].claim_token;
      }
    }

    const id = crypto.randomUUID();
    await sql`
      insert into payment_intents
        (id, brand_id, name, url, x_handle, logo_data, amount_cents, claim_token, status)
      values
        (${id}, ${brandId}, ${name}, ${url}, ${xHandle}, ${logoData}, ${data.amountCents}, ${claimToken}, 'pending')
    `;

    const intent: PaymentIntent = {
      id,
      brandId,
      name,
      url,
      xHandle,
      logoData,
      amountCents: data.amountCents,
      status: "pending",
    };
    return { intent };
  });

export const getIntent = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      brand_id: string | null;
      name: string;
      url: string;
      x_handle: string | null;
      logo_data: string;
      amount_cents: number;
      status: string;
    }>`
      select id, brand_id, name, url, x_handle, logo_data, amount_cents, status
      from payment_intents where id = ${data.id} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Pago no encontrado");
    const intent: PaymentIntent = {
      id: row.id,
      brandId: row.brand_id,
      name: row.name,
      url: row.url,
      xHandle: row.x_handle,
      logoData: row.logo_data,
      amountCents: Number(row.amount_cents),
      status: row.status as PaymentIntent["status"],
    };
    return { intent };
  });

export const confirmPay = createServerFn({ method: "POST" })
  .validator((d: { intentId: string }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureSeed(sql);

    const locked = await sql<{
      id: string;
      brand_id: string | null;
      name: string;
      url: string;
      x_handle: string | null;
      logo_data: string;
      amount_cents: number;
      claim_token: string;
      status: string;
    }>`
      update payment_intents
      set status = 'paid'
      where id = ${data.intentId} and status = 'pending'
      returning id, brand_id, name, url, x_handle, logo_data, amount_cents, claim_token, status
    `;
    const intent = locked[0];
    if (!intent) {
      const existing = await sql<{ status: string; brand_id: string | null }>`
        select status, brand_id from payment_intents where id = ${data.intentId} limit 1
      `;
      if (existing[0]?.status === "paid" && existing[0].brand_id) {
        const board = await loadBoard();
        const brand = board.brands.find((b) => b.id === existing[0].brand_id);
        if (brand) {
          const result: PayResult = {
            brandId: brand.id,
            name: brand.name,
            totalCents: brand.totalCents,
            rank: brand.rank,
            crowned: brand.rank === 1,
            previousRank: brand.rank,
          };
          return result;
        }
      }
      throw new Error("Esta puja ya no se puede confirmar");
    }

    const amount = Number(intent.amount_cents);
    const leader = await sql<{ id: string }>`
      select id from brands order by total_cents desc, updated_at asc limit 1
    `;
    const previousNumberOne = leader[0]?.id ?? null;

    let previousRank: number | null = null;
    if (intent.brand_id) {
      const ranked = await sql<{ id: string }>`
        select id from brands order by total_cents desc, updated_at asc
      `;
      const idx = ranked.findIndex((r) => r.id === intent.brand_id);
      previousRank = idx >= 0 ? idx + 1 : null;
    }

    let brandId = intent.brand_id;
    if (brandId) {
      await sql`
        update brands
        set total_cents = total_cents + ${amount}, updated_at = now()
        where id = ${brandId}
      `;
    } else {
      const dup = await sql<{ id: string }>`
        select id from brands where url = ${intent.url} limit 1
      `;
      if (dup[0]) {
        brandId = dup[0].id;
        await sql`
          update brands
          set total_cents = total_cents + ${amount}, updated_at = now()
          where id = ${brandId}
        `;
      } else {
        const logoOk = isSafeLogoData(intent.logo_data) || isSeedLogoData(intent.logo_data);
        if (!logoOk) throw new Error("Logo no válido");
        brandId = crypto.randomUUID();
        await sql`
          insert into brands (id, name, url, x_handle, logo_data, total_cents, claim_token)
          values (
            ${brandId}, ${intent.name}, ${intent.url}, ${intent.x_handle},
            ${intent.logo_data}, ${amount}, ${intent.claim_token}
          )
        `;
      }
    }

    await sql`
      update payment_intents set brand_id = ${brandId} where id = ${intent.id}
    `;

    const bidId = crypto.randomUUID();
    await sql`
      insert into bids (id, brand_id, amount_cents)
      values (${bidId}, ${brandId}, ${amount})
    `;

    await sql`
      insert into board_stats (id, last_bid_name, last_bid_cents, last_bid_at, total_raised_cents, number_one_id)
      values (1, ${intent.name}, ${amount}, now(), ${amount}, ${brandId})
      on conflict (id) do update set
        last_bid_name = excluded.last_bid_name,
        last_bid_cents = excluded.last_bid_cents,
        last_bid_at = excluded.last_bid_at,
        total_raised_cents = board_stats.total_raised_cents + excluded.total_raised_cents
    `;

    const board = await loadBoard();
    const brand = board.brands.find((b) => b.id === brandId);
    if (!brand) throw new Error("No se pudo publicar la puja");

    const crowned = brand.rank === 1 && previousNumberOne !== brand.id;
    if (crowned) {
      await sql`
        insert into hall_of_fame (id, brand_id, name, logo_data, total_cents)
        values (${crypto.randomUUID()}, ${brand.id}, ${brand.name}, ${brand.logoData}, ${brand.totalCents})
      `;
    }
    await sql`
      update board_stats set number_one_id = ${board.brands[0]?.id ?? null} where id = 1
    `;

    const result: PayResult = {
      brandId: brand.id,
      name: brand.name,
      totalCents: brand.totalCents,
      rank: brand.rank,
      crowned,
      previousRank,
    };
    return result;
  });
