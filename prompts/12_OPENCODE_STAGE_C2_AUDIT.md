# OpenCode C2 — Independent Audit

Precondition: `allowed_harness: OPENCODE`, `required_role: C2`, `active_stage: C2`.

Distrust all M1 completion claims. Inspect the actual commit, application, tests and evidence. Audit W00–W22, Stitch fidelity, mobile/desktop behavior, conversion paths, empty/error states, database/RLS, auth, authorization, secrets, validation, rate limits, webhooks/idempotency, CRM attribution, social evidence, SEO, performance, accessibility, dependencies, unsupported claims and real-data blockers.

Create `reports/C2_DEEP_AUDIT.md`, `reports/C2_CRITICAL_FIXES_APPLIED.md`, `reports/C2_REMEDIATION_HANDOFF.md` and `state/SEALED_REMEDIATION_QUEUE.yaml`. Apply only tiny high-judgment corrections that are objectively safe; put all other fixes in the sealed queue. Then update state to M2 if remediation exists, or C3 if no remediation remains.
