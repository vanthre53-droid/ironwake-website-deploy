-- Require an authenticated AAL2 session for every canonical owner predicate.
-- This protects RLS-backed CRM reads and owner RPCs, not just the dashboard UI.
create or replace function public.is_owner()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = 'ironwakee@gmail.com'
    and coalesce(auth.jwt() ->> 'aal', '') = 'aal2',
    false
  );
$$;
