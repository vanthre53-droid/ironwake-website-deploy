# Deployed Supabase Investigation — 2026-08-08

## Symptom
POST /api/audit on the deployed site returns **HTTP 502 "We could not save this request. Please try again."**
Both the Business Leak Audit and Booking Request forms use this endpoint.

## Root cause hypothesis
The Supabase environment variables on Netlify are configured (otherwise the endpoint would return 503 "Intake is not connected yet."), but the `submit_audit_inquiry` RPC fails on the live Supabase project.

The most likely causes, in priority order:
1. The Netlify env vars point to a different Supabase project than the one local testing used (project `ipcpthmmcdtshbbsirwj`), and the alternate project does not have the migrations applied.
2. Migrations were applied to local testing's project but never applied to the deployed one.
3. The Supabase service-role JWT expired or was rotated.

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
