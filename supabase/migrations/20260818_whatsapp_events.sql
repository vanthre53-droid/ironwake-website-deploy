-- 20260818_whatsapp_events.sql
--
-- ponytail: durable sink for the Meta WhatsApp Cloud API webhook. The
-- `whatsapp_events` table is the single source of truth for inbound
-- messages, status updates, and opt-outs. Route handlers write here
-- after signature verification and dedup.
--
-- NOT AUTO-APPLIED. The first line of the file is `-- DO NOT APPLY
-- WITHOUT REVIEW`. Migrations are reviewed by the owner before any
-- `supabase db push` against a real environment (rule §4 Authority
-- class A2).
--
-- This migration is intentionally narrow:
--   * one table, `whatsapp_events`, with a strict column whitelist
--   * no PII columns beyond what Meta actually sends (wa_id, profile
--     name, opt-out flag)
--   * no service-role trigger logic
--   * RLS enabled + deny-by-default — handlers use the service role,
--     so PostgREST never exposes the table to public clients
--
-- The route handler is tolerant of the missing table: when the table
-- is absent it logs structured events and the dedup sink (`webhook_dedup`)
-- still prevents double-processing.

-- DO NOT APPLY WITHOUT REVIEW

create table if not exists public.whatsapp_events (
  id                       bigserial primary key,
  event_type               text not null check (event_type in ('inbound', 'status', 'opt_out')),
  source                   text not null default 'meta_whatsapp',
  wamid                    text not null,
  dedup_key                text generated always as (
    case
      when event_type = 'status' then 'status:' || wamid
      else 'msg:' || wamid
    end
  ) stored,
  contact_id               uuid null,
  contact_source           text null check (contact_source is null or contact_source in ('leads', 'owner_leads')),
  recipient_id             text null,
  status_name              text null,
  status_timestamp         text null,
  conversation_id          text null,
  conversation_expires_at  text null,
  pricing                  jsonb null,
  errors                   jsonb null,
  message_type             text null,
  message_text             text null,
  profile_name             text null,
  opted_out                boolean not null default false,
  metadata                 jsonb null,
  created_at               timestamptz not null default now()
);

create unique index if not exists whatsapp_events_wamid_event_unique
  on public.whatsapp_events (wamid, event_type);

create index if not exists whatsapp_events_contact_id_idx
  on public.whatsapp_events (contact_id, created_at desc);

create index if not exists whatsapp_events_status_name_idx
  on public.whatsapp_events (status_name, created_at desc);

-- ponytail: enable RLS. The service role bypasses it (the route uses
-- the service-role key) so no public exposure even if a future
-- dashboard view joins through these rows.
alter table public.whatsapp_events enable row level security;

-- ponytail: deny everything to anon/authenticated. The handlers
-- authenticate via the service-role key (which bypasses RLS).
drop policy if exists "deny all" on public.whatsapp_events;
create policy "deny all" on public.whatsapp_events
  for all to anon, authenticated using (false) with check (false);

revoke all on public.whatsapp_events from public, anon, authenticated;
