-- Forward-only hardening for authenticated customer data.
-- Restores only the table privileges required by RLS and enforces that every
-- chat message belongs to the same user as its referenced chat session.

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.chat_sessions from anon, authenticated;
revoke all on table public.chat_messages from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.chat_sessions to authenticated;
grant select, insert, update, delete on table public.chat_messages to authenticated;

-- A referenced key must be unique for PostgreSQL to accept the composite FK.
-- Catalog guards keep operator retries safe.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.chat_sessions'::regclass
      and conname = 'chat_sessions_id_user_unique'
  ) then
    alter table public.chat_sessions
      add constraint chat_sessions_id_user_unique unique (id, user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.chat_messages'::regclass
      and conname = 'chat_messages_session_user_fk'
  ) then
    alter table public.chat_messages
      add constraint chat_messages_session_user_fk
      foreign key (session_id, user_id)
      references public.chat_sessions (id, user_id)
      on delete cascade;
  end if;
end
$$;

-- Replace policies rather than retaining a stale same-name definition.
drop policy if exists profile_select_own on public.profiles;
drop policy if exists profile_insert_own on public.profiles;
drop policy if exists profile_update_own on public.profiles;
create policy profile_select_own on public.profiles
  for select to authenticated using (auth.uid() = user_id);
create policy profile_insert_own on public.profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy profile_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists chat_sessions_all_own on public.chat_sessions;
create policy chat_sessions_all_own on public.chat_sessions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists chat_messages_all_own on public.chat_messages;
create policy chat_messages_all_own on public.chat_messages
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public inquiry intake must not overwrite an existing contact's business_name
-- or un-anonymize a previously anonymized contact when a public form is
-- submitted with an email that already belongs to another customer. The
-- rewritten function first looks for an existing contact row keyed by
-- email_normalized. If one exists, it is reused; otherwise a brand-new row is
-- inserted with `on conflict do nothing` and the existing id is then read.
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
  -- Public intake should never overwrite an existing contact by email. A
  -- re-submission from the audit form is a new inquiry under the same
  -- contact, not a re-identification of an existing customer.
  insert into public.contacts (email_normalized, business_name)
  values (v_email, p_business_name)
  on conflict (email_normalized) do nothing;

  -- Reuse the existing contact row when one already exists; otherwise fall
  -- back to the freshly inserted one.
  select id into v_contact_id
  from public.contacts
  where email_normalized = v_email;

  if v_contact_id is null then
    raise exception 'contact_lookup_failed';
  end if;

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
