# IronWake Approval Ledger

Only a named human may change an approval from `PENDING` to `APPROVED`. Add the date, exact scope, selected option, and approver. Approval for one phase does not authorize later external actions.

## Gate G1 — Research and architecture

- Status: `APPROVED`
- Approver: Revanth Nunna
- Date: 2026-07-28
- Approved decision-packet version/hash: `C1 Draft v0.3` / `c79f12a0e21347a5c3903c6f2e377ee525d99ba0d0297821f0e037acba40f41b`
- Approved stack: Next.js App Router + TypeScript strict + Supabase Postgres/Auth/RLS + Vercel previews, with provider-neutral outbox adapters
- Approved public routes: Per `reports/SCREEN_ROUTE_MATRIX.md`, subject to G1.5, GS1, and G3; no publication authorized
- Approved merged/deferred screens: Per `reports/PHASE_1_DECISION_PACKET.md` and `reports/SCREEN_ROUTE_MATRIX.md`; unsupported proof routes remain deferred
- Approved design deviations: Truth, accessibility, responsive, performance, and functional corrections over Stitch prototype behavior
- Approved launch offers/pricing state: Five-offer internal ladder; public `Request scope` only until price-ledger/legal review
- Approved owner dashboard scope: Single-workspace owner CRM with secure auth, leads, inquiries, tasks, timeline, booking requests, notifications, audit, retention, export, and deletion controls
- Approved providers for implementation: Provider-neutral adapters and test doubles; no external connections; payments excluded
- Approved budget ceiling: UNKNOWN; no spend authorized
- Conditions/exclusions: G1.5 portfolio proof, GS1 social foundation, G2 schema/auth, G4 provider, G3 public UI/content, and later production approvals remain required

## Gate G2 — Schema/auth/server foundation

- Status: `APPROVED_FOR_SEALED_W13_IMPLEMENTATION`
- Approver: Surekha Nunna (adult/legal owner), as attested by Revanth Nunna in chat
- Date: 2026-07-31
- Migration scope: sealed W13 single-owner CRM schema, RLS, server authorization, audit/outbox/retention/export/deletion controls; apply only reviewed additive migrations after local tests pass.
- Auth roles/recovery/MFA: one owner dashboard account (`ironwakee@gmail.com`); managed Supabase Auth; MFA required; no additional users or multi-tenant functionality.
- Auth/MFA completion: Revanth Nunna confirmed completion in chat on 2026-07-31. This is a trusted human attestation; no credentials, QR codes, recovery codes, or user record data were read or stored.
- Retention/deletion rules: 90-day retention; verified deletion/anonymization and secure export are required; final legal-policy publication remains pending.
- Conditions/exclusions: no production deployment, domain/DNS, provider send, customer contact, payment, social publication, secret entry, or destructive migration. G4/G5/G6 and legal-policy approval remain separate gates.

## Gate G1.5 — Portfolio truth and launch proof

- Status: `APPROVED_DEMONSTRATION_ONLY`
- Approver: Revanth Nunna
- Date: 2026-07-29
- Approved proof-gate version/hash: `PORTFOLIO_PROOF_GATE.md` working-tree clarification; source and URL evidence remain readback-only
- P3 DentaCare status and allowed claims: `PORTFOLIO DEMONSTRATION — capability proof; not a client engagement`
- P10 Atelier status and allowed claims: `PORTFOLIO DEMONSTRATION — capability proof; not a client engagement`
- P1 RapidPulse status and allowed claims: `PORTFOLIO DEMONSTRATION — capability proof; not a client engagement`
- Approved screenshots/assets: None newly approved; use only owned/licensed assets after G3
- Approved provider-proof labels: Provider proof is not claimed or required for demonstration-only wording
- Deferred projects/claims: Client outcomes, testimonials, metrics, provider success, payment, booking, uptime, security outcomes, and production claims
- Conditions/exclusions: G3 claim/assets/public-copy approval remains required; no external provider connection or publication is authorized

## Gate G3 — Public UI/content

- Status: `APPROVED_LOCAL_IMPLEMENTATION_ONLY`
- Approver: Revanth Nunna
- Date: 2026-07-30T15:42:04Z
- Approved preview/commit: Local working tree only; no preview URL or production deployment approved.
- Approved claim ledger: Existing truthful claim ledger and demonstration-only portfolio boundary.
- Approved asset ledger: Existing owned/local asset ledger only; no external/hotlinked image or social asset publication.
- Approved public prices/copy: Existing route-contract copy only; prices remain `Request scope` and legal routes remain reviewed-draft states.
- Conditions/exclusions: User directed completion of the local website while external blockers are deferred. This authorizes only reversible `app/`, `public/`, tests, and local evidence work. It does not authorize a public release, provider connection/use, email send, social/profile mutation, payment, DNS, legal publication, or deployment. GS1 remains incomplete.

## Gate G4 — External providers

Record each separately. `TEST ONLY` is not production approval.

| Provider/capability | Status | Account owner | Test recipient/number | Spend cap | Production allowed? | Approval/date |
|---|---|---|---|---:|---|---|
| Transactional email | PENDING | | | | no | |
| WhatsApp | PENDING | | | | no | |
| Voice | PENDING | | | | no | |
| Calendar | PENDING | | | | no | |
| India payment | PENDING | adult/legal KYC | | | no | |
| International payment | PENDING | adult/legal KYC | | | no | |
| Analytics | PENDING | | | | no | |
| Monitoring alerts | PENDING | | | | no | |

