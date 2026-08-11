-- ponytail: customer-facing tables + RLS.
-- profiles: minimum row per authenticated user, holding display_name.
-- chat_sessions + chat_messages: authenticated-customer chat persistence.
-- inquiries.user_id: optionally link an anonymous audit to its author when signed in.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text check (title is null or char_length(title) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chat_sessions_user_idx on public.chat_sessions(user_id, updated_at desc);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_session_idx on public.chat_messages(session_id, created_at asc);

alter table public.inquiries
  add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists inquiries_user_idx on public.inquiries(user_id) where user_id is not null;

-- ponytail: RLS. profiles / chat_sessions / chat_messages use auth.uid() so
-- each customer can only see their own rows. Owners continue to use the
-- existing is_owner() predicate for CRM access.

alter table public.profiles enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.chat_sessions from anon, authenticated;
revoke all on table public.chat_messages from anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profile_select_own') then
    create policy profile_select_own on public.profiles
      for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profile_insert_own') then
    create policy profile_insert_own on public.profiles
      for insert to authenticated with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profile_update_own') then
    create policy profile_update_own on public.profiles
      for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='chat_sessions' and policyname='chat_sessions_all_own') then
    create policy chat_sessions_all_own on public.chat_sessions
      for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='chat_messages' and policyname='chat_messages_all_own') then
    create policy chat_messages_all_own on public.chat_messages
      for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- ponytail: authenticated customers may read their OWN inquiries (audit
-- history inside /account). Owner CRM access is still routed through is_owner().
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='inquiries' and policyname='inquiry_select_own') then
    create policy inquiry_select_own on public.inquiries
      for select to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- ponytail: customer RPC for upserting profile during signup.
create or replace function public.upsert_own_profile(p_display_name text)
returns void
language sql
security invoker
set search_path = public
as $$
  insert into public.profiles (user_id, display_name)
  values (auth.uid(), p_display_name)
  on conflict (user_id) do update set display_name = excluded.display_name, updated_at = now();
$$;

revoke all on function public.upsert_own_profile(text) from public;
grant execute on function public.upsert_own_profile(text) to authenticated;
