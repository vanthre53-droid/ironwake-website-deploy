-- Durable, provider-neutral notification state for IronWake inquiry intake.
--
-- This migration sends nothing. It separates owner/customer event intent,
-- records bounded attempts and provider callbacks, and prevents the 36 legacy
-- undifferentiated events from ever being sent retroactively.

alter table public.outbox_events
  drop constraint if exists outbox_events_event_type_check;

alter table public.outbox_events
  add constraint outbox_events_event_type_check check (
    event_type in (
      'inquiry_received',
      'owner_new_audit',
      'owner_new_booking_request',
      'customer_audit_received',
      'customer_booking_request_received',
      'owner_priority_alert'
    )
  );

alter table public.outbox_events
  add column if not exists target_type text,
  add column if not exists provider text,
  add column if not exists provider_message_id text,
  add column if not exists retry_cycle integer not null default 0,
  add column if not exists claimed_at timestamptz,
  add column if not exists claimed_by text,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists accepted_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists dead_lettered_at timestamptz,
  add column if not exists safe_error_code text;

update public.outbox_events
set status = 'cancelled',
    target_type = 'legacy',
    safe_error_code = 'legacy_event_not_addressable',
    claimed_at = null,
    claimed_by = null,
    updated_at = now()
where event_type = 'inquiry_received'
  and status in ('queued', 'processing', 'retry_scheduled');

alter table public.outbox_events
  alter column target_type set not null,
  add constraint outbox_events_target_type_check check (
    (event_type = 'inquiry_received' and target_type = 'legacy')
    or (event_type in ('owner_new_audit', 'owner_new_booking_request', 'owner_priority_alert') and target_type = 'owner')
    or (event_type in ('customer_audit_received', 'customer_booking_request_received') and target_type = 'customer')
  ),
  add constraint outbox_events_retry_cycle_check check (retry_cycle >= 0),
  add constraint outbox_events_safe_error_code_check check (
    safe_error_code is null or char_length(safe_error_code) between 1 and 100
  );

create unique index if not exists outbox_events_provider_message_idx
  on public.outbox_events(provider, provider_message_id)
  where provider is not null and provider_message_id is not null;

create index if not exists outbox_events_inquiry_id_idx
  on public.outbox_events(inquiry_id);

create table if not exists public.notification_attempts (
  id uuid primary key default gen_random_uuid(),
  outbox_event_id uuid not null references public.outbox_events(id) on delete cascade,
  retry_cycle integer not null check (retry_cycle >= 0),
  attempt_number integer not null check (attempt_number between 1 and 3),
  provider text not null check (char_length(provider) between 1 and 50),
  status text not null default 'started' check (
    status in ('started', 'accepted_by_provider', 'failed', 'unknown')
  ),
  provider_message_id text,
  safe_error_code text check (
    safe_error_code is null or char_length(safe_error_code) between 1 and 100
  ),
  retryable boolean,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (outbox_event_id, retry_cycle, attempt_number)
);

create table if not exists public.provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (char_length(provider) between 1 and 50),
  provider_event_id text not null check (char_length(provider_event_id) between 1 and 255),
  event_type text not null check (
    event_type in (
      'email.sent',
      'email.delivered',
      'email.delivery_delayed',
      'email.failed',
      'email.bounced',
      'email.complained',
      'email.suppressed'
    )
  ),
  provider_message_id text not null check (char_length(provider_message_id) between 1 and 255),
  outbox_event_id uuid references public.outbox_events(id) on delete set null,
  occurred_at timestamptz,
  received_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create index if not exists notification_attempts_outbox_event_id_idx
  on public.notification_attempts(outbox_event_id);

create index if not exists provider_events_outbox_event_id_idx
  on public.provider_events(outbox_event_id);

create index if not exists provider_events_message_idx
  on public.provider_events(provider, provider_message_id);

alter table public.notification_attempts enable row level security;
alter table public.provider_events enable row level security;

revoke all on table public.notification_attempts from public, anon, authenticated, service_role;
revoke all on table public.provider_events from public, anon, authenticated, service_role;
grant select on table public.notification_attempts, public.provider_events to authenticated;
grant select, insert, update, delete on table public.notification_attempts, public.provider_events to service_role;

drop policy if exists owner_can_manage_outbox_events on public.outbox_events;
drop policy if exists owner_can_read_outbox_events on public.outbox_events;
create policy owner_can_read_outbox_events on public.outbox_events
  for select to authenticated
  using ((select public.is_owner()));

revoke all on table public.outbox_events from authenticated;
grant select on table public.outbox_events to authenticated;

drop policy if exists owner_can_read_notification_attempts on public.notification_attempts;
create policy owner_can_read_notification_attempts on public.notification_attempts
  for select to authenticated
  using ((select public.is_owner()));

