# Test, Release, and Handover Gates

## Evidence rule

No checkbox is evidence by itself. Store commands, versions, dates, environment, relevant output, screenshots/traces, and a plain-language conclusion in `reports/evidence/`. Redact secrets and personal data.

## Gate A — Source/truth readiness

- all 30 screens mapped;
- unverified claims quarantined;
- all assets have ownership/license status;
- no Stitch price is treated as approved automatically;
- real-data blockers consolidated;
- skill inventory completed and unsafe/outdated skills adapted or rejected.

## Gate A1.5 — Portfolio truth and launch proof

- P3 DentaCare, P10 Atelier, and P1 RapidPulse source access is verified or explicitly recorded unavailable;
- every portfolio claim has a proof class and approved wording;
- provider/database success is supported by reproducible evidence or labelled pending/demonstration;
- proof-critical default, failure, recovery, and mobile states are tested;
- unlicensed/unapproved assets and unsupported metrics/results are removed, hidden, or quarantined;
- `reports/PORTFOLIO_PROOF_GATE.md` and evidence index are complete.

## Gate AS1 — Minimum social foundation

- approved founder/agency identity and platform roles;
- approved active platform set, with deferred platforms explicitly omitted;
- real owner/recovery/admin records and human-completed eligibility/MFA actions;
- logged-out verified public URLs and working contact routes;
- nine truthful foundation source assets and three approved pinned assets;
- no invented profiles, engagement, clients, outcomes, integrations, or provider proof;
- CRM attribution design and privacy/minimisation rule approved;
- `GS1_SOCIAL_FOUNDATION_APPROVAL` recorded before P2/P3 public website implementation.

## Gate B — Data/auth/server

- migrations apply from empty and upgrade path if applicable;
- constraints/indexes/transactions tested;
- RLS/authorization deny cross-role/direct object access;
- unauthenticated and expired-session paths tested;
- secure recovery/MFA path tested without exposing real secrets;
- public form validation/rate limit/spam/duplicate paths tested;
- audit events generated and redacted;
- API contracts and safe errors verified.

## Gate C — UI/routes

- every approved route renders and all 30 Stitch screens are accounted for;
- shared component coverage and no prototype CDN/inline mock architecture;
- CTA destination map has no dead control;
- 320/390/768/1024/1280/1440 screenshots;
- keyboard, focus, screen reader labels, validation, error, loading, empty, retry, success, provider failure, reduced-motion;
- visual regression against approved reference with documented deviations;
- no public debug annotations, placeholder brackets, fake results, or internal notes.

## Gate D — CRM and integrations

- inquiry durable record before notifications;
- exact service/slot/source/consent captured;
- booking status never overstates provider confirmation;
- owner CRM record/timeline/task created once;
- email/WhatsApp owner notification received once in approved test;
- customer acknowledgement wording matches real state;
- duplicate webhook/event produces no duplicate booking/send/payment;
- provider failure retries then appears in dead-letter/operator UI;
- STOP/suppression blocks applicable sends;
- no sensitive form answers in notification/log/analytics;
- voice/payment tests only when approved.

## Gate E — Security/privacy

- threat model and current ASVS applicability matrix;
- API authorization/BOLA tests;
- injection/XSS/CSRF/SSRF/upload tests as applicable;
- webhook signature/replay/tenant resolution tests;
- CSP/security headers/TLS;
- dependency/SAST/secret/history scans;
- production bundle/source/HTML/log/analytics PII and secret review;
- backup/restore, export, deletion/anonymization;
- incident and rollback runbooks;
- residual risks documented.

## Gate F — SEO/performance/accessibility

- rendered indexable HTML, titles/H1/canonicals;
- sitemap/robots/redirect/404/broken links;
- structured data passes and is truthful;
- noindex/private dashboard verified;
- Core Web Vitals lab targets and budgets pass on representative routes;
- bundle/font/image/third-party analysis;
- automated a11y plus manual keyboard/reflow/reduced-motion/screen-reader sample;
- content/claim freshness and regional route logic approved.

## Gate G — Preview and production approval

Before requesting G5 approval, report:

- exact commit and preview URL;
- all gate results and evidence links;
- known limitations and third-party pending items;
- provider accounts, costs, quotas, ownership, rotation;
- schema/data migration impact;
- rollback target and tested procedure;
- launch/monitoring/incident owners;
- difference between demo, tested, and live states.

Production deployment is an external material action. Preview success does not authorize it.

## Post-deploy verification

After approval:

1. DNS/TLS/headers and public route smoke test.
2. Robots/canonical/sitemap/structured data from production.
3. Owner auth and authorization denial.
4. One approved real inquiry and slot request.
5. Verify durable inquiry, CRM timeline, task, booking status.
6. Verify approved email/WhatsApp delivery exactly once.
7. Verify provider callback/failure visibility.
8. Delete/anonymize the test per approved policy.
9. Trigger and receive a monitoring test alert.
10. Observe error/performance/provider dashboards for the approved window.

## Handover package

- README and architecture;
- route/component/status map;
- public content, claim, asset, offer and price ledgers;
- admin guide and role/recovery procedure;
- provider connection/rotation/revoke runbooks without secrets;
- database migration, backup/restore, retention/export/deletion;
- monitoring/alert/dead-letter/replay/incident/rollback;
- deployment and DNS ownership;
- test evidence and residual risk register;
- recurring cost and renewal table;
- 30-day measurement plan and prioritized backlog.

## 30-day measurement

Track real visits, qualified inquiries, form step drop-off, service choice, response time, requested-to-confirmed, confirmed-to-attended, provider failures, notification delivery, task completion, Core Web Vitals, search impressions/clicks/queries, and content-assisted conversions. Do not claim ROI or conversion uplift until sample size and attribution are credible.
