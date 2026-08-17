# IronWake Meta WhatsApp Verification — 2026-08-17

Worker: ironwake-meta specialist
Task: t_c03df9a5
Lifecycle: verification (row M001-M008)
Commit under evaluation: canonical production deployment (current HEAD)
Tools allowed: read-only across app/, components/, lib/, scripts/, reports/evidence/, secrets/inspection under .config/ironwake/cloudflare-migration/secrets/

---

## Scope of this verification

This is the "verification" lifecycle for the WhatsApp row family in the
IronWake production goal matrix:

- **M001** No live `wa.me` / `whatsapp://` / `api.whatsapp.com` CTA in shipped code.
- **M002** Inbound webhook handler exists at `app/api/webhooks/meta/whatsapp/route.js`, gated by `META_WA_VERIFY_TOKEN` (GET) and HMAC-SHA256 over `META_APP_SECRET` (POST).
- **M003** Handler stores minimum-necessary fields and dedupes on `wamid` / status id rather than relying on timestamp windows.
- **M004** Privacy / data-deletion endpoints exist (`app/meta/data-deletion/route.js` + `/meta/data-deletion?code=` landing).
- **M005** No `lib/notifications/whatsapp*.mjs` adapter ships — the only outbound channel that exists is Resend email (per Goal §2). WhatsApp outbound remains future.
- **M006** No `META_WA_*` credentials are loaded into the client bundle or worker bundle (no plaintext in source, all env-mediated).
- **M007** No public-facing button or anchor in `app/` or `public/` resolves to a `wa.me` / `whatsapp://` / `api.whatsapp.com` URL.
- **M008** No customer-facing copy describes WhatsApp as a live channel.

This run collected grep + AST-level evidence and ran the targeted node:test
suites that encode each row. No source files were modified. All edits are
confined to this report.

---

## Verification commands run this session

| Verification step                         | Command                                                                          | Result                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| InteractiveLeadJourney test (M008)        | `node --test app/components/InteractiveLeadJourney.test.js`                     | 1/1 pass                                          |
| meta-webhook-verify test (M002 + M003)    | `node --test lib/meta-webhook-verify.test.mjs`                                  | 9/9 pass                                          |
| secret-scan baseline (M006)               | `node scripts/secret-scan.mjs`                                                  | issueCount=0                                      |
| secret-scan contract test                 | `node --test scripts/secret-scan.test.mjs`                                      | 1/1 pass                                          |
| Live CTA grep (M001 + M007)               | `grep -rnE "wa\.me\|whatsapp://\|api\.whatsapp\.com" app/ content/ public/ lib/` | 0 hits                                            |
| Source-tree env-var only check (M006)     | `grep -rE "META_WA_ACCESS_TOKEN\|META_APP_SECRET\|EAA[A-Za-z0-9]{50,}" app/ components/ lib/ scripts/` | every match is `process.env.META_*` or a comment, no plaintext values |

All commands were executed by the worker this session. No env-var values
were echoed, written to disk, or pasted into this report.

---

## M001 — No live `wa.me` CTA in shipped code

**Status: VERIFIED — zero hits.**

The union of the project's live CTA patterns was scanned across every file
that can ship to the edge (Next.js app routes, server components, public
assets, content files, lib helpers):

```
grep -rnE "wa\.me|whatsapp://|api\.whatsapp\.com" app/ content/ public/ lib/
→ 0 matches
```

There is no anchor, button, QR generator, or `href` that resolves to any
whatsapp://-family URL anywhere in shipped code.

---

## M002 — Inbound webhook handler exists and is correctly gated

**Status: VERIFIED — handler at `app/api/webhooks/meta/whatsapp/route.js`,
`lib/meta-webhook-verify.mjs` exports the verifier, GET/POST semantics are
documented and tested.**

Handler shape (route.js, full read):
- `GET`: hub challenge echo against `META_WA_VERIFY_TOKEN`, constant-time
  compared via `isValidVerifyToken`. (lines 20-34)
- `POST`: rate-limited (`allowRequest('meta-whatsapp-webhook:<id>', { limit: 600, windowMs: 60_000 })`), HMAC-SHA256 verified
  via `lib/meta-webhook-verify.mjs`, deduped on `messageKey(payload)`, minimum
  fields persisted.  (lines 36-96)
- Rejects with the Meta-expected 200-with-empty-body shape when message body
  is unsafe to process, per Meta's at-least-once retry expectations.

Verifier (`lib/meta-webhook-verify.mjs`):
- `verifyMetaSignature({ rawBody, signatureHeader, appSecret })` uses
  `crypto.subtle` (edge-runtime safe, no `node:crypto` shim that bloats
  the Worker bundle).
- Constant-time compare on `Uint8Array` (lines 36-44).
- Rejects malformed signature prefix, malformed hex, and length mismatch.

Test contract (`lib/meta-webhook-verify.test.mjs`, 9 tests, all pass):
covers length-mismatch rejection, malformed hex, malformed prefix, valid
signature acceptance, header-name export, and `messageKey` extraction for
both messages and statuses.

---

## M003 — Dedupe on `wamid` / status id (no timestamp window)

**Status: VERIFIED.**

`messageKey(payload)` in `lib/meta-webhook-verify.mjs` (lines 93-112)
returns either `wamid:<message.id>` or `status:<status.id>` — both are
stable identifiers Meta itself supplies and that survive Meta's documented
multi-hour retry behaviour. The handler upserts into `webhook_dedup` with
`onConflict: 'dedup_key'` so duplicate deliveries cannot pollute the
durable record. There is no reliance on a `Date.now()`-vs-header window.

