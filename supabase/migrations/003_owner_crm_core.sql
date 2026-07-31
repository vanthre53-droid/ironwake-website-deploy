create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  email_normalized text not null unique check (char_length(email_normalized) between 3 and 254),
  business_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  anonymized_at timestamptz
);

alter table public.inquiries
  add column if not exists contact_id uuid references public.contacts(id) on delete set null,
  add column if not exists lead_stage text not null default 'new' check (lead_stage in ('new', 'reviewed', 'contacted', 'qualified', 'discovery_booked', 'proposal_sent', 'won', 'lost')),
  add column if not exists next_action text,
  add column if not exists due_at timestamptz,
  add column if not exists retention_until timestamptz not null default (now() + interval '90 days'),
  add column if not exists anonymized_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  consent_type text not null check (consent_type in ('contact')),
  granted_at timestamptz not null default now(),
  source text not null,
  withdrawn_at timestamptz,
  unique (inquiry_id, consent_type)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  category text not null check (category in ('review_inquiry', 'email', 'call', 'schedule_discovery', 'prepare_audit', 'send_proposal', 'follow_up', 'close')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  event_type text not null check (event_type in ('inquiry_received')),
  idempotency_key text not null unique,
  status text not null default 'queued' check (status in ('queued', 'processing', 'retry_scheduled', 'accepted_by_provider', 'delivered', 'dead_letter', 'cancelled')),
  attempts integer not null default 0 check (attempts >= 0 and attempts <= 3),
  available_at timestamptz not null default now(),
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries(id) on delete set null,
  action text not null,
  actor_type text not null check (actor_type in ('system', 'owner')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists inquiries_contact_id_idx on public.inquiries(contact_id);
create index if not exists inquiries_retention_until_idx on public.inquiries(retention_until) where anonymized_at is null;
create index if not exists outbox_events_available_idx on public.outbox_events(status, available_at) where status in ('queued', 'retry_scheduled');

alter table public.contacts enable row level security;
alter table public.consents enable row level security;
alter table public.tasks enable row level security;
alter table public.outbox_events enable row level security;
alter table public.audit_logs enable row level security;

revoke all on table public.contacts from anon, authenticated;
revoke all on table public.consents from anon, authenticated;
revoke all on table public.tasks from anon, authenticated;
revoke all on table public.outbox_events from anon, authenticated;
revoke all on table public.audit_logs from anon, authenticated;

create or replace function public.is_owner()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner';
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['contacts', 'consents', 'tasks', 'outbox_events', 'audit_logs'] loop
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = table_name and policyname = 'owner_can_manage_' || table_name
    ) then
      execute format(
        'create policy %I on public.%I for all to authenticated using (public.is_owner()) with check (public.is_owner())',
        'owner_can_manage_' || table_name,
        table_name
      );
    end if;
  end loop;
end $$;

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

create or replace function public.anonymize_expired_inquiries()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  with expired as (
    update public.inquiries
    set business_name = 'Deleted',
        email = 'deleted+' || id || '@invalid.local',
        leak_description = 'Deleted after retention period.',
        anonymized_at = now(),
        updated_at = now()
    where anonymized_at is null and retention_until <= now()
    returning id, contact_id
  ), anonymized_contacts as (
    update public.contacts c
    set email_normalized = 'deleted+' || c.id || '@invalid.local',
        business_name = null,
        anonymized_at = now(),
        updated_at = now()
    where c.id in (select contact_id from expired)
      and not exists (
        select 1 from public.inquiries i
        where i.contact_id = c.id and i.anonymized_at is null
      )
  )
  select count(*) into v_count from expired;

  return v_count;
end;
$$;

revoke all on function public.submit_audit_inquiry(text, text, text, text) from public;
revoke all on function public.anonymize_expired_inquiries() from public;
grant execute on function public.submit_audit_inquiry(text, text, text, text) to service_role;
grant execute on function public.anonymize_expired_inquiries() to service_role;
