-- Forward-only authorization repair for the single-owner CRM.
--
-- Live readback on 2026-08-09 found two independent problems:
--   1. public.is_owner() and the inquiries policy only checked role=owner.
--   2. Supabase's default function privileges had granted anon/authenticated
--      EXECUTE on privileged SECURITY DEFINER functions.
--
-- Keep the public functions in place for the current application contract,
-- but make every privilege explicit. No table or customer row is changed.

create or replace function public.is_owner()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
    and lower(coalesce(auth.jwt() ->> 'email', ''))
        = 'ironwakee@gmail.com',
    false
  );
$$;

-- Recreate all private-table policies against the one canonical predicate.
drop policy if exists owner_can_manage_inquiries on public.inquiries;
create policy owner_can_manage_inquiries on public.inquiries
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

drop policy if exists owner_can_manage_contacts on public.contacts;
create policy owner_can_manage_contacts on public.contacts
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

drop policy if exists owner_can_manage_consents on public.consents;
create policy owner_can_manage_consents on public.consents
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

drop policy if exists owner_can_manage_tasks on public.tasks;
create policy owner_can_manage_tasks on public.tasks
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

drop policy if exists owner_can_manage_outbox_events on public.outbox_events;
create policy owner_can_manage_outbox_events on public.outbox_events
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

drop policy if exists owner_can_manage_audit_logs on public.audit_logs;
create policy owner_can_manage_audit_logs on public.audit_logs
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

-- The predicate is safe for authenticated callers and is required by RLS.
revoke all on function public.is_owner() from public, anon, authenticated, service_role;
grant execute on function public.is_owner() to authenticated;

-- Public intake must cross the validated Next.js server boundary. Only the
-- server's service role may call the privileged atomic persistence function.
revoke all on function public.submit_audit_inquiry(text, text, text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.submit_audit_inquiry(text, text, text, text)
  to service_role;

-- Retention is a controlled server operation, never a public Data API action.
revoke all on function public.anonymize_expired_inquiries()
  from public, anon, authenticated, service_role;
grant execute on function public.anonymize_expired_inquiries()
  to service_role;

-- This event-trigger function belongs to database administration only.
revoke all on function public.rls_auto_enable()
  from public, anon, authenticated, service_role;
grant execute on function public.rls_auto_enable() to postgres;