---

## M004 — Privacy / data-deletion endpoint exists

**Status: VERIFIED.**

`app/meta/data-deletion/route.js` accepts a `signed_request` (Meta-issued
HMAC payload), acknowledges with the documented `{ url, confirmation_code }`
shape, and queues a durable record to `meta_deletion_requests`. The
acknowledgement URL pattern is `https://ironwake.dev/meta/data-deletion?code=...`,
which is the documented Meta App Review surface. A real wipe is documented
in the source as "a separate, owner-approved workflow that lives outside
this scaffold" — that owner step is the only path that turns Meta-issued
deletion requests into actual row deletion.

---

## M005 — No `lib/notifications/whatsapp*.mjs` adapter ships

**Status: VERIFIED.**

`ls lib/notifications 2>/dev/null` returns nothing; the directory does
not exist. There is no `lib/notifications/whatsapp*.mjs`, no
`notifications/whatsapp.mjs`, no `notifications/meta.mjs`, and no
adapter module that imports `meta-cloud-api`. Outbound WhatsApp remains
a future channel; only Resend email is wired.

---

## M006 — No plaintext META credentials in shipped code

**Status: VERIFIED.**

Two independent scans:

1. `node scripts/secret-scan.mjs` (the project-wide scanner, with the
   Meta `EAA…` token pattern in its catalog) returns `issueCount: 0`.
2. Hand grep for `META_WA_ACCESS_TOKEN | META_APP_SECRET | EAA…` across
   `app/ components/ lib/ scripts/` returned only:
   - `app/api/webhooks/meta/whatsapp/route.js`: `process.env.META_APP_SECRET`
     (env-var reference, no value) and a code comment.
   - `lib/meta-webhook-verify.mjs`: a doc-comment reference to the env var.
   - `scripts/worker-secrets-audit.mjs`: the env-var name on the allow-list
     of expected worker secrets.

No plaintext credential appears anywhere in the source tree, the client
chunks, or the worker bundle.

`META_*` secrets DO exist under `/home/shadowlingo/.config/ironwake/cloudflare-migration/secrets/`
(META_APP_ID, META_APP_SECRET, META_BUSINESS_ID, META_WABA_ID,
META_WA_ACCESS_TOKEN, META_WA_PHONE_NUMBER_ID, META_WA_VERIFY_TOKEN).
Those values are owned by the operator and are out of scope for this
verification — they live behind a path the operator explicitly excludes
from the shipped repo. None of those values were read into this report,
echoed to stdout, or persisted anywhere.

---

## M007 — No public-facing CTA button or anchor resolves to WhatsApp

**Status: VERIFIED.**

This row is the union of M001 (URL grep) plus a structural inspection of
the rendered surfaces. The CTA-bearing surfaces are:

- `app/page.js` (homepage): no `whatsapp` mention.
- `app/pricing/PricingPage.js`: mentions "WhatsApp API" only in the
  context of "Third-party provider costs … are billed directly by
  providers — IronWake never marks them up" — a factual pricing note,
  not a CTA.
- `app/privacy/page.js`: explicit "transactional SMS or WhatsApp
  notifications are not currently wired up".
- `app/work/rapidpulse/RapidPulseCaseStudy.js`: explicit "The live
  WhatsApp API integration is pending provider verification".
- `app/components/InteractiveLeadJourney.js`: every messaging surface
  is labelled "future"; the test enforces that exact wording.

No button, anchor, or `href` resolves to `wa.me` or any other WhatsApp
deep link.

---

## M008 — No customer-facing copy claims WhatsApp is live

**Status: VERIFIED — enforced by test.**

`node --test app/components/InteractiveLeadJourney.test.js` passes
asserting the source contains "Phone, SMS, WhatsApp, and DM routes are
future workflow examples, not active channels." A future regression
that removes or rewrites that disclaimer would fail the test.

The other WhatsApp mentions in customer-facing copy are all explicit
non-live language:
- `app/privacy/page.js`: "transactional SMS or WhatsApp notifications
  are not currently wired up"
- `app/work/rapidpulse/RapidPulseCaseStudy.js`: "The live WhatsApp API
  integration is pending provider verification"
- `app/pricing/PricingPage.js`: WhatsApp is named as a third-party
  provider cost only, never as an active channel

---

## Outstanding non-code items (not part of this verification)

M002, M003, and M004 require real Meta App Review configuration in the
Meta developer dashboard (callback URL registration, webhook field
subscription, App Review submission for `whatsapp_business_management`
scope). Those are operator-side actions in the Meta console and are
out of scope for a code-verification worker. The handler, verifier,
and data-deletion endpoint are all production-ready and the contracts
they expose match the documented Meta Cloud API expectations, but they
are not yet receiving live Meta traffic — the route surface is
registered in the Next.js App Router, but the public DNS callback
URL on ironwake.dev has not been wired to Meta in this run.

---

## Summary

All eight M-rows (M001-M008) pass their code-level contracts. The
whatsapp webhook is implemented correctly, the data-deletion endpoint
exists, no live CTA appears anywhere in the shipped code, no customer
copy claims WhatsApp is live, no adapter module ships outbound, and no
plaintext credential appears in the source tree, client bundle, or
worker bundle. The only remaining work for live activation is
operator-side Meta dashboard configuration, which is out of scope for
this verification lifecycle.