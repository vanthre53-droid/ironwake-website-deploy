# C1 Provider and External-Action Matrix

- Prepared: 2026-07-27; transactional-email decision refreshed 2026-08-09
- Status: Resend Free is selected for the provider adapter under the current owner programme and prior Resend test-only direction. No Resend account, domain, secret, webhook, production send, or delivery is connected or proven.
- Freshness: current official Resend, Netlify, and Supabase documentation plus current npm registry metadata were read on 2026-08-09.

| Capability | C1 recommendation | Current truth | Required approval/evidence | Launch disposition |
|---|---|---|---|---|
| Database and auth | Supabase Postgres/Auth with RLS, subject to G1/G2 approval | Account, owner, region, budget, and connection unknown | G1 stack approval; G2 empty/upgrade migration, RLS negative tests, auth/recovery tests | Deferred until G1/G2 |
| Hosting and preview | Preserve current Netlify runtime; use a scheduled function only after plan/usage readback | Netlify serves production, but repository linkage, environment storage, plan/usage, and reproducible deployment are unproved | G5 exact preview/commit, plan hard-cap readback, environment names, and rollback proof | Current deployment live; future deployment gated |
| Transactional email | Resend Free behind a provider-neutral adapter; direct server-side API plus signed webhooks | No email provider SDK/account/domain/secret is configured. Owner and public mailboxes are approved for distinct roles | Code selection approved; G4 still requires adult account/terms ownership, API key, owned-domain DNS proof, signed webhook, controlled send/delivery/failure readback | `SELECTED_CODE_ONLY`; connection and sends pending |
| WhatsApp | Inbound/owner-notification path only if consent, number, templates, and provider proof exist | No IronWake number, public URL, consent record, or provider approval verified | G1/G4 owner, number, consent, current Meta rules, signed webhook and opt-out tests | Deferred |
| Calendar | Request state only; confirmation requires owner or authoritative callback | Account, calendar, hours, timezone, and booking rules unknown | G1/G4 account owner, scoped access, duplicate/replay/failure tests | Deferred |
| Voice | Bounded demonstration or pilot only if separately approved | Number, provider, disclosure, consent, billing, and test proof unknown | G1/G4 provider, disclosure, consent, human handoff, latency/failure evidence | Deferred |
| Payments | Exclude from first implementation queue | Legal owner, KYC, tax, refund, currency, and provider unknown | Adult/legal approval, G1/G4 provider decision, hosted checkout, signed webhook, reconciliation | Excluded |
| Analytics | Privacy-minimised, consent-aware option only | Domain, consent regions, owner, and vendor unknown | G1/G4 data-processing and consent decision; no private CRM fields | Deferred |
| Error monitoring | Add only after data-minimisation and redaction review | Vendor, region, owner, and retention unknown | G1/G4 monitoring approval; redaction and access evidence | Deferred |

## Adapter contract

Every enabled external adapter must be server-only, schema-validated, timeout-bounded, idempotent, redaction-safe, and represented by a provider-neutral result:

```text
accepted, providerEventId?, status(accepted|delivered|failed|unknown), retryable, safeErrorCode?
```

Database commit precedes outbox side effects. Signed provider callbacks and durable state are required before any customer-facing success state. Provider acceptance is not delivery, and request submission is not appointment confirmation.

## 2026-08-09 transactional-email decision

Resend Free is the best practical current fit for the initial ₹0 budget:

- The official free tier is `$0`, 3,000 emails/month, 100/day, one custom domain, one webhook endpoint, all webhook event types, and 30-day provider-side retention. Pay-as-you-go is available only to paid subscriptions, so the free selection does not silently create overage charges: [Resend pricing](https://resend.com/pricing).
- The API supports deterministic `Idempotency-Key` values for 24 hours. IronWake will also enforce durable database uniqueness on `inquiry_id + notification_type`, because provider idempotency alone expires: [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
- Delivery, delayed, failed, bounced, complained, and suppressed events are available; raw signed requests must be verified before any database transition: [Resend event types](https://resend.com/docs/webhooks/event-types), [webhook verification](https://resend.com/docs/webhooks/verify-webhooks-requests).
- Resend documents Next.js directly and exposes an ordinary HTTPS server API, so it is compatible with the current Next.js/Netlify runtime: [Next.js guide](https://resend.com/docs/send-with-nextjs), [API introduction](https://resend.com/docs/api-reference/introduction).
- The `resend.dev` testing sender can deliver only to the email belonging to the Resend account. Customer acknowledgements require an owned verified domain and remain blocked until DNS/domain ownership is supplied: [testing-domain restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).
- Current npm registry readback reports stable `resend@6.18.1`. The selected email skill's `6.9.x` version note is stale; implementation must use the current stable version and record the adaptation.

Brevo was considered because its free service and transactional webhooks are usable, but its documented batch idempotency TTL is only 30 minutes and webhook security guidance is less direct for this small Next.js path. Resend's 24-hour idempotency plus signed-webhook SDK produces the smaller, clearer adapter while IronWake's database remains the durable source of truth.

## Provider-neutral execution architecture

1. The persistence RPC creates separate owner and customer outbox events in the same transaction as the inquiry. Audit and booking use different event types; booking customer copy says `BOOKING REQUEST RECEIVED`, never confirmed.
2. After triage, high/urgent or `needs_human` records may atomically queue one owner-priority event. A uniqueness constraint prevents duplicates.
3. A server-only worker validates configuration before claiming work, claims a small batch using `FOR UPDATE SKIP LOCKED`, creates a durable attempt, and sends through the adapter with the outbox idempotency key.
4. Accepted API responses store the provider message ID and `accepted_by_provider`; they never become `delivered` until a verified webhook is durably committed.
5. Retryable failures schedule bounded backoff (5 minutes, then 30 minutes). Attempt three becomes `dead_letter`. Permanent suppression/bounce/complaint events become visible terminal failures.
6. The intake remains successful whenever the inquiry transaction succeeded, even if the inline notification attempt fails. A Netlify scheduled function retries persisted work; [scheduled functions](https://docs.netlify.com/build/functions/scheduled-functions/) are available on all plans and have a 30-second limit. The current Netlify Free plan is `$0` with 300 credits and no auto-recharge, but the actual IronWake account plan must be read back before enabling the schedule: [Netlify plan controls](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/).
7. The owner operations view reads outbox and attempt state, shows whether the lead was saved and whether email was accepted/delivered/failed, and permits an authorized replay of dead-lettered work without altering the inquiry.

No marketing list, broadcast, contact import, tracking pixel, automatic upgrade, or unsolicited message belongs in this subsystem.

## Control-plane note

Composio discovery found an active WhatsApp toolkit account, but that is not evidence of IronWake ownership, approval, number readiness, consent, or production provider state. No WhatsApp tool was executed.
