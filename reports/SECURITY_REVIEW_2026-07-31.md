# Security Review — 2026-07-31

Status: `PARTIAL — NO RELEASE APPROVAL`
Scope: local source and dependency review only. This is not the required independent C2 audit or a penetration test.

## Findings

### [SEV 3] Dependency advisories block a release candidate

Attacker story: a production deployment using the currently installed `next@16.2.12` transitively ships `postcss@8.4.31` and `sharp@0.34.5`, which `npm audit --omit=dev --audit-level=critical` reports with three high-severity advisories.

Location: `package-lock.json` dependency tree.

Required remediation: choose and approve a supported Next.js upgrade path, update the lockfile, then rerun the audit, tests, build, and production smoke checks. Do not use the audit's forced downgrade recommendation.

Verification: `npm audit --omit=dev --audit-level=critical` exits 0 with no critical/high release-blocking advisories, and `npm test && npm run build` passes.

## Passed local checks

- `SUPABASE_SERVICE_ROLE_KEY` is read only by the Node.js server route; no sensitive environment variable uses the `NEXT_PUBLIC_` prefix.
- OpenAI triage is server-only, has an eight-second timeout, validates a strict structured result, and fails closed to human review.
- The audit endpoint validates JSON, required consent, and honeypot input before persistence; missing runtime configuration returns a truthful 503.
- `public.inquiries` has RLS enabled, `anon` and `authenticated` grants revoked, and the owner policy includes both `USING` and `WITH CHECK`.

## Not run

- Auth/RLS attacker, BOLA, expired-session, webhook-signature, rate-limit, backup/restore, and provider tests remain blocked until named G2/G4 approval and configured test environments.
- The legacy `website/` prototype uses `innerHTML`, but only with constant page content and fixed route keys; `app/` is the production runtime.
