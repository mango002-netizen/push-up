import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as isSafeLogoData, c as normalizeHandle, f as widthPercentForAmount, l as normalizeUrl, n as MAX_CENTS, o as isSeedLogoData, s as isoDate } from "./core-Dlm6ZISz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D2Fuk2q5.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_logorank_default = "-- LogoRank public ranking. Unowned rows (no user_id): identified by URL.\ncreate table if not exists brands (\n  id            text primary key,\n  name          text not null,\n  url           text not null unique,\n  x_handle      text,\n  logo_data     text not null,\n  total_cents   integer not null default 0,\n  claim_token   text not null,\n  created_at    timestamptz not null default now(),\n  updated_at    timestamptz not null default now()\n);\n\ncreate index if not exists brands_total_cents_idx on brands (total_cents desc, updated_at asc);\n\ncreate table if not exists bids (\n  id            text primary key,\n  brand_id      text not null references brands(id),\n  amount_cents  integer not null,\n  created_at    timestamptz not null default now()\n);\n\ncreate index if not exists bids_created_at_idx on bids (created_at desc);\ncreate index if not exists bids_brand_id_idx on bids (brand_id);\n\ncreate table if not exists hall_of_fame (\n  id            text primary key,\n  brand_id      text not null,\n  name          text not null,\n  logo_data     text not null,\n  total_cents   integer not null,\n  crowned_at    timestamptz not null default now()\n);\n\ncreate index if not exists hall_of_fame_crowned_idx on hall_of_fame (crowned_at desc);\n\ncreate table if not exists payment_intents (\n  id            text primary key,\n  brand_id      text,\n  name          text not null,\n  url           text not null,\n  x_handle      text,\n  logo_data     text not null,\n  amount_cents  integer not null,\n  claim_token   text not null,\n  status        text not null default 'pending',\n  created_at    timestamptz not null default now()\n);\n\ncreate table if not exists board_stats (\n  id                   integer primary key default 1 check (id = 1),\n  last_bid_name        text,\n  last_bid_cents       integer,\n  last_bid_at          timestamptz,\n  total_raised_cents   integer not null default 0,\n  number_one_id        text\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_logorank.sql": _0002_logorank_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var PAPER = "#f3f1ec";
var INK = "#141413";
function uri(svg) {
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
function card(bg, inner) {
	return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="84" fill="${bg}"/>${inner}</svg>`);
}
var LOGOS = {
	northbeam: card(INK, `<circle cx="256" cy="256" r="118" fill="none" stroke="${PAPER}" stroke-width="28"/><rect x="242" y="120" width="28" height="272" rx="8" fill="${PAPER}"/>`),
	orion: card(INK, `<path d="M256 86 L292 214 L428 214 L318 292 L358 420 L256 338 L154 420 L194 292 L84 214 L220 214 Z" fill="${PAPER}"/>`),
	fold: card(PAPER, `<path d="M128 128 H300 L384 212 V384 H128 Z" fill="${INK}"/><path d="M300 128 V212 H384" fill="none" stroke="${PAPER}" stroke-width="18" stroke-linejoin="miter"/>`),
	sable: card(INK, `<circle cx="256" cy="256" r="150" fill="none" stroke="${PAPER}" stroke-width="22"/><circle cx="256" cy="256" r="92" fill="none" stroke="${PAPER}" stroke-width="22"/><circle cx="256" cy="256" r="36" fill="${PAPER}"/>`),
	kindling: card(INK, `<rect x="118" y="220" width="44" height="160" rx="8" fill="${PAPER}"/><rect x="178" y="150" width="44" height="230" rx="8" fill="${PAPER}"/><rect x="238" y="96" width="44" height="284" rx="8" fill="${PAPER}"/><rect x="298" y="176" width="44" height="204" rx="8" fill="${PAPER}"/><rect x="358" y="248" width="44" height="132" rx="8" fill="${PAPER}"/>`),
	driftline: card(PAPER, `<rect x="72" y="236" width="368" height="40" rx="8" fill="${INK}" transform="rotate(-18 256 256)"/>`),
	hearth: card(INK, `<rect x="128" y="128" width="256" height="256" rx="36" fill="none" stroke="${PAPER}" stroke-width="28"/><rect x="196" y="210" width="120" height="120" rx="18" fill="${PAPER}"/>`),
	mono: card(PAPER, `<path d="M128 360 V168 L256 288 L384 168 V360" fill="none" stroke="${INK}" stroke-width="36" stroke-linejoin="miter" stroke-linecap="square"/>`),
	quarry: card(INK, `<rect x="118" y="118" width="120" height="120" rx="16" fill="${PAPER}"/><rect x="274" y="118" width="120" height="120" rx="16" fill="${PAPER}" opacity="0.45"/><rect x="118" y="274" width="120" height="120" rx="16" fill="${PAPER}" opacity="0.45"/><rect x="274" y="274" width="120" height="120" rx="16" fill="${PAPER}"/>`)
};
var BRANDS = [
	{
		id: "seed-northbeam",
		name: "Northbeam",
		url: "https://northbeam.studio",
		xHandle: "northbeam",
		logo: LOGOS.northbeam,
		totalCents: 248e3
	},
	{
		id: "seed-orion",
		name: "Orion Type",
		url: "https://oriontype.com",
		xHandle: "oriontype",
		logo: LOGOS.orion,
		totalCents: 21e4
	},
	{
		id: "seed-fold",
		name: "Fold Paper",
		url: "https://fold.paper",
		xHandle: "foldpaper",
		logo: LOGOS.fold,
		totalCents: 118e3
	},
	{
		id: "seed-sable",
		name: "Sable Audio",
		url: "https://sable.audio",
		xHandle: "sableaudio",
		logo: LOGOS.sable,
		totalCents: 86e3
	},
	{
		id: "seed-kindling",
		name: "Kindling",
		url: "https://kindling.co",
		xHandle: "kindlingco",
		logo: LOGOS.kindling,
		totalCents: 42e3
	},
	{
		id: "seed-driftline",
		name: "Driftline",
		url: "https://driftline.io",
		xHandle: "driftline",
		logo: LOGOS.driftline,
		totalCents: 27500
	},
	{
		id: "seed-hearth",
		name: "Hearth",
		url: "https://hearth.supply",
		xHandle: "hearthsupply",
		logo: LOGOS.hearth,
		totalCents: 15500
	},
	{
		id: "seed-mono",
		name: "Mono Tools",
		url: "https://mono.tools",
		xHandle: "monotools",
		logo: LOGOS.mono,
		totalCents: 9e3
	},
	{
		id: "seed-quarry",
		name: "Quarry",
		url: "https://quarry.site",
		xHandle: "quarrysite",
		logo: LOGOS.quarry,
		totalCents: 4500
	}
];
async function ensureSeed(sql) {
	if (((await sql`select count(*)::int as c from brands`)[0]?.c ?? 0) > 0) return;
	const now = Date.now();
	const totalRaised = BRANDS.reduce((s, b) => s + b.totalCents, 0);
	for (const [i, b] of BRANDS.entries()) {
		const created = (/* @__PURE__ */ new Date(now - (BRANDS.length - i) * 36e5)).toISOString();
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
	const lastAt = (/* @__PURE__ */ new Date(now - 48e4)).toISOString();
	await sql`
    insert into bids (id, brand_id, amount_cents, created_at)
    values ('bid-fold-bump', 'seed-fold', 4000, ${lastAt})
  `;
	await sql`update brands set total_cents = total_cents + 4000, updated_at = ${lastAt} where id = 'seed-fold'`;
	await sql`
    insert into hall_of_fame (id, brand_id, name, logo_data, total_cents, crowned_at)
    values (
      'fame-orion', 'seed-orion', 'Orion Type', ${LOGOS.orion}, 210000,
      ${(/* @__PURE__ */ new Date(now - 504e5)).toISOString()}
    )
  `;
	await sql`
    insert into hall_of_fame (id, brand_id, name, logo_data, total_cents, crowned_at)
    values (
      'fame-northbeam', 'seed-northbeam', 'Northbeam', ${LOGOS.northbeam}, 248000,
      ${(/* @__PURE__ */ new Date(now - 18e6)).toISOString()}
    )
  `;
	await sql`
    insert into board_stats (id, last_bid_name, last_bid_cents, last_bid_at, total_raised_cents, number_one_id)
    values (1, 'Fold Paper', 4000, ${lastAt}, ${totalRaised + 4e3}, 'seed-northbeam')
    on conflict (id) do nothing
  `;
}
function mapBrand(row, rank, maxCents) {
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
		updatedAt: isoDate(row.updated_at)
	};
}
async function loadBoard() {
	const sql = await getSql();
	await ensureSeed(sql);
	const rows = await sql`
    select id, name, url, x_handle, logo_data, total_cents, created_at, updated_at
    from brands
    order by total_cents desc, updated_at asc
  `;
	const maxCents = Number(rows[0]?.total_cents ?? 0);
	const brands = rows.map((row, i) => mapBrand(row, i + 1, maxCents));
	const statsRows = await sql`
    select last_bid_name, last_bid_cents, last_bid_at, total_raised_cents, number_one_id
    from board_stats where id = 1
  `;
	const counts = await sql`
    select
      (select count(*)::int from bids) as bids,
      (select count(*)::int from brands) as brands
  `;
	const s = statsRows[0];
	return {
		brands,
		stats: {
			lastBidName: s?.last_bid_name ?? null,
			lastBidCents: s?.last_bid_cents ?? null,
			lastBidAt: s?.last_bid_at ? isoDate(s.last_bid_at) : null,
			totalRaisedCents: Number(s?.total_raised_cents ?? 0),
			numberOneId: s?.number_one_id ?? brands[0]?.id ?? null,
			bidCount: Number(counts[0]?.bids ?? 0),
			brandCount: Number(counts[0]?.brands ?? 0)
		}
	};
}
var getBoard_createServerFn_handler = createServerRpc({
	id: "3b7eee93a4e69e29a61c0b6c91b331a3ef8d6d5e948a80574cd49e6ab1a6743b",
	name: "getBoard",
	filename: "src/lib/logorank/api.ts"
}, (opts) => getBoard.__executeServer(opts));
var getBoard = createServerFn({ method: "GET" }).handler(getBoard_createServerFn_handler, async () => {
	return loadBoard();
});
var getHall_createServerFn_handler = createServerRpc({
	id: "f99e897e2f1a11e595879b888e035b8cff95d3293348ca99959c58ba21ecfe50",
	name: "getHall",
	filename: "src/lib/logorank/api.ts"
}, (opts) => getHall.__executeServer(opts));
var getHall = createServerFn({ method: "GET" }).handler(getHall_createServerFn_handler, async () => {
	const sql = await getSql();
	await ensureSeed(sql);
	return { entries: (await sql`
    select id, brand_id, name, logo_data, total_cents, crowned_at
    from hall_of_fame
    order by crowned_at desc
  `).map((r) => ({
		id: r.id,
		brandId: r.brand_id,
		name: r.name,
		logoData: r.logo_data,
		totalCents: Number(r.total_cents),
		crownedAt: isoDate(r.crowned_at)
	})) };
});
var getBrand_createServerFn_handler = createServerRpc({
	id: "d6efc0ddda07b986c9691db394df4e0b3a30ca9fa9a4a2f89c1617905d59179e",
	name: "getBrand",
	filename: "src/lib/logorank/api.ts"
}, (opts) => getBrand.__executeServer(opts));
var getBrand = createServerFn({ method: "GET" }).validator((d) => d).handler(getBrand_createServerFn_handler, async ({ data }) => {
	const board = await loadBoard();
	const brand = board.brands.find((b) => b.id === data.id);
	if (!brand) throw new Error("Marca no encontrada");
	return {
		brand,
		stats: board.stats
	};
});
function assertAmount(cents) {
	if (!Number.isInteger(cents) || cents < 500 || cents > 5e6) throw new Error(`La puja debe estar entre 5 € y ${MAX_CENTS / 100} €`);
}
var createIntent_createServerFn_handler = createServerRpc({
	id: "96392e9864ff476ae897b97d23a2f627a563f714a51061469015b03996be45fd",
	name: "createIntent",
	filename: "src/lib/logorank/api.ts"
}, (opts) => createIntent.__executeServer(opts));
var createIntent = createServerFn({ method: "POST" }).validator((d) => d).handler(createIntent_createServerFn_handler, async ({ data }) => {
	assertAmount(data.amountCents);
	const sql = await getSql();
	await ensureSeed(sql);
	let name;
	let url;
	let xHandle;
	let logoData;
	let brandId = null;
	let claimToken = crypto.randomUUID();
	if (data.brandId) {
		const row = (await sql`
        select id, name, url, x_handle, logo_data, total_cents, created_at, updated_at
        from brands where id = ${data.brandId} limit 1
      `)[0];
		if (!row) throw new Error("Ese logo no está en el ranking");
		name = row.name;
		url = row.url;
		xHandle = row.x_handle;
		logoData = row.logo_data;
		brandId = row.id;
	} else {
		const rawName = (data.name ?? "").trim();
		if (rawName.length < 1 || rawName.length > 80) throw new Error("El nombre debe tener entre 1 y 80 caracteres");
		name = rawName;
		url = normalizeUrl(data.url ?? "");
		xHandle = normalizeHandle(data.xHandle);
		const rawLogo = data.logoData ?? "";
		if (!isSafeLogoData(rawLogo)) throw new Error("Sube un logo PNG, JPG o WEBP (máx. ~200 KB)");
		logoData = rawLogo.replace(/\s/g, "");
		const dup = await sql`
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
	return { intent: {
		id,
		brandId,
		name,
		url,
		xHandle,
		logoData,
		amountCents: data.amountCents,
		status: "pending"
	} };
});
var getIntent_createServerFn_handler = createServerRpc({
	id: "a708ae0d3631db7ed5e84707675856a974396006850cead03b08225d79c01196",
	name: "getIntent",
	filename: "src/lib/logorank/api.ts"
}, (opts) => getIntent.__executeServer(opts));
var getIntent = createServerFn({ method: "GET" }).validator((d) => d).handler(getIntent_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql())`
      select id, brand_id, name, url, x_handle, logo_data, amount_cents, status
      from payment_intents where id = ${data.id} limit 1
    `)[0];
	if (!row) throw new Error("Pago no encontrado");
	return { intent: {
		id: row.id,
		brandId: row.brand_id,
		name: row.name,
		url: row.url,
		xHandle: row.x_handle,
		logoData: row.logo_data,
		amountCents: Number(row.amount_cents),
		status: row.status
	} };
});
var confirmPay_createServerFn_handler = createServerRpc({
	id: "f734fd279e0e5ce2461dc9853f0f84f9e6fc88143282caf7241d2d6202ef436a",
	name: "confirmPay",
	filename: "src/lib/logorank/api.ts"
}, (opts) => confirmPay.__executeServer(opts));
var confirmPay = createServerFn({ method: "POST" }).validator((d) => d).handler(confirmPay_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureSeed(sql);
	const intent = (await sql`
      update payment_intents
      set status = 'paid'
      where id = ${data.intentId} and status = 'pending'
      returning id, brand_id, name, url, x_handle, logo_data, amount_cents, claim_token, status
    `)[0];
	if (!intent) {
		const existing = await sql`
        select status, brand_id from payment_intents where id = ${data.intentId} limit 1
      `;
		if (existing[0]?.status === "paid" && existing[0].brand_id) {
			const brand = (await loadBoard()).brands.find((b) => b.id === existing[0].brand_id);
			if (brand) return {
				brandId: brand.id,
				name: brand.name,
				totalCents: brand.totalCents,
				rank: brand.rank,
				crowned: brand.rank === 1,
				previousRank: brand.rank
			};
		}
		throw new Error("Esta puja ya no se puede confirmar");
	}
	const amount = Number(intent.amount_cents);
	const previousNumberOne = (await sql`
      select id from brands order by total_cents desc, updated_at asc limit 1
    `)[0]?.id ?? null;
	let previousRank = null;
	if (intent.brand_id) {
		const idx = (await sql`
        select id from brands order by total_cents desc, updated_at asc
      `).findIndex((r) => r.id === intent.brand_id);
		previousRank = idx >= 0 ? idx + 1 : null;
	}
	let brandId = intent.brand_id;
	if (brandId) await sql`
        update brands
        set total_cents = total_cents + ${amount}, updated_at = now()
        where id = ${brandId}
      `;
	else {
		const dup = await sql`
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
			if (!(isSafeLogoData(intent.logo_data) || isSeedLogoData(intent.logo_data))) throw new Error("Logo no válido");
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
	await sql`
      insert into bids (id, brand_id, amount_cents)
      values (${crypto.randomUUID()}, ${brandId}, ${amount})
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
	if (crowned) await sql`
        insert into hall_of_fame (id, brand_id, name, logo_data, total_cents)
        values (${crypto.randomUUID()}, ${brand.id}, ${brand.name}, ${brand.logoData}, ${brand.totalCents})
      `;
	await sql`
      update board_stats set number_one_id = ${board.brands[0]?.id ?? null} where id = 1
    `;
	return {
		brandId: brand.id,
		name: brand.name,
		totalCents: brand.totalCents,
		rank: brand.rank,
		crowned,
		previousRank
	};
});
//#endregion
export { confirmPay_createServerFn_handler, createIntent_createServerFn_handler, getBoard_createServerFn_handler, getBrand_createServerFn_handler, getHall_createServerFn_handler, getIntent_createServerFn_handler };
