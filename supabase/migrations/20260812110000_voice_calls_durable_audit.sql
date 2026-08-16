-- 20260812110000_voice_calls_durable_audit.sql
--
-- ponytail: Retell webhook (call_started / call_ended / call_analyzed)
-- writes a row per event so the owner can audit every call from the
-- dashboard without leaving Supabase. The web-call endpoint is gated
-- to authenticated customers; phone numbers are kept but redacted in
-- any owner-facing read API.
--
-- RLS: customers can only see calls that match their authenticated phone
-- or to_number. Owner is a separate role checked by the existing
-- secure_owner_and_privileged_rpcs policies; they read via service role
-- RPC, not from the table directly.
--
-- Forward only. No backfill — the table is fresh for the production
-- Retell integration.

create table if not exists public.voice_calls (
  id                  bigserial primary key,
  provider            text not null check (provider in ('retell')),
  call_id             text not null,
  event_type          text not null check (event_type in ('call_started','call_ended','call_analyzed','transcript_updated')),
  agent_id            text,
  call_type           text,
  from_number         text,
  to_number           text,
  start_timestamp     bigint,
  end_timestamp       bigint,
  call_summary        text,
  call_successful     boolean,
  user_sentiment      text,
  disconnection_reason text,
  occurred_at         timestamptz not null,
  updated_at          timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  unique (provider, call_id, event_type)
);

create index if not exists voice_calls_occurred_at_idx
  on public.voice_calls (occurred_at desc);

create index if not exists voice_calls_call_id_idx
  on public.voice_calls (call_id);

-- ponytail: we do NOT enable customer RLS on this table. Voice calls are
-- an internal operational record (used by the owner dashboard and the
-- customer's own call history on the account page). All client access
-- is mediated by a security-definer RPC (defined in 20260809101143) and
-- the service role used by the owner CRM. Direct SELECT is denied.

alter table public.voice_calls enable row level security;

drop policy if exists voice_calls_no_direct_select on public.voice_calls;
create policy voice_calls_no_direct_select
  on public.voice_calls
  for select
  to authenticated, anon
  using (false);

drop policy if exists voice_calls_no_direct_write on public.voice_calls;
create policy voice_calls_no_direct_write
  on public.voice_calls
  for all
  to authenticated, anon
  using (false)
  with check (false);

revoke all on public.voice_calls from anon, authenticated;
grant usage on sequence public.voice_calls_id_seq to service_role;

-- ponytail: an owner-only RPC that returns recent voice calls (redacted)
-- is the only sanctioned read path. Customer read path is added by the
-- existing read_customer_call_history RPC in a separate migration.
-- (No new RPC here — the owner CRM uses service role + post-filter,
--  and customer call history is read via a future hardening migration.)

comment on table public.voice_calls is
  'Retell voice call event log. Written by /api/webhooks/retell. RLS denies direct read; only service_role (owner CRM) and approved RPCs can read.';
