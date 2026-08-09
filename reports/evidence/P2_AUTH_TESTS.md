# P2 Auth Tests

Status: `PARTIAL — LIVE RLS/RPC CONTROL VERIFIED; OWNER MFA/SESSION NOT_RUN`

The live schema now has owner-only RLS policies based on one canonical role-plus-designated-email predicate. A prior owner Auth/MFA completion attestation is contradicted by the current provider readback of zero verified factors. `/owner` uses only the public Supabase URL/anon key to sign in/out and does not expose a service-role credential.

The wrong-role RLS test returned zero rows across all six private tables. The simulated owner claim could read aggregate records. Anonymous select privilege remains revoked. Migration `005_grant_owner_crm_access.sql` supplies required authenticated table grants while RLS remains the owner boundary.

Not run: authenticated owner login, MFA challenge, recovery, session revocation, expired-session, and live direct-object tests. No claim is made that the owner role claim or MFA challenge has been independently read back.

## M2 remediation note (2026-07-31)

C2-F2 required live session verification. This was not performed because no credential-holder interaction occurred in this session. The Supabase Auth/MFA completion remains human-attested only. The RLS policy path (wrong-role returns zero rows, anonymous select revoked) was previously verified via SQL simulation. The `/owner` and `/admin` pages correctly gate on Supabase Auth client-side and do not expose service-role keys.

Resolution: PARTIAL — cannot close C2-F2 without credential-holder action. Honest status maintained.

## Live authorization and privileged-RPC remediation (2026-08-09)

Status: `VERIFIED_LIVE CONTROL; OWNER MFA/SESSION STILL PARTIAL`

Forward migration `20260809101715_secure_owner_and_privileged_rpcs` is applied to Supabase project `ipcpthmmcdtshbbsirwj`. The checked-in source is `supabase/migrations/20260809101143_secure_owner_and_privileged_rpcs.sql`; Supabase assigned the live migration version when applying it.

The migration is authorization-only and changed no customer row. Before and after counts agree: 38 inquiries, 29 contacts, 36 consents, 36 tasks, 36 outbox events, and 44 audit logs.

Live readback verifies:

- `public.is_owner()` is `SECURITY INVOKER` and requires both `app_metadata.role = owner` and the designated owner email.
- Each of `inquiries`, `contacts`, `consents`, `tasks`, `outbox_events`, and `audit_logs` has one `authenticated` `ALL` policy whose `USING` and `WITH CHECK` clauses call `(select is_owner())`.
- `anon` and `authenticated` cannot execute `submit_audit_inquiry`, `anonymize_expired_inquiries`, or `rls_auto_enable`.
- Among application roles, only `service_role` retains execution of intake and retention; `postgres` retains function-owner/database-administration access and event-trigger execution. Only `authenticated` can execute the safe RLS predicate.
- Supabase's prior anonymous/authenticated `SECURITY DEFINER` advisor findings are gone. The remaining security warning is the separately gated leaked-password-protection setting: [Supabase password protection guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- Remaining performance notices are informational missing-FK-index and unused-index findings, outside this security-only task: [Supabase database linter guidance](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys).

Local evidence: focused migration tests 5/5; expanded normal suite 102/102; Next.js 16.2.12 production build completed with 39 generated routes. Enabling the previously omitted `whoami` test first exposed two stale test-path failures; the bounded repair removed a forbidden credential-name string from a source comment and used Node-resolvable `next/server.js`. Focused `whoami` tests then passed 2/2 and the production build verified framework compatibility.

No credentials were printed, no production row was inserted/updated/deleted/anonymized, and no email, provider, publication, payment, or deployment action occurred. This closes `IW-P0-SEC-01`; it does not close owner MFA, recovery, expired-session, authenticated browser-session, or direct-object verification.
