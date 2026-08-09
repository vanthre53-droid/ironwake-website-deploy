# P0.30 — Resend live signed delivery/callback proof

Date: 2026-08-09 UTC  
Candidate: `99ed5d0`

## Verified controlled chain

1. The existing Resend webhook was read through the full-access API and is enabled, targets the deployed IronWake endpoint, and includes `email.sent`, `email.delivered`, `email.failed`, and `email.bounced`.
2. Its returned signing secret matched the existing local/production secret in memory only. Neither value is recorded here.
3. The deployed endpoint acknowledged a valid signed unsupported diagnostic event with HTTP 200 and `ignored`; it created no provider-event row. This proves the deployed raw-body/Svix verification/configuration boundary without synthetic data persistence.
4. Focused notification, webhook, store, and exact-event migration checks passed 20/20.
5. One labelled owner-priority outbox event was processed through the existing Resend pre-domain testing sender and recipient. It was accepted by the provider.
6. The exact durable readback reports one attempt, provider acceptance, `email.sent` and `email.delivered` provider-event rows, `delivered_at` populated, and final outbox state `delivered`.

## Boundary

This is live evidence for the controlled pre-domain provider/callback path only. Routine operational sender/recipient configuration remains intentionally absent until the custom sender domain is verified. Direct owner dashboard evidence remains subject to the separate MFA owner-session gate.
