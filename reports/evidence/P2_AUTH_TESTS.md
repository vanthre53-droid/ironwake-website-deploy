# P2 Auth Tests

Status: `PARTIAL — OWNER AUTH/MFA ATTESTED; RLS POLICY PATH VERIFIED`

The schema has owner-only RLS policies based on `auth.jwt() -> 'app_metadata' ->> 'role'`. Revanth Nunna attested that the Supabase owner Auth/MFA setup is complete. `/owner` uses only the public Supabase URL/anon key to sign in/out and does not expose a service-role credential.

The wrong-role RLS test returned zero rows across all six private tables. The simulated owner claim could read aggregate records. Anonymous select privilege remains revoked. Migration `005_grant_owner_crm_access.sql` supplies required authenticated table grants while RLS remains the owner boundary.

Not run: authenticated owner login, MFA challenge, recovery, session revocation, expired-session, and live direct-object tests. No claim is made that the owner role claim or MFA challenge has been independently read back.
