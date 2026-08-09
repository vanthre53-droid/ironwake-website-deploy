-- Owner-only notes and an auditable activity timeline. Notes remain private
-- CRM data; no email, provider, or customer-facing side effect occurs here.

create table if not exists public.owner_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists owner_notes_inquiry_created_idx
  on public.owner_notes(inquiry_id, created_at desc);

alter table public.owner_notes enable row level security;
revoke all on table public.owner_notes from public, anon, authenticated;
grant select on table public.owner_notes to authenticated;

drop policy if exists owner_can_read_owner_notes on public.owner_notes;
create policy owner_can_read_owner_notes on public.owner_notes
  for select to authenticated
  using ((select public.is_owner()));

create or replace function public.owner_add_inquiry_note(
  p_inquiry_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_note_id uuid;
  v_body text := btrim(coalesce(p_body, ''));
begin
  if not (select public.is_owner()) then
    raise exception 'owner_authorization_required';
  end if;

  if char_length(v_body) not between 1 and 2000 then
    raise exception 'note_invalid';
  end if;

  perform 1 from public.inquiries where id = p_inquiry_id;
  if not found then
    raise exception 'inquiry_not_found';
  end if;

  insert into public.owner_notes (inquiry_id, body)
  values (p_inquiry_id, v_body)
  returning id into v_note_id;

  insert into public.audit_logs (inquiry_id, action, actor_type, metadata)
  values (p_inquiry_id, 'owner_note_added', 'owner', jsonb_build_object('note_id', v_note_id));

  return v_note_id;
end;
$$;

revoke all on function public.owner_add_inquiry_note(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.owner_add_inquiry_note(uuid, text) to authenticated;
