# P2 Schema and RLS Evidence

Status: `PARTIAL — CRM DURABILITY CORE VERIFIED; OWNER AUTH REMAINS PENDING`

## Applied migrations

- `001_create_inquiries.sql` and `002_add_ai_triage.sql` were already applied.
- `003_owner_crm_core.sql` was applied to Supabase project `ipcpthmmcdtshbbsirwj` after G2 approval.
- The first controlled submission exposed an invalid PostgreSQL interval literal in the due-date expression. No incomplete CRM rows were created. `004_fix_task_due_date.sql` was applied as the forward repair; the source migration was corrected for fresh databases.

## Verified

- All six private tables have RLS enabled: `contacts`, `inquiries`, `consents`, `tasks`, `outbox_events`, and `audit_logs`.
- Each of those tables has one owner policy; `anon` and `authenticated` privileges are revoked from the new private tables.
- The public audit API calls `submit_audit_inquiry`, which atomically creates one inquiry, consent, review task, queued outbox event, and audit-log event.
- The authorized synthetic request returned HTTP 201. Readback showed one record in each of inquiry, consent, task, queued-outbox, and audit-log paths.
- The synthetic record was subsequently anonymized. A readback found no active synthetic-email record.

## Known limitations

- Supabase Auth owner account, MFA, recovery, session revocation, and negative authorization tests are not yet configured or verified.
- No email worker/provider send was run; the queued outbox event is not delivery proof.
- The next-business-day calculation excludes holidays and is deliberately limited to weekdays.

## Final local verification

`scripts/validate-state.sh`, `scripts/validate-execution-pack.sh`, `git diff --check`, `npm test` (15 passing), `npm run build`, and a hard-coded credential-value diff scan all passed after the forward repair.
