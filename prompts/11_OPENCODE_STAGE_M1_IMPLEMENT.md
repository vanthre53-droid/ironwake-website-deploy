# OpenCode M1 — Sealed Implementation

Precondition: `allowed_harness: OPENCODE`, `required_role: M1`, `active_stage: M1`, approval gate recorded, and `state/SEALED_TASK_QUEUE.yaml` exists.

Read only the approved queue plus the governing docs needed by each task. Implement the queue across approved W00–W22 scope: foundation, database/RLS, APIs, auth, dashboard, CRM, public routes, forms, notifications, social/content assets, proposals/invoice status, revenue and delivery workflows, SEO, accessibility, tests and preview preparation.

Do not invent prices, claims, testimonials, provider success, photos, legal terms, account ownership, credentials, or features. Do not redesign architecture. At each task run its acceptance tests and record evidence. Never publish, send, spend, change public accounts, or deploy production without approval.

When the queue is complete, create `reports/M1_COMPLETION_EVIDENCE.md`, update state to `required_role: C2`, `active_stage: C2`, `phase_prompt: prompts/12_OPENCODE_STAGE_C2_AUDIT.md`, and leave one exact audit action.
