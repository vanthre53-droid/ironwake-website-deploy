-- Qualify RETURNING columns that conflict with the PL/pgSQL return-table names.
-- This preserves the existing service-role-only exact-event selector.
create or replace function public.claim_notification_events(
  p_worker_id text,
  p_provider text,
  p_limit integer default 10,
  p_inquiry_id uuid default null,
  p_event_id uuid default null
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
  set status = 'unknown', safe_error_code = 'worker_lease_expired', retryable = true, finished_at = now()
  from public.outbox_events e
  where a.outbox_event_id = e.id and a.retry_cycle = e.retry_cycle and a.attempt_number = e.attempts
    and a.status = 'started' and e.status = 'processing' and e.claimed_at < now() - interval '10 minutes';

  update public.outbox_events
  set status = 'dead_letter', safe_error_code = 'worker_lease_expired', dead_lettered_at = now(),
      claimed_at = null, claimed_by = null, updated_at = now()
  where status = 'processing' and claimed_at < now() - interval '10 minutes' and attempts >= 3;

  return query
  with candidates as (
    select e.id from public.outbox_events e
    where e.event_type <> 'inquiry_received' and e.target_type in ('owner', 'customer')
      and e.attempts < 3 and e.available_at <= now()
      and (p_inquiry_id is null or e.inquiry_id = p_inquiry_id)
      and (p_event_id is null or e.id = p_event_id)
      and (e.status in ('queued', 'retry_scheduled') or (e.status = 'processing' and e.claimed_at < now() - interval '10 minutes'))
    order by e.available_at, e.created_at for update skip locked limit p_limit
  ), claimed as (
    update public.outbox_events e
    set status = 'processing', provider = trim(p_provider), attempts = e.attempts + 1,
        claimed_at = now(), claimed_by = trim(p_worker_id), last_attempt_at = now(), safe_error_code = null, updated_at = now()
    from candidates c where e.id = c.id
    returning e.id, e.inquiry_id, e.event_type, e.target_type, e.idempotency_key, e.retry_cycle, e.attempts
  ), attempt_rows as (
    insert into public.notification_attempts (outbox_event_id, retry_cycle, attempt_number, provider)
    select c.id, c.retry_cycle, c.attempts, trim(p_provider) from claimed c
    returning notification_attempts.id, notification_attempts.outbox_event_id,
      notification_attempts.retry_cycle, notification_attempts.attempt_number
  )
  select c.id, c.inquiry_id, c.event_type, c.target_type, c.idempotency_key, a.id, c.retry_cycle, c.attempts
  from claimed c join attempt_rows a on a.outbox_event_id = c.id and a.retry_cycle = c.retry_cycle and a.attempt_number = c.attempts;
end;
$$;

revoke all on function public.claim_notification_events(text, text, integer, uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.claim_notification_events(text, text, integer, uuid, uuid)
  to service_role;
