-- Owner-operated lead-stage updates. The browser invokes only this bounded
-- RPC; the RPC rechecks the canonical owner predicate and writes an audit row.

create or replace function public.owner_update_inquiry_stage(
  p_inquiry_id uuid,
  p_lead_stage text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous_stage text;
begin
  if not (select public.is_owner()) then
    raise exception 'owner_authorization_required';
  end if;

  if p_lead_stage not in (
    'new', 'reviewed', 'contacted', 'qualified',
    'discovery_booked', 'proposal_sent', 'won', 'lost'
  ) then
    raise exception 'lead_stage_invalid';
  end if;

  select lead_stage into v_previous_stage
  from public.inquiries
  where id = p_inquiry_id;

  if v_previous_stage is null then
    return false;
  end if;

  if v_previous_stage = p_lead_stage then
    return true;
  end if;

  update public.inquiries
  set lead_stage = p_lead_stage,
      updated_at = now()
  where id = p_inquiry_id;

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (
    p_inquiry_id,
    'lead_stage_updated',
    'owner',
    jsonb_build_object('from_stage', v_previous_stage, 'to_stage', p_lead_stage)
  );

  return true;
end;
$$;

revoke all on function public.owner_update_inquiry_stage(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.owner_update_inquiry_stage(uuid, text) to authenticated;
