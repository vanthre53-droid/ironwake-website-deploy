# Deployed Supabase Investigation — 2026-08-08

## Resolution
Resolved in cycle 5 by the local harness (no owner action required).

## Root cause (confirmed)
The deployed Supabase project `ipcpthmmcdtshbbsirwj` had been paused (status `INACTIVE`) AND had zero tables / functions applied. The `/api/audit` route returned 502 because `supabase.rpc('submit_audit_inquiry', ...)` failed with `function not found`.

## Fix applied
1. Restored the paused project via `mcp__supabase__restore_project` (returned `success: true`).
2. Applied all 5 migrations to the deployed project via `mcp__supabase__apply_migration`:
   - `001_create_inquiries` (inquiries table + RLS)
   - `002_add_ai_triage` (triage columns)
   - `003_owner_crm_core` (contacts, consents, tasks, outbox_events, audit_logs; `submit_audit_inquiry` + `anonymize_expired_inquiries` RPCs; `is_owner()` helper; owner policies)
   - `004_fix_task_due_date` (due-date interval repair)
   - `005_grant_owner_crm_access` (authenticated table privileges)
3. Re-tested end-to-end:
   - `SELECT public.submit_audit_inquiry(...)` via MCP → returned inquiry UUID `b9d9abfa-…`; downstream tables all populated.
   - Anonymous `POST /api/audit` to `https://lucent-sunflower-966982.netlify.app/api/audit` → HTTP 201 with `{"received":true,"message":"We received your request. We'll review it and follow up if needed."}`.
   - Verified the persisted row in `public.inquiries` (`id d19baca8-…`, `source website_audit`, `status new`).
4. Cleaned up smoke rows (`smoke@test.invalid`, `smoke2@test.invalid`) from both `inquiries` and `contacts`.

## Status
R12 — `FAILED_DEPLOYED` → `VERIFIED_DEPLOYED`. Updated `reports/CANONICAL_GOAL_REQUIREMENTS_MATRIX.md` and the programme `STATE.json` / `CURRENT_CONTEXT.md`.

## Symptom (historical)
POST /api/audit on the deployed site returned **HTTP 502 "We could not save this request. Please try again."**
Both the Business Leak Audit and Booking Request forms use this endpoint.

## Root cause hypothesis (now confirmed)
The Supabase environment variables on Netlify were correctly configured, but the deployed Supabase project had no schema. The `submit_audit_inquiry` RPC did not exist.

## Required Netlify env var NAMES (values are confidential, already on owner's Netlify dashboard)
- `NEXT_PUBLIC_SUPABASE_URL` — browser-safe
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — browser-safe
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never committed, never exposed to browser
- `OPENAI_API_KEY` (optional) — for AI triage; only required if `triage_status` should be filled by live model

## Required Supabase migrations (must be applied to the project the deployed env vars point to)
From `/mnt/c/Users/vanth/Downloads/ironwake/supabase/migrations/`:
1. `001_create_inquiries.sql`
2. `002_add_ai_triage.sql`
3. `003_owner_crm_core.sql` (creates `submit_audit_inquiry` RPC)
4. `004_fix_task_due_date.sql` (repairs task due-date interval)
5. `005_grant_owner_crm_access.sql` (grants authenticated table privileges)

## How to verify locally without exposing secrets
```bash
SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" SUPABASE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  node -e "
    const { createClient } = require('@supabase/supabase-js');
    const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {auth:{persistSession:false}});
    s.rpc('submit_audit_inquiry', {p_business_name:'test',p_email:'test@t.com',p_leak_description:'test',p_source:'test'})
      .then(r => console.log(JSON.stringify(r)));
  "
```

## Owner action required (no secrets requested in chat)
1. Open Netlify site dashboard for `lucent-sunflower-966982`.
2. Confirm env var NAMES above are set there.
3. Confirm the project URL matches the one where local migrations were applied (`ipcpthmmcdtshbbsirwj`).
4. If they don't match: either re-point env vars to the correct project, or run the migration SQL files against the deployed project via Supabase SQL Editor.
5. After step 4, retry POST /api/audit — it should return HTTP 201 with `{received: true}`.
