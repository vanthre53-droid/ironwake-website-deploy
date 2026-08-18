-- 20260818090000_webhook_dedup_and_meta_deletion.sql
--
-- ponytail: close the schema drift identified in the WhatsApp audit.
-- The webhook_dedup + meta_deletion_requests tables are written by the
-- production handlers but never declared in a migration. A fresh DB
-- clone 500s the WA + Meta data-deletion routes on every request.
--
-- RLS: both tables are owner-only via service role. There is no public
-- reader. The unique constraints are the dedup signal — handlers
-- `insert ... on conflict do nothing` and detect 23505 to short-circuit.

create table if not exists public.webhook_dedup (
  dedup_key     text primary key,
  source        text not null,
  first_seen_at timestamptz not null default now()
);

create index if not exists webhook_dedup_source_first_seen_idx
  on public.webhook_dedup (source, first_seen_at desc);

create table if not exists public.meta_deletion_requests (
  confirmation_code text primary key,
  signed_request    text not null,
  status            text not null default 'queued'
                    check (status in ('queued', 'reviewed', 'done')),
  created_at        timestamptz not null default now()
);

-- ponytail: opt-out sink. Meta requires businesses to honour STOP /
-- STOPALL / UNSUBSCRIBE / CANCEL / END / QUIT within one message and
-- never message the user again. We log the keyword + sender so the
-- owner dashboard and any outbound code can gate them.
create table if not exists public.meta_opt_outs (
  id         bigserial primary key,
  wa_from    text not null,
  keyword    text not null,
  source     text not null default 'meta_whatsapp',
  created_at timestamptz not null default now()
);

create index if not exists meta_opt_outs_wa_from_idx
  on public.meta_opt_outs (wa_from, created_at desc);

-- ponytail: enable RLS on all three tables. Even though service_role
-- bypasses RLS, the schema audit (`scripts/supabase-audit.mjs`) requires
-- it and a future least-privilege policy becomes possible without a
-- schema migration. The handlers still use service role, so the
-- insert paths are unaffected.
alter table public.webhook_dedup          enable row level security;
alter table public.meta_deletion_requests enable row level security;
alter table public.meta_opt_outs          enable row level security;

-- ponytail: refuse everything for anon/authenticated. The handlers
-- authenticate via the service-role key (which bypasses RLS), so this
-- is purely a defence-in-depth posture — the public PostgREST endpoint
-- never exposes these tables.
drop policy if exists "deny all" on public.webhook_dedup;
create policy "deny all" on public.webhook_dedup
  for all to anon, authenticated using (false) with check (false);
drop policy if exists "deny all" on public.meta_deletion_requests;
create policy "deny all" on public.meta_deletion_requests
  for all to anon, authenticated using (false) with check (false);
drop policy if exists "deny all" on public.meta_opt_outs;
create policy "deny all" on public.meta_opt_outs
  for all to anon, authenticated using (false) with check (false);

-- ponytail: no grants to anon / authenticated. Both tables are
-- service-role only — the dashboard reads them via owner RPCs that
-- join through other secure views, never directly.
revoke all on public.webhook_dedup from public, anon, authenticated;
revoke all on public.meta_deletion_requests from public, anon, authenticated;
revoke all on public.meta_opt_outs from public, anon, authenticated;