-- Request-only booking lifecycle. This does not connect a calendar, reserve a
-- slot, notify a provider, or mark an appointment confirmed.

alter table public.inquiries
  add column if not exists booking_status text check (
    booking_status is null or booking_status in (
      'REQUEST_RECEIVED', 'REVIEWING', 'CONFIRMED',
      'NEEDS_FOLLOW_UP', 'CANCELLED', 'FAILED'
    )
  );

update public.inquiries
set booking_status = 'REQUEST_RECEIVED',
    next_action = coalesce(next_action, 'Review booking request')
where source = 'website_booking'
  and booking_status is null;

create index if not exists inquiries_booking_status_idx
  on public.inquiries(booking_status, created_at desc)
  where booking_status is not null;

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
  v_is_booking boolean := p_source = 'website_booking';
begin
  insert into public.contacts (email_normalized, business_name)
  values (v_email, p_business_name)
  on conflict (email_normalized) do update
    set business_name = excluded.business_name,
        updated_at = now(),
        anonymized_at = null
  returning id into v_contact_id;

  insert into public.inquiries (
    contact_id, business_name, email, leak_description, consented_at, source,
    booking_status, next_action, retention_until
  ) values (
    v_contact_id, p_business_name, v_email, p_leak_description, now(), p_source,
    case when v_is_booking then 'REQUEST_RECEIVED' else null end,
    case when v_is_booking then 'Review booking request' else 'Review audit inquiry' end,
    now() + interval '90 days'
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
  values (
    v_inquiry_id,
    case when v_is_booking then 'booking_request_received' else 'inquiry_received' end,
    'system',
    jsonb_build_object('source', p_source, 'booking_status', case when v_is_booking then 'REQUEST_RECEIVED' else null end)
  );

  if v_is_booking then
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
