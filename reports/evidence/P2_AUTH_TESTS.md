# P2 Auth Tests

Status: `PARTIAL — OWNER AUTH/MFA ATTESTED; RLS POLICY PATH VERIFIED; LIVE SESSION NOT_RUN`

The schema has owner-only RLS policies based on `auth.jwt() -> 'app_metadata' ->> 'role'`. Revanth Nunna attested that the Supabase owner Auth/MFA setup is complete. `/owner` uses only the public Supabase URL/anon key to sign in/out and does not expose a service-role credential.

The wrong-role RLS test returned zero rows across all six private tables. The simulated owner claim could read aggregate records. Anonymous select privilege remains revoked. Migration `005_grant_owner_crm_access.sql` supplies required authenticated table grants while RLS remains the owner boundary.

Not run: authenticated owner login, MFA challenge, recovery, session revocation, expired-session, and live direct-object tests. No claim is made that the owner role claim or MFA challenge has been independently read back.

## M2 remediation note (2026-07-31)

C2-F2 required live session verification. This was not performed because no credential-holder interaction occurred in this session. The Supabase Auth/MFA completion remains human-attested only. The RLS policy path (wrong-role returns zero rows, anonymous select revoked) was previously verified via SQL simulation. The `/owner` and `/admin` pages correctly gate on Supabase Auth client-side and do not expose service-role keys.

Resolution: PARTIAL — cannot close C2-F2 without credential-holder action. Honest status maintained.
