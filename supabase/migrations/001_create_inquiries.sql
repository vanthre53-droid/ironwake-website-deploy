create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  business_name text not null check (char_length(business_name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  leak_description text not null check (char_length(leak_description) between 10 and 4000),
  consented_at timestamptz not null,
  source text not null default 'website_audit',
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed', 'spam')),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'inquiries' and policyname = 'owner_can_manage_inquiries') then
    create policy owner_can_manage_inquiries on public.inquiries
      for all to authenticated
      using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
      with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
  end if;
end $$;
