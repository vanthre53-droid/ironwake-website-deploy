-- Durable metadata only for each inquiry's latest AI triage attempt.
-- Never persist provider prompts, completion text beyond the existing approved
-- owner-visible summary/reply fields, credentials, or raw provider responses.

alter table public.inquiries
  add column if not exists triage_provider text check (triage_provider is null or char_length(triage_provider) between 1 and 50),
  add column if not exists triage_error_code text check (triage_error_code is null or char_length(triage_error_code) between 1 and 100),
  add column if not exists triage_attempted_at timestamptz;

create index if not exists inquiries_triage_attempted_at_idx
  on public.inquiries(triage_attempted_at desc)
  where triage_attempted_at is not null;
