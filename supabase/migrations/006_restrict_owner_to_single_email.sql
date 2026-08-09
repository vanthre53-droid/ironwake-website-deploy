-- Restrict the owner authorization predicate to a single authorized owner email.
-- Existing RLS policies already key off public.is_owner(); this migration tightens
-- that predicate to require both the legacy app_metadata.role marker AND the
-- specific email that the product owner designated. The architecture stays the
-- same: JWT-based, server-evaluated, no client-side check.

create or replace function public.is_owner()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  -- ponytail: this is the only place that names the authorized owner email.
  -- The literal lives in the database, not in the Next.js bundle.
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
    and lower(coalesce(auth.jwt() ->> 'email', ''))
        = 'ironwakee@gmail.com',
    false
  );
$$;
