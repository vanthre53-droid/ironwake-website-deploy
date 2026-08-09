# P4 AI Triage Foundation

Status: `VERIFIED_LIVE — MINIMAX M3 STRUCTURED TRIAGE → SUPABASE; OWNER-AUTHENTICATED DASHBOARD VIEW PENDING`

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
- The two historical controlled production inquiries above remain evidence of the pre-repair deployment and are not current behavior.
- Existing site `ironwake-site` deployed the existing GitHub repository commit `c2f9663` successfully as public production deploy `6a7892639caabf0008a76736` on 2026-08-09. That artifact contains the MiniMax repair.
- One new owner-authorized, clearly synthetic production inquiry received the generic public confirmation and persisted a complete structured row. Readback confirms `triage_status = complete`, `triage_provider = minimax`, `triage_model = MiniMax-M3`, non-null attempted time/category/summary/suggested reply, null error code, and `triage_needs_human = false`.
- The repaired adapter's injected timeout, provider-unavailable, and invalid-output paths passed 6/6 alongside the audit-route tests. They return `provider_error`, `needs_human = true`, and respectively `provider_timeout`, `provider_unavailable`, and `invalid_output`, without a network call or a production configuration mutation.

## Remaining boundary

- The MiniMax API key remains server-only and was not read, printed, or stored by this task.
- Netlify production now identifies deploy `6a7892639caabf0008a76736`, published at `2026-08-09T14:45:26Z`, with `commit_ref = c2f966339cba89593f0128b44369c4c410df3b33`, state `ready`, branch `master`, and plugin state `success`.
- No automatic customer reply or owner notification was sent.
- The deployed owner dashboard contains the triage detail implementation, but a real MFA-enrolled authorized owner browser session is still required to prove that view and direct-object behavior. No service credential or synthetic owner session is a substitute.
- Routine AI replies remain drafts until the notification and human-escalation policy is implemented and verified.
