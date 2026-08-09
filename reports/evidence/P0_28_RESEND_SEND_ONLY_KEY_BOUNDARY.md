# P0.28 — Resend send-only key boundary

Date: 2026-08-09 UTC
Status: `RESEND_FULL_ACCESS_KEY_REQUIRED`

## Verified safely

- Production commit `b0d5781` is ready on the existing Git-linked `ironwake-site` deployment.
- `POST /api/webhooks/resend` is deployed and its source reads a bounded raw body before Resend/Svix signature verification, normalization, or provider-event storage.
- Migration `20260809170000_targeted_notification_claim` is live. Its exact-event selector exists; anonymous and authenticated roles cannot execute it, and `service_role` can.
- Focused notification, webhook, and migration contracts passed 19/19; the production build completed successfully.

## Blocking provider fact

The configured Resend API key was accepted by the service but rejected at the webhook-management boundary as restricted to sending. Therefore this run did not create or list a webhook, obtain a signing secret, write any secret, send email, invoke a callback, or mutate notification state.

## Exact secure resume action

Replace `RESEND_API_KEY` with a Resend **full-access** key in `.env.local` and the existing `ironwake-site` production environment, without placing it in Git or chat. Then resume at webhook registration. Do not rotate or expose unrelated credentials.
