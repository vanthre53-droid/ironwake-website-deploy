# C1 Security, Privacy, and Resilience Model

- Prepared: 2026-07-27
- Target: OWASP ASVS Level 2-aligned verification for sensitive surfaces plus OWASP API Security controls.
- Boundary: design specification only; no security claim or certification is made.

## Protected assets

Owner sessions and recovery, contacts and inquiries, booking requests, consent and suppression, provider credentials and webhooks, claims/assets/prices, notifications/outbox, logs, backups, exports, and deletion records.

## Threats and controls

| Threat | Required controls | Evidence before release |
|---|---|---|
| BOLA or wrong-role access | Server authorization on every private action plus database RLS; deny by default | Unauthenticated, expired-session, wrong-role, and cross-object negative tests |
| Credential or private-data leakage | Server-only secrets; no private fields in bundles, HTML, logs, analytics, source maps, or notifications | Secret scan, bundle/HTML/log review, redacted error tests |
| Injection and unsafe output | Server schemas, bounded sizes, parameterized queries, contextual encoding, rich-text allowlist | Injection/XSS/CSRF tests and safe-error readback |
| Public form abuse | Rate limits, honeypot/challenge as measured, normalization, deduplication, generic errors, backpressure | Abuse/rate-limit/duplicate tests |
| Webhook spoof/replay | Verify raw-body signature before parsing, reject stale/replayed events, unique event IDs, tenant/account resolution | Forged, replayed, duplicate, and wrong-account tests |
| Duplicate side effects | Transactional outbox, idempotency keys, unique constraints, bounded retry, dead letters | Duplicate send/booking/payment tests and operator replay evidence |
| Indexing or caching private data | Authenticated routes protected by authorization and `noindex`; safe cache headers; robots is not security | Rendered HTML, headers, crawler, and direct-URL denial tests |
| Backup or deletion failure | Documented retention, export, anonymization/deletion, backup handling, restore test, incident/rollback runbook | Restore, deletion propagation, export, and recovery evidence |
| AI or provider data exfiltration | No AI/provider action in launch queue without approved source, typed allowlist, human escalation, and kill switch | Injection/tool-abuse tests if later enabled |

## Minimum data inventory

Collect only contact, business context, selected outcome, source/consent snapshot, request state, and operational next action required for first response. Do not collect credentials, payment cards, medical details, customer exports, or unnecessary long free text.

| Data class | Visibility | Retention decision | Required owner decision |
|---|---|---|---|
| Public content and approved claims | Public | Review/freshness date | Human content approver |
| Contact and inquiry | Owner only after validated submit | Unknown | Privacy/legal owner |
| Consent and suppression | Owner/system only | Unknown; append-only evidence | Privacy/legal owner |
| Provider event metadata | Server/operator only, redacted | Unknown | Provider/data owner |
| Audit/security logs | Restricted owner/operator | Unknown | Security/privacy owner |
| Backup/export | Restricted | Unknown | Adult/legal owner where applicable |

## Recommended launch posture

Begin with one owner workspace and managed auth rather than building a broad agency CRM. Require MFA, deny by default, enforce server authorization plus RLS, and expose no CRM data to public routes. Add team roles only after real operators and least-privilege responsibilities exist.

Use a durable inquiry-first flow: validate and rate-limit the public request, commit the inquiry and consent snapshot, append an audit event, then enqueue minimal owner notification data. Every notification/provider event needs an idempotency key, retry state, dead-letter path, and redacted logs. A green UI is never evidence of delivery, booking, payment, or provider success.

Retention, deletion, export, cross-border processing, and legal basis remain owner/legal decisions. Until approved, keep collection minimal, keep analytics off or consent-gated, and do not enable payment, recording, outbound WhatsApp/voice marketing, or autonomous AI actions.

## Non-negotiable release rules

- No custom password cryptography.
- No raw provider payloads, secrets, private notes, or sensitive answers in client notifications or analytics.
- No external side effect before durable commit and idempotency protection.
- No recording/transcription, outbound WhatsApp/voice marketing, payment, or AI autonomous action without separate approval and current legal/provider review.
