# C1 Architecture, CRM, Security, and Release Control Specification

## System boundary

Public marketing content, audit request, and booking request are distinct from the private owner CRM. A public form creates a durable inquiry first; a transactional outbox may then create an owner notification. A booking request is never a confirmed appointment until an owner or verified calendar callback transitions it.

## Minimum launch data model

`users`, `memberships`, `contacts`, `inquiries`, `inquiry_answers`, `service_selections`, `appointments`, `opportunities`, `pipeline_stages`, `tasks`, `activities`, `notes`, `consents`, `suppression`, `notifications`, `outbox_events`, `provider_events`, `dead_letters`, `content_items`, `claims`, `assets`, `offers`, `price_versions`, and `audit_logs`.

All private reads require an authenticated owner role and RLS/equivalent policy. Public writes use server validation, bounded input sizes, normalized/deduplicated contacts, rate limit/honeypot as appropriate, privacy-notice version capture, and generic safe errors. Unapproved content/claims/assets/prices are never fetched by public routes.

## Recommended CRM security approach

Use a single-workspace owner CRM first, not a multi-tenant SaaS system. Use managed authentication with MFA/passkey support where the selected provider supports it, secure recovery, session rotation/revocation, and server-side role checks. Start with one owner role; add admin/viewer roles only when a real operating need exists.

Keep authorization in two layers: server-side checks for every route/action and database RLS using the workspace/member relationship. Never trust a browser-supplied workspace, lead ID, role, price, provider status, or notification state. Test direct object access with unauthenticated, expired, wrong-role, and cross-object requests.

Store only the minimum first-response data: normalized contact, business context, selected outcome, consent snapshot, attribution, inquiry state, owner, next action, and due date. Keep notes, audit events, provider IDs, and suppression records private. Exclude credentials, payment-card data, medical details, and unnecessary free text.

Commit the inquiry before notifications. Use a transactional outbox, unique idempotency keys, append-only audit events, signed webhook verification, bounded retries, dead letters, redacted structured logs, and tested export/deletion/restore. Notification payloads contain a reference and minimal masked context, never full answers or private notes.

## State machines

- Inquiry: `received → qualified | needs_information | unsuitable`; qualified can proceed to `consultation_requested | proposal_pending | closed`; active states can become `spam | withdrawn | archived`.
- Appointment: `requested → checking_availability → confirmed`; failure/recovery states are `needs_alternative | provider_failed | cancelled | rescheduled | no_show`. Only owner or verified provider confirmation creates `confirmed`.
- Notification: `queued → processing → accepted_by_provider → delivered`; bounded retry leads to `retry_scheduled` then `dead_letter`; suppression/cancellation are terminal. Provider acceptance is not delivery.

## Threat model and mandatory verification

Protected assets are owner sessions/recovery, lead/booking data, consent/suppression, credentials, public approval state, outbox/provider events, logs, backups, exports, and deletion records. Tests must cover BOLA/wrong-role access, unauthenticated/expired sessions, injection/XSS/CSRF/SSRF/upload paths where enabled, form abuse, replayed/forged webhook, duplicate effects, secret/PII leakage, private indexing, backup/restore, retention/deletion/export, and AI prompt/tool boundaries if an AI feature is later approved.

Controls: managed auth, MFA/passkey path, secure recovery/session revocation, server-side authorization plus RLS, validated allowlisted input/output, CSP/security headers, HTTPS/HSTS at domain readiness, safe cookies/CSRF design, redacted structured logs, encrypted server-only secrets, raw-body webhook verification, idempotency keys/unique events, bounded exponential retry with jitter, dead letters, and an incident/rollback runbook.

The target is OWASP ASVS Level 2-aligned verification for sensitive surfaces and OWASP API Security controls. It is not a certification or a claim of military-grade security.

## SEO, accessibility, and performance plan

Each indexable route requires unique approved title/description/H1, canonical, server-rendered intent content, internal crawlable links, valid sitemap/robots, and truthful structured data only where supported by visible content. Private/dashboard/staging surfaces are protected and `noindex`; robots is never the security boundary. No local-business, rating/review, service-area, team, or result schema without real evidence.

Target WCAG 2.2 AA: semantic landmarks/headings, skip link, keyboard/focus/44px touch targets, programmatic labels and error recovery, contrast, responsive reflow at 320px, dialog/menu/tab patterns, meaningful status announcements, alt/caption rules, and reduced-motion static equivalence. Test 320/390/768/1024/1280/1440 px plus loading/empty/error/retry/authorization/provider-failure states.

Performance target after real traffic: LCP ≤2.5s, INP <200ms, CLS ≤0.1. Use local/licensed optimized assets, explicit dimensions, self-hosted/minimized fonts where licensed, code-split dashboard/provider/optional-3D modules, and static fallbacks. Run production build, bundle, Lighthouse, rendered-HTML, a11y, browser/E2E, and link/SEO checks before release.
