# lib/whatsapp — Meta WhatsApp Cloud API provider

Source-cited, honest-by-construction adapter for the [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api). Built to the current Graph API **v20.0** (current as of 2026-08). Every outbound path requires an explicit `idempotencyKey`, every inbound path verifies `X-Hub-Signature-256` against the raw body, and every storage path tolerates a missing table without faking success.

## Why this package exists

There were two earlier surfaces:

- `app/api/webhooks/meta/whatsapp/route.js` — webhook receiver wired into the production observability stack.
- `lib/notifications/whatsapp-adapter.mjs` — outbound send adapter used by the notifier worker.

Both ran, but the code structure between them duplicated HMAC verification, retry classification, and template validation. This package consolidates those primitives behind named modules so the existing surfaces can adopt them incrementally while a new, fully documented handler at `app/api/webhooks/whatsapp/route.js` uses them end-to-end.

## Scope

### In scope

- `signature.js` — `X-Hub-Signature-256` HMAC-SHA256 verification over the raw body, plus the `hub.mode` / `hub.verify_token` / `hub.challenge` GET handshake.
- `parse.js` — deterministic parsers for the Cloud API v20.0 webhook payload (`entry[].changes[].value.messages[]`, `statuses[]`, `contacts[]`), and a STOP-keyword opt-out detector.
- `crm.js` — contact identity resolution against `leads` and `owner_leads`. No auto-create, no PII write-through beyond a missing display name. Survives a missing Supabase env.
- `templates.js` — body builders for template + text messages: validates the v20.0 envelope (language codes, header formats, button payload shape) and refuses on invalid shape.
- `meta-client.js` — Graph v20.0 wrapper with safe error code mapping (401/403 → `wa_auth_failed`, 429 → `wa_rate_limited`, 131047 → `wa_window_closed_template_required`, 131051 → `wa_template_unregistered`), bounded timeout, and explicit idempotency-key requirement.
- `app/api/webhooks/whatsapp/route.js` — `GET` challenge + `POST` handler using this package. Returns 200 only on a verified payload; 503 with a diagnostic on missing env / unverified state.

### Out of scope (intentional)

- **Authoring templates in the Meta dashboard** — that's an owner task that requires human login + MFA. The package only sends against names you provide.
- **Auto-creating the migration** — `supabase/migrations/20260818_whatsapp_events.sql` is reviewed-only. The route handler is tolerant of a missing table.
- **Browser-side launches** — the public `app/components/WhatsAppLauncher.js` already reads `NEXT_PUBLIC_WHATSAPP_NUMBER` and shows a "Pending number" badge when not configured. This package does not duplicate that surface.
- **Outbound sends in this revision** — the production outbound path remains `lib/notifications/whatsapp-adapter.mjs`. `meta-client.js` is the v2 wrapper, ready for adoption when the owner deprecates the legacy adapter.

## Environment

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | yes (FAB) | E.164 fallback number. Read by `app/components/WhatsAppLauncher.js`. |
| `META_WA_TOKEN` | yes (sends) | System-user access token. Used by `meta-client.js`. |
| `META_WA_PHONE_ID` | yes (sends) | The phone number ID Meta assigned to your WABA. |
| `META_WA_BUSINESS_ID` | optional (sends) | WhatsApp Business Account ID — only required for business-profile reads. |
| `META_APP_SECRET` | yes (webhook) | Used to verify `X-Hub-Signature-256`. |
| `META_WA_VERIFY_TOKEN` | yes (webhook) | Used to verify the `hub.verify_token` GET handshake. |
| `META_WA_API_VERSION` | optional | Defaults to `v20.0`. |
| `META_WA_TIMEOUT_MS` | optional | Defaults to `8000`. |
| `NEXT_PUBLIC_SUPABASE_URL` | optional (storage) | Required for the durable event sink. |
| `SUPABASE_SERVICE_ROLE_KEY` | optional (storage) | Service-role key — server-only. |

All "yes" marks are noted as being required by either the webhook or the outbound path. A route that is missing a marked var returns `503` (not 200) with a diagnostic so the owner can fix the env. **The package never fakes a successful send.**

### Meta app scopes (Meta App Dashboard)

Required for production use of the new wrapper:

- `whatsapp_business_management` — to read WABA / phone-number metadata.
- `whatsapp_business_messaging` — to send template + text messages.
- `business_management` — only if you pull business-profile data through `fetchBusinessProfile`.

## Current state

The PR ships the **package** (5 modules + 1 route + 1 migration file) and stays consistent with the [no-invention law](#why-this-package-exists): nothing in here pretends the operator has connected the WABA. The route returns 503 with `wa_verify_token_missing` / `wa_app_secret_missing` until the operator configures both Meta secrets.

### Honest-by-construction checklist

- ✅ No fabricated WABA IDs, phone IDs, or business IDs.
- ✅ No faked successful sends — every outbound requires an explicit `idempotencyKey` and only returns `accepted: true` after Graph returns `messages[0].id`.
- ✅ Webhook returns 200 only when the raw body matched HMAC-SHA256 against `META_APP_SECRET`.
- ✅ When the env is missing, webhook returns 503 with a stable `safeErrorCode` so the owner can fix the env without losing visibility.
- ✅ `whatsapp_events` is a review-only migration; the handler degrades to structured logs when the table is absent.
- ✅ STOP keywords (stop / stopall / unsubscribe / cancel / end / quit) are recorded on a separate `meta_opt_outs` table; we never echo them back, never re-message.

## Source citations

- Cloud API v20.0 webhook payload: <https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/>
- Text messages: <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages>
- Template messages: <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/template-messages>
- Message template parameters: <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/message-templates/parameters>
- Media (upload + retrieve): <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/media>
- Phone-numbers metadata: <https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers>
- Opt-out keywords: <https://developers.facebook.com/docs/whatsapp/cloud-api/phone-numbers/opt-out>

## File map

```
lib/whatsapp/
├── README.md         this file
├── signature.js      HMAC verification + GET handshake
├── parse.js          webhook payload parsers + opt-out detector
├── templates.js      template + text body builders
├── crm.js            contact identity resolution + record helpers
└── meta-client.js    Graph v20.0 wrapper

app/api/webhooks/whatsapp/
└── route.js          GET challenge + POST signature-verified handler

supabase/migrations/
└── 20260818_whatsapp_events.sql   REVIEW-ONLY durable sink for events
```
