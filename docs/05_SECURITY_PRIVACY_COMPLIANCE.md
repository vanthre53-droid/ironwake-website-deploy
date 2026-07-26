# Security, Privacy, and Compliance

## Honest target

The launch target is a documented threat model plus OWASP ASVS Level 2-aligned controls for the owner dashboard and sensitive workflows. This is not “military-grade,” not a certification, and not a substitute for a professional penetration test or legal review.

## Threat model assets

Protect:

- owner account/session and recovery;
- lead/contact/inquiry/booking data;
- consent and suppression records;
- provider credentials and webhook secrets;
- public content/price/claim approval state;
- notification and payment state;
- logs, backups, exports, and deletion flows.

Primary threats:

- broken object/role authorization;
- leaked service credentials or private data in browser/build/logs;
- injection/XSS/unsafe rich content;
- CSRF/session theft/recovery abuse;
- public-form spam, enumeration, and resource exhaustion;
- webhook spoofing/replay/tenant misrouting;
- SSRF/file/media abuse if uploads or URL fetches exist;
- duplicate external sends/charges from retries;
- prompt injection or data exfiltration if AI features are activated;
- dependency/supply-chain compromise;
- accidental public indexing of dashboard/private state;
- backup/restore failure and over-retention.

## Mandatory controls

### Identity and authorization

- managed, current auth implementation; no custom password cryptography;
- server-side authorization on every private request/action;
- owner/admin/viewer roles only if needed; deny by default;
- MFA/passkey path, secure recovery, session rotation/revocation, login throttling;
- generic auth errors; no account enumeration;
- test direct URL/API access as unauthenticated and wrong-role users;
- database RLS/equivalent plus application authorization; test both.

### Input and output

- schema-validate every request server-side, with size/type/range/enum limits;
- parameterized database queries/ORM safe APIs;
- contextual output encoding; sanitize any approved rich text;
- allowlist redirects, URLs, content types, and provider event schemas;
- no raw HTML from users/providers/AI without robust sanitization;
- file uploads disabled unless explicitly needed; if enabled, scan, re-encode, isolate, limit, and store outside executable/public paths.

### Browser and transport

- HTTPS only, HSTS after domain readiness;
- restrictive CSP adapted to required sources; remove CDN/eval dependencies;
- `frame-ancestors`, nosniff, referrer and permissions policies;
- secure, HttpOnly, SameSite cookies where applicable;
- explicit CSRF strategy for cookie-authenticated mutations;
- no private caching; safe cache keys and headers;
- no secrets or private fields in source maps, RSC payloads, static files, error pages, analytics, or client logs.

### Public form abuse

- layered rate limits by route and risk signal;
- bot protection/honeypot/challenge based on measured abuse;
- server validation and generic failure response;
- email/phone normalization and bounded deduplication;
- no data existence disclosure;
- queue/backpressure for notifications;
- privacy notice and purpose-specific consent.

### Webhooks and external actions

- verify signature against raw body before parsing/side effects;
- reject stale/replayed events according to provider guidance;
- unique provider event ID and idempotency constraint;
- explicit account/tenant resolution independent of untrusted payload labels;
- outbox for side effects after database commit;
- bounded exponential retry with jitter; dead-letter and safe replay;
- no automatic success state before authoritative callback/commit;
- redacted payload logging; store only required fields.

### Secrets

- encrypted provider/deployment environment only;
- development/staging/production separation;
- `.env.example` contains names and comments, never values;
- secret and history scans before release;
- documented owner, purpose, scope, creation, rotation, and revoke path;
- rotate any value found in source, screenshots, chat, logs, or issues.

### AI-specific controls if enabled

- retrieval/knowledge sources approved and versioned;
- tools use typed allowlisted arguments and server authorization;
- model output is untrusted input to code and UI;
- no secret/private-data access beyond the minimum tool;
- price and availability fetched from authoritative data, never prompt memory;
- disclosure and human escalation;
- injection/data-exfiltration tests;
- cost, token, latency, rate, and kill-switch limits;
- no autonomous payment, contract, deletion, bulk message, or production change.

## Privacy and data lifecycle

Create a data inventory: field, purpose, source, lawful/consent basis to review, visibility, provider, region, retention, deletion, export, backup handling.

Use data minimization. Do not collect credentials, customer exports, medical details, payment card data, or long free-text when not necessary for the first contact.

Implement:

- privacy notice version captured at submission;
- channel-specific consent and suppression;
- retention jobs that report before deleting;
- owner-driven export and deletion/anonymization;
- backup retention and restore test;
- deletion propagation to processors where supported;
- incident response and breach-assessment runbook;
- access/audit logs without sensitive payloads.

Generated privacy/terms/cookie/refund text is a draft until reviewed for the real entity, markets, providers, and practices.

## WhatsApp and voice boundaries

- WhatsApp marketing requires explicit WhatsApp consent; email consent is not enough.
- Honor STOP/START and local-language equivalents as approved; suppression is checked before sends.
- Outside provider-defined service windows, use approved templates only where applicable.
- Verify current Meta categories, limits, prices, quality rules, and Flows requirements from official documentation.
- Voice begins with clear AI disclosure, quotes only authoritative prices, confirms before actions, and offers human handoff.
- Outbound voice/messaging is disabled until target-market consent/compliance is verified.
- Recording/transcription is disabled unless disclosure, purpose, retention, access, and market legality are approved.

## Security evidence

Release evidence includes:

- threat model and ASVS applicability matrix;
- authorization/RLS negative tests;
- webhook spoof/replay/duplicate tests;
- rate-limit/bot tests;
- CSP/header scan;
- dependency, SAST, secret and history scans;
- log/analytics/HTML/client-bundle privacy review;
- backup and restore proof;
- deletion/export proof;
- AI injection/tool-abuse tests if AI is enabled;
- documented residual risks and pen-test recommendation.

