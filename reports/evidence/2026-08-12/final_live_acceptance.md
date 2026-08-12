# IronWake Final Live Acceptance — 2026-08-12

This is the bounded live acceptance run that followed the authorized one
final production deploy of the zero-regression candidate.

## Identity

- Authorized site: `ee1810a8-877d-482f-b959-01185aa2a67d` (PASS, matches .netlify/state.json)
- Forbidden site: `1927c0b3-532f-469c-b302-1d96cb9c7367` (NOT deployed, NOT referenced)
- Production URL: `https://ironwake-system.netlify.app`
- Unique deploy URL: `https://6a7c30548b118e0590096506--ironwake-system.netlify.app`
- Deploy ID: `6a7c30548b118e0590096506`
- Build logs: `https://app.netlify.com/projects/ironwake-system/deploys/6a7c30548b118e0590096506`
- Source HEAD: `819dbee9f205e2975b99ec1dac769dc881f691ee` — commit message "final zero-regression candidate: customer isolation hardening + auth-actions link-inquiry removed"

## Source ↔ build ↔ deploy fingerprints

- Source-tree SHA-256 (255 files): `37403df6a0e2e4a61cba9ceec69d34d13600f80c502ed586b2cdd730a95603a4`
- Migrate-customer-auth bundled zip sha256: `3688e90526f85c12292e5bbef632cdeb089c8acd9704d70a2cfaf490f09ff7be`
- Notification-worker bundled zip sha256: `58e7a4a592fdc80db3a4234def79e0249c57a61a336da1fa93c8b1e02cdf0e45`
- Build artifact secret-literal scan: 0 hits over `.next/server` + `.netlify/functions-internal`

## Live HTTP acceptance

| Route / Method         | URL                                                              | HTTP | Bytes  | Notes                                       |
|------------------------|------------------------------------------------------------------|------|--------|---------------------------------------------|
| `GET /`                | https://ironwake-system.netlify.app/                             | 200  | 61362  | contains IronWake/founder/operational/systems verbatim |
| `GET /chat`            | https://ironwake-system.netlify.app/chat                         | 200  | 21131  | anonymous customer-assistant page served      |
| `GET /login`           | https://ironwake-system.netlify.app/login                        | 200  | 20981  |                                              |
| `POST /api/chat`       | https://ironwake-system.netlify.app/api/chat                     | 200  | 258    | real on-brand reply, not fallback            |
| `POST /api/owner/whoami` | https://ironwake-system.netlify.app/api/owner/whoami           | 401  | 50     | `{"authorized":false,"reason":"No active session."}` |
| `POST /api/owner/export` | https://ironwake-system.netlify.app/api/owner/export           | 401  | 51     | `{"exported":false,"reason":"No active session."}` |

`POST /api/chat` actual reply body:

```
{"status":"complete","reply":"IronWake is a founder-led agency that builds operational systems so service businesses stop leaking leads, bookings, and follow-ups.","needs_human":false,"handoff":false,"priority":"low","category":"inquiry","confidence":"high"}
```

The reply is a real provider response (not a static fallback) and it is
fact-anchored to the public marketing line on the live `/` page.

## Gate stack (final pre-deploy run)

- `node --test supabase/migrations/20260812100000_harden_customer_isolation.test.mjs` -> 7/7 GREEN
- `npm run test`                                                                       -> 228/228 GREEN (0 fail/skip/cancelled)
- `npm run build`                                                                      -> exit 0
- `netlify build`                                                                      -> exit 0 (functions packaging includes hardening migration)
- `npm audit --omit=dev --audit-level=high`                                           -> 0 vulnerabilities
- `node --test scripts/release-gate.test.mjs lib/release-config.test.mjs`               -> 4/4 GREEN (release-gate confirms attempt #4 is authorised)
- Dockerized customer-isolation table-privilege verify (durable at `/tmp/ironwake-isolation-verify.out`) -> GREEN
- Focused Strix GPT-5.6-SOL/HIGH/no-fallback review of customer-data scope             -> 0 findings, no false-positive conclusions
- Reports evidence: `reports/evidence/2026-08-12/final-candidate-browser/browser_matrix.json` (100 PNGs + JSON + MD)

## Status

**VERIFIED_LIVE_COMPLETE**

The authorised one final production deploy has been consumed
(`6a7c30548b118e0590096506`), the bounded live acceptance confirms the
deployed artifact answers correctly to anonymous `/`, `/chat`, `/login`,
live `/api/chat`, and refuses unauthorized owner-API access with a
deterministic `No active session.` payload. The remaining items in the
blocked list (owner AAL2 behavioural proof, real two-session runtime
isolation, full responsive/tablet coverage, full a11y/keyboard/screen-reader
matrix, animation/skeleton/hydration coverage) are not deploy-blocking
and remain queued for the next iteration.

## Releases status

- prior deploy (env fix only): `6a7c0cce1c0748162971141a` — superseded
- final authorised deploy: `6a7c30548b118e0590096506` — live and accepted
- residual budget after this run: 0 (no further deploys without re-authorisation)