### User scope direction — 2026-07-31

- Approver: Revanth Nunna
- Scope: Continue email-only work using the approved public/contact mailboxes; leave social-media accounts and publishing deferred for now.
- Email pace: one notification per durable inquiry; no bulk outreach, unsolicited messaging, or campaigns.
- Customer behavior: generic received acknowledgement only until notification/provider readback and the approved workflow prove more.
- Exclusions: this direction does not by itself mark G4 transactional email approved for production, authorize deployment, or replace the required server-only adapter, idempotency, retry, dead-letter, and delivery evidence.

## Gate GS1 — Social profiles, content, and acquisition

- Status: `PARTIALLY_APPROVED_INSTAGRAM_PROFILE_EDIT_ONLY`
- Approver: Revanth Nunna
- Date: 2026-07-30T14:04:13Z
- Approved active platforms/accounts: Instagram `@ironwake.dev` only
- Approved owner/recovery/admin matrix: Human-attested W03 evidence; private identity/recovery details intentionally not stored
- Approved handles/public URLs: `https://www.instagram.com/ironwake.dev/`
- Approved profile copy and visual assets: `reports/M1_W04_INSTAGRAM_PROFILE_EDIT_PACKET.md`; exact bio, `public/assets/brand/ironwake-logo.jpg`, and `ironwake.dev@gmail.com` Business Leak Audit CTA
- Approved nine foundation assets:
- Approved three pinned assets:
- Approved CTAs/contact routes:
- Approved publishing/reply/moderation rules:
- Approved CRM attribution and message-retention rules:
- Approved tools/APIs/permissions, if any:
- Deferred platforms:
- Conditions/exclusions: This is not GS1 completion. It authorizes only the human Instagram profile edit; no feed post, Reel, Story, DM, comment, ad, automation, account permission, or other platform. The API/browser capability limitation means the human must execute and provide logged-out readback.

No approval in this gate authorizes unsolicited messaging, automated engagement, identity/KYC actions, or access to private credentials.

## Dependency approval record

- Status: `OWNER_APPROVED_IN_CHAT_PENDING_EXECUTION_GATE`
- Approver: Revanth Nunna
- Date: 2026-07-30
- Scope: install the approved Next.js, React, Supabase client, TypeScript, and validation dependencies; prepare but do not remotely apply migrations until the complete G2 schema/auth/retention fields are recorded.
- Exclusions: no production deployment, provider send, payment, publication, or secret value storage in this record.

## Gate G5 — Production deployment

- Status: `PENDING`
- Approver:
- Date:
- Exact commit:
- Exact preview URL:
- Evidence index reviewed:
- Remaining limitations accepted:
- Monthly recurring costs accepted:
- Rollback target verified:
- Production domain:
- Conditions/exclusions:

## Gate G6 — Real end-to-end test and handover

- Status: `PENDING`
- Approver:
- Date:
- Approved test identity/contact:
- Permission to send test email/WhatsApp/call/payment:
- Permission to delete/anonymize test record:
- Handover recipient:
- Conditions/exclusions:

## Prerequisite record — 2026-07-31

- Source: Revanth Nunna supplied the current operating, ownership, provider, privacy, and release answers in chat. Secret values were not requested or recorded.
- Adult/legal owner: Surekha Nunna (mother, India/Andhra Pradesh) approves contracts, provider accounts, billing, KYC, taxes, refunds, and production ownership. Revanth Nunna is the operational founder and technical operator.
- Public identity: IronWake; `Revanth Nunna — Founder, IronWake`; India; public contact `ironwake.dev@gmail.com`; internal notification mailbox `ironwakee@gmail.com`; Asia/Kolkata; public offer remains `Request scope`; no public address or founder photo.
- Local scope: Revanth approved continued local implementation. This does not approve deployment, publication, DNS, production email, account changes, payment, external messaging, database migration, or any provider action not separately recorded below.
- Provider direction: Supabase Free (Mumbai), Resend Free test-only, Cal.com Free, Cloudflare Workers/Pages and Workers AI, and Sentry Developer. Automatic upgrades/overage are disabled; production remains gated by owned-domain, provider, legal, and release evidence.
- Data/CRM direction: single-owner dashboard for Revanth with MFA; 90-day retention; minimal data; consent-based contact; verified export/deletion process; immediate opt-out; no marketing, analytics initially, payments, voice recording, or sensitive-data collection.
- Inquiry direction: Business Leak Audit; server validation → durable inquiry → outbox → one internal notification attempt → owner review → optional booking/chatbot guidance. Customer acknowledgement is generic. Duplicate handling is 30-day normalized email/phone matching; notification idempotency uses durable inquiry ID plus event type.
- Required, not yet approved/verified: G2 schema/auth/migration/retention approval; all provider configuration and private environment values; signed webhooks; notification/outbox retries and dead letters; Supabase auth/RLS negative tests and backup/restore; Cal.com and chatbot live integration; Sentry; legal policy approvals; preview and production gates.
- Synthetic test authorization: one `IronWake Test Inquiry` using `ironwake.dev+test@gmail.com`, one controlled test email after configuration, and later deletion/anonymization after verification. This is not permission to send customer or marketing messages.
