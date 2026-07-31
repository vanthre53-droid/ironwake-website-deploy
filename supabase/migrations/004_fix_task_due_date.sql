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

  insert into public.outbox_events (inquiry_id, event_type, idempotency_key)
  values (v_inquiry_id, 'inquiry_received', 'inquiry_received:' || v_inquiry_id);

  return v_inquiry_id;
end;
$$;
