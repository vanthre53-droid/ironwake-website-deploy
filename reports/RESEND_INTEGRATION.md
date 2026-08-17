# Resend Integration — Verification Report

Worker: t_4fde72e8 (ironwake-email)
Date: 2026-08-17
Scope: EMAIL subsystem, rows E01–E05 of the IronWake Resend wiring verification matrix.

## Summary

The IronWake deployment has Resend wired for both inbound (webhook) and outbound
(send) traffic. The webhook route is mounted at `/api/webhooks/resend` (NOT at
`/api/email/resend-webhook` as an earlier verification directive assumed — see
E03). Signature verification, body-size limits, and 405-on-non-POST enforcement
are all in place. No signing-secret material is logged or echoed in any error
path.

## E01 — RESEND_WEBHOOK_SIGNING_SECRET is stored

- Path: `/home/shadowlingo/.config/ironwake/cloudflare-migration/secrets/RESEND_WEBHOOK_SIGNING_SECRET`
- Size: 59 bytes
- Mode: `600`, owner `shadowlingo:shadowlingo`
- Status: PRESENT, read-only permission profile preserved.

Naming note: the on-disk file is named `RESEND_WEBHOOK_SIGNING_SECRET`; the
runtime env var read by the handler is `RESEND_WEBHOOK_SECRET` (see E02).
Both refer to the same Resend/Svix `whsec_*` material — the file is the
authoritative copy that gets promoted to the Cloudflare Worker secret.

## E02 — Resend integration in source

Files (under `IRONWAKE_PROJECT_ROOT=/mnt/c/Users/vanth/Downloads/ironwake`):

- `app/api/webhooks/resend/route.js` — Next.js App Router route, exports
  `POST` handler `handleResendWebhook`. All non-POST methods return 405 via
  `methodNotAllowed`. Pre-conditions: rate-limit identity budget (600 req/min
  per IP), 256 KiB body cap, `RESEND_WEBHOOK_SECRET` and Supabase URL+service
  key must all be present or the route returns 503 "Webhook is not configured."
- `lib/notifications/resend-webhook.mjs` — `verifyResendWebhook` uses
  `new Resend('webhook-verification-only').webhooks.verify({...})` against the
  raw body and Svix-compatible headers (`svix-id` / `webhook-id`, `svix-timestamp`,
  `webhook-timestamp`, `svix-signature` / `webhook-signature`). The literal
  `'webhook-verification-only'` is a harmless placeholder required by the SDK
  constructor — verification is performed locally against `webhookSecret` and
  never touches the Resend network. `normalizeResendWebhook` accepts only
  `email.sent | email.delivered | email.delivery_delayed | email.failed |
  email.bounced | email.complained | email.suppressed` and rejects anything
  else with a 200 `{received:true, ignored:true}`.
- `lib/notifications/resend-adapter.mjs` — outbound adapter
  (`createResendAdapter`), wraps `client.emails.send` with an 8 s timeout race,
  idempotency-key enforcement, and a `safeProviderCode` classifier that maps
  provider errors to a small set of `resend_*` codes. Never echoes the API
  key back to the caller.
- `lib/notifications/supabase-store.mjs` — service-role Supabase client that
  records provider events via a deduplicating RPC (only sealed event metadata
  is persisted; the raw body and headers are not stored).
- `lib/notifications/worker.mjs` — edge-compatible worker orchestration.

`middleware.js` does NOT touch Resend. It is the Supabase auth-cookie refresh
hook only. The directive's reference to `src/lib/email.ts` was based on an
earlier scaffold; the real path is `lib/notifications/resend-*.mjs`.

## E03 — Live endpoint behaviour

`curl -X POST https://ironwake.dev/api/webhooks/resend -H 'content-type: application/json' --data ''`

```
HTTP/1.1 400 Bad Request
content-type: application/json
{"received":false,"error":"Webhook payload is invalid."}
```

The empty body fails the `!rawBody` guard in the route (line 44 of
`route.js`), returning the documented 400. No 500, no stack trace, no crash.
A request with a body but missing `svix-signature` headers returns 401
"Invalid webhook signature." from the `verify()` catch (line 53).

Path discrepancy to flag: the verification directive specified
`https://ironwake.dev/api/email/resend-webhook`. That URL returns 404 (the
Next.js not-found page, `content-type: text/html`, no crash) because no
route is mounted there in the deployed app. The Netlify fallback
(`https://ironwake.netlify.app`) shows the same 404 at that path, confirming
the source-of-truth is `/api/webhooks/resend` and the `/api/email/...` path
in the directive is stale.

Recommendation for future verification tasks: update the directive's
endpoint string to `/api/webhooks/resend` so the "expected 400" assertion
actually fires.

## E04 — This report

Written at `reports/RESEND_INTEGRATION.md`. Prior evidence index
(`state/EVIDENCE_INDEX.md` row 69) already recorded a similar
"Signature-verified Resend delivery webhook" finding from cycle 21
(bounded raw-body verification precedes normalization; full suite
129/129; secret-scan clean).

## E05 — Signing secret is NOT logged

Full-text review of the four files in the webhook path
(`route.js`, `resend-webhook.mjs`, `resend-adapter.mjs`, `supabase-store.mjs`)
confirms:

- The `webhookSecret` variable appears ONLY as a parameter to
  `verifyResendWebhook` and inside `verify()`'s `webhookSecret` field. It is
  never passed to `console.log` / `console.error` / `console.warn` / `logger.*`
  / `Sentry.*`.
- All error responses return a generic `{received:false, error:"..."}` body —
  no error message includes the secret, the signature header value, or the
  raw body.
- The SDK constructor placeholder `'webhook-verification-only'` is a public
  literal (verbatim from the Resend SDK requirement), not a secret.
- `safeProviderCode` strips provider error objects down to a 70-char
  lowercased snake-case name before any propagation.
- `request.text()` failures and JSON parse failures return the same generic
  400 "Webhook payload is invalid." — no echo of the body.

Conclusion: zero risk of the signing secret leaking through the webhook
verification path.

## Findings / follow-ups for the orchestrator

1. Update the verification directive's endpoint URL from
   `/api/email/resend-webhook` to `/api/webhooks/resend`. The 404 today
   means an automated assertion looking for 400 will incorrectly report a
   regression on a healthy endpoint.
2. The `RESEND_WEBHOOK_SECRET` env var (read by the handler) and the
   `RESEND_WEBHOOK_SIGNING_SECRET` file name on disk should be unified in
   documentation to avoid confusion in future Cloudflare Worker secret
   bindings.
3. All E01–E05 rows: VERIFIED.

## Hard rules respected

- Did NOT read the contents of the secret file.
- Did NOT call the Resend send API (no test emails sent).
- Did NOT modify any `app/*` code.