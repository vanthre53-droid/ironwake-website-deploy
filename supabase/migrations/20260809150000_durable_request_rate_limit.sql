create table if not exists public.request_rate_limits (
  key_hash text primary key check (char_length(key_hash) = 64),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.request_rate_limits enable row level security;
revoke all on table public.request_rate_limits from public, anon, authenticated;

create or replace function public.consume_request_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if char_length(p_key_hash) <> 64 or p_limit not between 1 and 100 or p_window_seconds not between 1 and 86400 then
    raise exception 'rate_limit_invalid';
  end if;
  insert into public.request_rate_limits(key_hash, window_started_at, request_count, updated_at)
  values (p_key_hash, now(), 1, now())
  on conflict (key_hash) do update set
    window_started_at = case when request_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now() else request_rate_limits.window_started_at end,
    request_count = case when request_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1 else request_rate_limits.request_count + 1 end,
    updated_at = now()
  returning request_count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.consume_request_rate_limit(text, integer, integer) from public, anon, authenticated, service_role;
grant execute on function public.consume_request_rate_limit(text, integer, integer) to service_role;
