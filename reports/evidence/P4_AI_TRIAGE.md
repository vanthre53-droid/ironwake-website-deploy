# P4 AI Triage Foundation

Status: `PARTIAL — MINIMAX M3 CONTRACT AND DURABLE FAILURE METADATA VERIFIED LOCALLY; DEPLOYED END-TO-END STILL FAILS`

## Implemented

- `lib/ai-triage.mjs` calls MiniMax M3 through MiniMax's OpenAI-compatible `/v1/chat/completions` API server-side. It removes `response_format`, which is not listed in MiniMax's current M3 request contract, and requests documented `reasoning_split`, a bounded completion, and one strict JSON object in the prompt.
- The adapter sends only business name and leak description; the submitted email is not included in the model prompt.
- Valid output is allowlisted for category and priority.
- Missing key, timeout, provider error, rate limit, authentication error, invalid output, or network failure fails closed to `needs_human: true` with a safe machine-readable error code.
- `app/api/audit/route.js` persists the inquiry first, then stores private triage fields. A storage write failure is now observable and returns a truthful `202` rather than a false-success `201`.
- Public responses remain generic and do not expose internal AI output.
- `supabase/migrations/002_add_ai_triage.sql` remains the original triage-field foundation. Forward migration `20260809124000_durable_ai_triage_attempts.sql` is live and adds safe provider, failure-code, and attempted-at metadata only.

## Verification

- `node --test lib/ai-triage.test.mjs app/api/audit/route.test.js app/owner/OwnerDashboard.test.js supabase/migrations/20260809124000_durable_ai_triage_attempts.test.mjs`: 7/7 passed.
- `npm test`: 135/135 passed.
- `npm run build`: passed.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Production migration application and live column readback: successful for `triage_provider`, `triage_error_code`, and `triage_attempted_at`.
- One owner-authorized synthetic production inquiry persisted at 2026-08-09. It records `triage_status = provider_error` and `triage_model = MiniMax-M3`; the deployed application has not yet received this local repair, so its provider/error metadata remains absent and structured triage is not verified.

## Remaining boundary

- The MiniMax API key remains server-only and was not read, printed, or stored by this task.
- The current production deployment is commit `daafc01`, while repair commit `3faadd3` is local and not deployed. A G5 production deployment approval is required before the same synthetic inquiry can prove MiniMax → structured triage → Supabase → owner dashboard.
- No automatic customer reply or owner notification was sent.
- The deployed owner dashboard does not yet display triage data. The local owner dashboard now exposes provider/model, triage outcome, priority/category, safe status, attempted time, summary, and suggested reply under the existing owner authorization/RLS boundary.
- Routine AI replies remain drafts until the notification and human-escalation policy is implemented and verified.
