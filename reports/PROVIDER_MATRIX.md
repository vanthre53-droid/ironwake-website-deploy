# C1 Provider and External-Action Matrix

- Prepared: 2026-07-27
- Status: architecture recommendation only; no provider is approved, connected for IronWake production, or production-proven.
- Freshness: the required Composio current-source refresh is blocked; the 2026-07-26 technical record remains candidate input.

| Capability | C1 recommendation | Current truth | Required approval/evidence | Launch disposition |
|---|---|---|---|---|
| Database and auth | Supabase Postgres/Auth with RLS, subject to G1/G2 approval | Account, owner, region, budget, and connection unknown | G1 stack approval; G2 empty/upgrade migration, RLS negative tests, auth/recovery tests | Deferred until G1/G2 |
| Hosting and preview | Vercel preview workflow, subject to owner and budget | Account, domain, billing, and rollback owner unknown | G1 owner/budget; G5 exact preview/commit and rollback proof | Deferred until G1/G5 |
| Transactional email | Provider-neutral adapter and test double; email first if approved | Provider, mailbox, domain verification, recipient, and budget unknown | G4 named provider, domain proof, idempotent delivery and failure readback | Test double only |
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

## Control-plane note

Composio discovery found an active WhatsApp toolkit account, but that is not evidence of IronWake ownership, approval, number readiness, consent, or production provider state. No WhatsApp tool was executed.
