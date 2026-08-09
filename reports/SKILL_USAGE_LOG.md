# Skill Usage Log

- Phase: C1 architecture/research
- Date: 2026-07-28
- Harness: OpenCode
- Skills invoked: none
- Discovery: repository and available skill paths were inspected; no compatible skill was required for this read-only C1 checkpoint.
- Side effects: none. No third-party skill script, provider, account, publication, message, or deployment action was executed.

## 2026-08-09 — P0.1 real capability audit

- Phase: C1 real-product reconstruction
- Harness: Codex
- Skill invoked: official Supabase skill v0.1.2
- Why: the current programme requires live schema, Auth, RLS, function-ACL, migration, and advisor evidence instead of source-only inference.
- Actions: read the skill fully; checked the current Supabase breaking-change index; used read-only table, migration, aggregate-state, Auth-factor, function-ACL, and advisor queries against project `ipcpthmmcdtshbbsirwj`.
- Result: identified live migration drift, role-only owner policies, privileged anonymous RPC execution, zero verified owner MFA factors, 36 unprocessed outbox rows, and zero completed AI triage rows.
- Side effects: none. No migration, account change, secret readout, customer data row, send, publication, or deployment mutation occurred.

## 2026-08-09 — P0.9 authorization/RPC remediation

- Phase: M1 live security repair
- Harness: Codex
- Skill invoked: official Supabase skill v0.1.2
- Why: the sealed task required a forward migration plus live migration, RLS-policy, function-ACL, row-count, and advisor verification.
- Actions: used the pinned official Supabase CLI (`2.113.0`) only to scaffold the timestamped migration, reviewed and tested the SQL locally, applied it with the connected Supabase migration surface, then ran split read-only policy/ACL/count/advisor checks.
- Result: live migration `20260809101715` verified; all six policies use the canonical role-plus-email predicate; browser-role execution is removed from privileged functions; targeted security-advisor findings cleared; customer-table counts unchanged.
- Side effects: one approved forward authorization migration. No credential readout, customer-row mutation, send, provider connection, publication, payment, or deployment.
