# P2 API Tests

Status: `PARTIAL — DURABLE SUBMISSION VERIFIED`

- Input validation rejects malformed, unconsented, and honeypot payloads.
- Missing persistence configuration returns the truthful HTTP 503 response.
- With Supabase configured, the API uses `submit_audit_inquiry` rather than separate public inserts.
- The authorized synthetic POST returned HTTP 201 and created exactly one inquiry, consent, task, queued outbox event, and audit event.
- The synthetic record was anonymized after readback.

Not verified: provider delivery, retry/dead-letter worker behavior, rate limiting, booking, or customer email.
