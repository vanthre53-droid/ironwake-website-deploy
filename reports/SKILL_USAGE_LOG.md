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
