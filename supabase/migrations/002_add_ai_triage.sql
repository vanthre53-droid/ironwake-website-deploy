alter table public.inquiries
  add column if not exists triage_status text not null default 'pending'
    check (triage_status in ('pending', 'complete', 'needs_human', 'provider_error')),
  add column if not exists triage_needs_human boolean not null default true,
  add column if not exists triage_priority text not null default 'normal'
    check (triage_priority in ('low', 'normal', 'high', 'urgent')),
  add column if not exists triage_category text not null default 'other'
    check (triage_category in ('inquiry', 'booking', 'follow_up', 'reception', 'other')),
  add column if not exists triage_summary text,
  add column if not exists triage_suggested_reply text,
  add column if not exists triage_model text,
  add column if not exists triaged_at timestamptz;
