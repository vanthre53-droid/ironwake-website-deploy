grant select, insert, update, delete on table public.inquiries to authenticated;
grant select, insert, update, delete on table public.contacts, public.consents, public.tasks, public.outbox_events, public.audit_logs to authenticated;