drop policy if exists owner_can_read_provider_events on public.provider_events;
create policy owner_can_read_provider_events on public.provider_events
  for select to authenticated
  using ((select public.is_owner()));

create or replace function public.submit_audit_inquiry(
  p_business_name text,
  p_email text,
  p_leak_description text,
  p_source text default 'website_audit'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contact_id uuid;
  v_inquiry_id uuid;
  v_email text := lower(trim(p_email));
  v_owner_event_type text;
  v_customer_event_type text;
begin
  insert into public.contacts (email_normalized, business_name)
  values (v_email, p_business_name)
  on conflict (email_normalized) do update
    set business_name = excluded.business_name,
        updated_at = now(),
        anonymized_at = null
  returning id into v_contact_id;

  insert into public.inquiries (
    contact_id, business_name, email, leak_description, consented_at, source, retention_until
  ) values (
    v_contact_id, p_business_name, v_email, p_leak_description, now(), p_source, now() + interval '90 days'
  ) returning id into v_inquiry_id;

  insert into public.consents (inquiry_id, consent_type, source)
  values (v_inquiry_id, 'contact', p_source);

  insert into public.tasks (inquiry_id, category, due_at)
  values (
    v_inquiry_id,
    'review_inquiry',
    now() + case extract(isodow from now())
      when 5 then interval '3 days'
      when 6 then interval '2 days'
      else interval '1 day'
    end
  );

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (v_inquiry_id, 'inquiry_received', 'system', jsonb_build_object('source', p_source));

  if p_source = 'website_booking' then
    v_owner_event_type := 'owner_new_booking_request';
    v_customer_event_type := 'customer_booking_request_received';
  else
    v_owner_event_type := 'owner_new_audit';
    v_customer_event_type := 'customer_audit_received';
  end if;

  insert into public.outbox_events (
    inquiry_id, event_type, target_type, idempotency_key
  ) values
    (v_inquiry_id, v_owner_event_type, 'owner', v_owner_event_type || ':' || v_inquiry_id),
    (v_inquiry_id, v_customer_event_type, 'customer', v_customer_event_type || ':' || v_inquiry_id);

  return v_inquiry_id;
end;
$$;

create or replace function public.queue_priority_lead_notification(p_inquiry_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id uuid;
begin
  if not exists (select 1 from public.inquiries where id = p_inquiry_id) then
    raise exception 'inquiry_not_found';
  end if;

  insert into public.outbox_events (
    inquiry_id, event_type, target_type, idempotency_key
  ) values (
    p_inquiry_id,
    'owner_priority_alert',
    'owner',
    'owner_priority_alert:' || p_inquiry_id
  )
  on conflict (idempotency_key) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    select id into v_event_id
    from public.outbox_events
    where idempotency_key = 'owner_priority_alert:' || p_inquiry_id;
  end if;

  return v_event_id;
end;
$$;

create or replace function public.claim_notification_events(
  p_worker_id text,
  p_provider text,
  p_limit integer default 10,
  p_inquiry_id uuid default null
)
returns table (
  event_id uuid,
  inquiry_id uuid,
  event_type text,
  target_type text,
  idempotency_key text,
  attempt_id uuid,
  retry_cycle integer,
  attempt_number integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_worker_id is null or char_length(trim(p_worker_id)) not between 1 and 100 then
    raise exception 'invalid_worker_id';
  end if;
  if p_provider is null or char_length(trim(p_provider)) not between 1 and 50 then
    raise exception 'invalid_provider';
  end if;
  if p_limit not between 1 and 10 then
    raise exception 'invalid_batch_limit';
  end if;

  update public.notification_attempts a
  set status = 'unknown',
      safe_error_code = 'worker_lease_expired',
      retryable = true,
      finished_at = now()
  from public.outbox_events e
  where a.outbox_event_id = e.id
    and a.retry_cycle = e.retry_cycle
    and a.attempt_number = e.attempts
    and a.status = 'started'
    and e.status = 'processing'
    and e.claimed_at < now() - interval '10 minutes';

  update public.outbox_events
  set status = 'dead_letter',
      safe_error_code = 'worker_lease_expired',
      dead_lettered_at = now(),
      claimed_at = null,
      claimed_by = null,
      updated_at = now()
  where status = 'processing'
    and claimed_at < now() - interval '10 minutes'
    and attempts >= 3;

  return query
  with candidates as (
    select e.id
    from public.outbox_events e
    where e.event_type <> 'inquiry_received'
      and e.target_type in ('owner', 'customer')
      and e.attempts < 3
      and e.available_at <= now()
      and (p_inquiry_id is null or e.inquiry_id = p_inquiry_id)
      and (
        e.status in ('queued', 'retry_scheduled')
        or (e.status = 'processing' and e.claimed_at < now() - interval '10 minutes')
      )
    order by e.available_at, e.created_at
    for update skip locked
    limit p_limit
  ), claimed as (
    update public.outbox_events e
    set status = 'processing',
        provider = trim(p_provider),
        attempts = e.attempts + 1,
        claimed_at = now(),
        claimed_by = trim(p_worker_id),
        last_attempt_at = now(),
        safe_error_code = null,
        updated_at = now()
    from candidates c
    where e.id = c.id
    returning e.id, e.inquiry_id, e.event_type, e.target_type,
      e.idempotency_key, e.retry_cycle, e.attempts
  ), attempt_rows as (
    insert into public.notification_attempts (
      outbox_event_id, retry_cycle, attempt_number, provider
    )
    select c.id, c.retry_cycle, c.attempts, trim(p_provider)
    from claimed c
    returning id, outbox_event_id, retry_cycle, attempt_number
  )
  select c.id, c.inquiry_id, c.event_type, c.target_type,
    c.idempotency_key, a.id, c.retry_cycle, c.attempts
  from claimed c
  join attempt_rows a on a.outbox_event_id = c.id
    and a.retry_cycle = c.retry_cycle
    and a.attempt_number = c.attempts;
end;
$$;

create or replace function public.finish_notification_attempt(
  p_event_id uuid,
  p_attempt_id uuid,
  p_outcome text,
  p_provider_message_id text default null,
  p_safe_error_code text default null,
  p_retryable boolean default false
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.outbox_events%rowtype;
  v_next_status text;
begin
  if p_outcome not in ('accepted_by_provider', 'failed', 'unknown') then
    raise exception 'invalid_attempt_outcome';
  end if;
  if p_safe_error_code is not null and char_length(p_safe_error_code) not between 1 and 100 then
    raise exception 'invalid_safe_error_code';
  end if;

  select * into v_event
  from public.outbox_events
  where id = p_event_id
  for update;

  if not found or v_event.status <> 'processing' then
    raise exception 'event_not_processing';
  end if;

  if not exists (
    select 1 from public.notification_attempts
    where id = p_attempt_id
      and outbox_event_id = p_event_id
      and retry_cycle = v_event.retry_cycle
      and attempt_number = v_event.attempts
      and status = 'started'
  ) then
    raise exception 'attempt_not_active';
  end if;

  if p_outcome = 'accepted_by_provider' then
    if p_provider_message_id is null or char_length(trim(p_provider_message_id)) < 1 then
      raise exception 'provider_message_id_required';
    end if;
    v_next_status := 'accepted_by_provider';
  elsif p_retryable and v_event.attempts < 3 then
    v_next_status := 'retry_scheduled';
  else
    v_next_status := 'dead_letter';
  end if;

  update public.notification_attempts
  set status = p_outcome,
      provider_message_id = nullif(trim(p_provider_message_id), ''),
      safe_error_code = p_safe_error_code,
      retryable = p_retryable,
      finished_at = now()
  where id = p_attempt_id;

  update public.outbox_events
  set status = v_next_status,
      provider_message_id = case
        when p_outcome = 'accepted_by_provider' then trim(p_provider_message_id)
        else provider_message_id
      end,
      accepted_at = case
        when p_outcome = 'accepted_by_provider' then now()
        else accepted_at
      end,
      available_at = case
        when v_next_status = 'retry_scheduled' then now() + case v_event.attempts
          when 1 then interval '5 minutes'
          else interval '30 minutes'
        end
        else available_at
      end,
      dead_lettered_at = case
        when v_next_status = 'dead_letter' then now()
        else null
      end,
      safe_error_code = case
        when p_outcome = 'accepted_by_provider' then null
        else coalesce(p_safe_error_code, 'notification_attempt_failed')
      end,
      claimed_at = null,
      claimed_by = null,
      updated_at = now()
  where id = p_event_id;

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (
    v_event.inquiry_id,
    'notification_attempt_finished',
    'system',
    jsonb_build_object(
      'event_id', p_event_id,
      'event_type', v_event.event_type,
      'attempt', v_event.attempts,
      'retry_cycle', v_event.retry_cycle,
      'status', v_next_status,
      'safe_error_code', p_safe_error_code
    )
  );

  return v_next_status;
end;
$$;

create or replace function public.record_notification_provider_event(
  p_provider text,
  p_provider_event_id text,
  p_event_type text,
  p_provider_message_id text,
  p_occurred_at timestamptz default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_provider_event_id uuid;
  v_event public.outbox_events%rowtype;
begin
  if p_event_type not in (
    'email.sent',
    'email.delivered',
    'email.delivery_delayed',
    'email.failed',
    'email.bounced',
    'email.complained',
    'email.suppressed'
  ) then
    raise exception 'unsupported_provider_event';
  end if;

  insert into public.provider_events (
    provider, provider_event_id, event_type, provider_message_id, occurred_at
  ) values (
    trim(p_provider), trim(p_provider_event_id), p_event_type,
    trim(p_provider_message_id), p_occurred_at
  )
  on conflict (provider, provider_event_id) do nothing
  returning id into v_provider_event_id;

  if v_provider_event_id is null then
    return false;
  end if;

  select * into v_event
  from public.outbox_events
  where provider = trim(p_provider)
    and provider_message_id = trim(p_provider_message_id)
  for update;

  if found then
    update public.provider_events
    set outbox_event_id = v_event.id
    where id = v_provider_event_id;

    update public.outbox_events
    set status = case
          when p_event_type = 'email.delivered' then 'delivered'
          when p_event_type in ('email.failed', 'email.bounced', 'email.complained', 'email.suppressed') then 'dead_letter'
          when status in ('delivered', 'dead_letter', 'cancelled') then status
          else 'accepted_by_provider'
        end,
        delivered_at = case
          when p_event_type = 'email.delivered' then coalesce(p_occurred_at, now())
          else delivered_at
        end,
        dead_lettered_at = case
          when p_event_type in ('email.failed', 'email.bounced', 'email.complained', 'email.suppressed') then coalesce(p_occurred_at, now())
          else dead_lettered_at
        end,
        safe_error_code = case
          when p_event_type = 'email.delivery_delayed' then 'provider_delivery_delayed'
          when p_event_type in ('email.failed', 'email.bounced', 'email.complained', 'email.suppressed')
            then replace(p_event_type, '.', '_')
          when p_event_type = 'email.delivered' then null
          else safe_error_code
        end,
        updated_at = now()
    where id = v_event.id;

    insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
    values (
      v_event.inquiry_id,
      'notification_provider_event',
      'system',
      jsonb_build_object(
        'event_id', v_event.id,
        'provider', trim(p_provider),
        'provider_event_type', p_event_type
      )
    );
  end if;

  return true;
end;
$$;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated, service_role;
grant usage on schema private to authenticated;

create or replace function private.owner_retry_notification_internal(p_event_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_event public.outbox_events%rowtype;
begin
  if not (select public.is_owner()) then
    raise exception 'owner_authorization_required';
  end if;

  select * into v_event
  from public.outbox_events
  where id = p_event_id
  for update;

  if not found
    or v_event.event_type = 'inquiry_received'
    or v_event.target_type = 'legacy'
    or v_event.status not in ('dead_letter', 'cancelled') then
    raise exception 'event_not_retryable';
  end if;

  update public.outbox_events
  set status = 'queued',
      attempts = 0,
      retry_cycle = retry_cycle + 1,
      provider = null,
      provider_message_id = null,
      available_at = now(),
      claimed_at = null,
      claimed_by = null,
      last_attempt_at = null,
      accepted_at = null,
      delivered_at = null,
      dead_lettered_at = null,
      safe_error_code = null,
      updated_at = now()
  where id = p_event_id;

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (
    v_event.inquiry_id,
    'notification_retry_requested',
    'owner',
    jsonb_build_object('event_id', p_event_id, 'event_type', v_event.event_type)
  );

  return true;
end;
$$;

create or replace function public.owner_retry_notification(p_event_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = public, private
as $$
begin
  if not (select public.is_owner()) then
    raise exception 'owner_authorization_required';
  end if;
  return private.owner_retry_notification_internal(p_event_id);
end;
$$;

revoke all on function public.submit_audit_inquiry(text, text, text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.submit_audit_inquiry(text, text, text, text)
  to service_role;

revoke all on function public.queue_priority_lead_notification(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.queue_priority_lead_notification(uuid)
  to service_role;

revoke all on function public.claim_notification_events(text, text, integer, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.claim_notification_events(text, text, integer, uuid)
  to service_role;

revoke all on function public.finish_notification_attempt(uuid, uuid, text, text, text, boolean)
  from public, anon, authenticated, service_role;
grant execute on function public.finish_notification_attempt(uuid, uuid, text, text, text, boolean)
  to service_role;

revoke all on function public.record_notification_provider_event(text, text, text, text, timestamptz)
  from public, anon, authenticated, service_role;
grant execute on function public.record_notification_provider_event(text, text, text, text, timestamptz)
  to service_role;

revoke all on function private.owner_retry_notification_internal(uuid)
  from public, anon, authenticated, service_role;
grant execute on function private.owner_retry_notification_internal(uuid)
  to authenticated;

revoke all on function public.owner_retry_notification(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.owner_retry_notification(uuid)
  to authenticated;
