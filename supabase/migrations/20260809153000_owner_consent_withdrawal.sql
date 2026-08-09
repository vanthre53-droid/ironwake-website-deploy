-- Owner-operated contact-consent withdrawal. This does not delete/anonymize
-- records or send a message; it stops unsent customer notifications and leaves
-- a durable metadata-only audit event.

create or replace function public.owner_withdraw_inquiry_consent(
  p_inquiry_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_consent_id uuid;
  v_withdrawn_at timestamptz;
  v_cancelled_count integer := 0;
begin
  if not (select public.is_owner()) then
    raise exception 'owner_authorization_required';
  end if;

  select id, withdrawn_at
  into v_consent_id, v_withdrawn_at
  from public.consents
  where inquiry_id = p_inquiry_id
    and consent_type = 'contact'
  order by granted_at desc
  limit 1
  for update;

  if v_consent_id is null then
    return false;
  end if;
  if v_withdrawn_at is not null then
    return true;
  end if;

  update public.consents
  set withdrawn_at = now()
  where id = v_consent_id;

  update public.inquiries
  set next_action = 'Contact consent withdrawn — do not contact',
      due_at = null,
      updated_at = now()
  where id = p_inquiry_id;

  update public.outbox_events
  set status = 'cancelled',
      safe_error_code = 'contact_consent_withdrawn',
      updated_at = now()
  where inquiry_id = p_inquiry_id
    and target_type = 'customer'
    and status in ('queued', 'retry_scheduled');
  get diagnostics v_cancelled_count = row_count;

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (
    p_inquiry_id,
    'contact_consent_withdrawn',
    'owner',
    jsonb_build_object('consent_id', v_consent_id, 'cancelled_customer_notifications', v_cancelled_count)
  );

  return true;
end;
$$;

revoke all on function public.owner_withdraw_inquiry_consent(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.owner_withdraw_inquiry_consent(uuid) to authenticated;
