-- Minimal owner-operated follow-up lifecycle. No customer message or provider
-- reminder is sent from this migration.

create index if not exists tasks_open_due_idx
  on public.tasks(due_at, inquiry_id)
  where completed_at is null;

update public.inquiries i
set due_at = (
      select t.due_at
      from public.tasks t
      where t.inquiry_id = i.id and t.completed_at is null
      order by t.due_at asc nulls last
      limit 1
    ),
    next_action = coalesce(i.next_action, 'Review inquiry')
where i.due_at is null
  and exists (
    select 1 from public.tasks t
    where t.inquiry_id = i.id and t.completed_at is null
  );

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
  v_due_at timestamptz := now() + case extract(isodow from now())
    when 5 then interval '3 days'
    when 6 then interval '2 days'
    else interval '1 day'
  end;
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
    booking_status, next_action, due_at, retention_until
  ) values (
    v_contact_id, p_business_name, v_email, p_leak_description, now(), p_source,
    case when v_is_booking then 'REQUEST_RECEIVED' else null end,
    case when v_is_booking then 'Review booking request' else 'Review audit inquiry' end,
    v_due_at,
    now() + interval '90 days'
  ) returning id into v_inquiry_id;

  insert into public.consents (inquiry_id, consent_type, source)
  values (v_inquiry_id, 'contact', p_source);

  insert into public.tasks (inquiry_id, category, due_at)
  values (v_inquiry_id, 'review_inquiry', v_due_at);

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

create or replace function public.owner_complete_task(p_task_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_inquiry_id uuid;
begin
  if not (select public.is_owner()) then
    raise exception 'owner_authorization_required';
  end if;

  update public.tasks
  set completed_at = now()
  where id = p_task_id and completed_at is null
  returning inquiry_id into v_inquiry_id;

  if v_inquiry_id is null then
    return false;
  end if;

  update public.inquiries
  set next_action = 'Review follow-up outcome',
      due_at = null,
      updated_at = now()
  where id = v_inquiry_id;

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (v_inquiry_id, 'follow_up_task_completed', 'owner', jsonb_build_object('task_id', p_task_id));

  return true;
end;
$$;

revoke all on function public.owner_complete_task(uuid) from public, anon, authenticated, service_role;
grant execute on function public.owner_complete_task(uuid) to authenticated;
