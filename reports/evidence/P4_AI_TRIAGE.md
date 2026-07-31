# P4 AI Triage Foundation

Status: `PARTIAL — SERVER ADAPTER AND PRIVATE STORAGE VERIFIED; OPENAI RUNTIME KEY AND NOTIFICATION DELIVERY PENDING`

## Implemented

- `lib/ai-triage.mjs` calls the OpenAI Responses API server-side with structured JSON output.
- The adapter sends only business name and leak description; the submitted email is not included in the model prompt.
- Valid output is allowlisted for category and priority.
- Missing key, timeout, provider error, or invalid output fails closed to `needs_human: true`.
- `app/api/audit/route.js` persists the inquiry first, then stores private triage fields.
- Public responses remain generic and do not expose internal AI output.
- `supabase/migrations/002_add_ai_triage.sql` was applied to the approved Supabase project and all eight `triage_*` columns were read back.

## Verification

- `node --test lib/ai-triage.test.mjs`: 2/2 passed.
- `npm test`: 13/13 passed.
- `npm run build`: passed.
- Supabase migration application: successful.
- Supabase column readback: eight expected triage columns present.

## Remaining boundary

- `OPENAI_API_KEY` is server-only and has not been requested, read, or stored by this task.
- No live OpenAI request was made.
- No automatic customer reply or owner notification was sent.
- Triage storage is not the same as a working CRM/dashboard or notification outbox.
- Routine AI replies remain drafts until the notification and human-escalation policy is implemented and verified.
