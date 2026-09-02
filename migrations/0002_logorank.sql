-- LogoRank public ranking. Unowned rows (no user_id): identified by URL.
create table if not exists brands (
  id            text primary key,
  name          text not null,
  url           text not null unique,
  x_handle      text,
  logo_data     text not null,
  total_cents   integer not null default 0,
  claim_token   text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists brands_total_cents_idx on brands (total_cents desc, updated_at asc);

create table if not exists bids (
  id            text primary key,
  brand_id      text not null references brands(id),
  amount_cents  integer not null,
  created_at    timestamptz not null default now()
);

create index if not exists bids_created_at_idx on bids (created_at desc);
create index if not exists bids_brand_id_idx on bids (brand_id);

create table if not exists hall_of_fame (
  id            text primary key,
  brand_id      text not null,
  name          text not null,
  logo_data     text not null,
  total_cents   integer not null,
  crowned_at    timestamptz not null default now()
);

create index if not exists hall_of_fame_crowned_idx on hall_of_fame (crowned_at desc);

create table if not exists payment_intents (
  id            text primary key,
  brand_id      text,
  name          text not null,
  url           text not null,
  x_handle      text,
  logo_data     text not null,
  amount_cents  integer not null,
  claim_token   text not null,
  status        text not null default 'pending',
  created_at    timestamptz not null default now()
);

create table if not exists board_stats (
  id                   integer primary key default 1 check (id = 1),
  last_bid_name        text,
  last_bid_cents       integer,
  last_bid_at          timestamptz,
  total_raised_cents   integer not null default 0,
  number_one_id        text
);
