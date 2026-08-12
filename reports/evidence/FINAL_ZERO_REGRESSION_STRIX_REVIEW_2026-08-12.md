# IRONWAKE — Focused Customer-Data Strix Review

Date: 2026-08-12
Run: ironwake_6586
Run directory: /home/shadowlingo/strix_runs/ironwake_6586/
SARIF output: findings.sarif

## Configuration
- STRIX_LLM = chatgpt/gpt-5.6-sol
- STRIX_REASONING_EFFORT = high
- STRIX_DEDUPE_MODEL = chatgpt/gpt-5.6-sol
- STRIX_DEDUPE_REASONING_EFFORT = high
- Scope mode: diff
- Diff base: 435c343 (previous production checkpoint)
- Scan mode: quick
- Max budget: $8 USD
- Max turns: 35
- Non-interactive: true

## Model verification (proves required model was used)
- run.json references model: chatgpt/gpt-5.6-sol
- Dedupe model: chatgpt/gpt-5.6-sol
- No fallback to gpt-5.4 or MiniMax was used.

## Subagents dispatched
- Chat Session Rebinding Validator
- Chat Isolation Reviewer
- Client Exposure and XSS Reviewer

All three are scoped to customer-data isolation per the directive.

## SARIF findings
Critical: 0
High: 0
Medium: 0
Low: 0

## Diff scope (the change set under review)
- 39b603c - 435c343 (zero-regression checkpoint vs previous production checkpoint)
- Files changed:
  - app/chat/ChatClient.js (defensive reply render on degraded status)
  - app/components/CustomerAssistantLauncher.js (defensive reply render on degraded status)
  - app/components/SiteHeader.js (auth-hydration skeleton pill)
  - app/components/Skeleton.js (new presentational skeleton component)
  - app/globals.css (skeleton CSS — presentation only)
  - .gitignore (ignore local screenshot evidence)

## Verdict
STRIX_FOCUSED_CUSTOMER_DATA_REVIEW = VERIFIED
CUSTOMER_DATA_CRITICAL_OPEN = 0
CUSTOMER_DATA_HIGH_OPEN = 0
CUSTOMER_DATA_ISOLATION = VERIFIED

The change set is presentational/UX-layer only. No business logic, no auth
boundary, no DB query, no RLS policy or persistence logic was modified.
Customer data isolation is preserved through:
1. RLS policies on profiles, chat_sessions, chat_messages (verified by
   supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs)
2. Owner endpoints use bearer JWT with OWNER_EMAIL check + AAL2
   (app/api/owner/whoami/route.js, app/api/owner/export/route.js)
   - never use service_role
3. /api/chat never upserts/reads DB tables; only calls AI provider
4. Client-side Supabase calls always carry user_id ownership scope
5. No SUPABASE_SERVICE_ROLE_KEY in client bundle (verified by build);
   only anon key is exposed

## Strix log evidence
- /home/shadowlingo/strix_runs/ironwake_6586/findings.sarif
- /home/shadowlingo/strix_runs/ironwake_6586/run.json
- /home/shadowlingo/strix_runs/ironwake_6586/strix.log
- /home/shadowlingo/strix_runs/ironwake_6586/.state/agents.json
