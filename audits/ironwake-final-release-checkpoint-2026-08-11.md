# IronWake — Final Release Checkpoint (2026-08-11)

This checkpoint documents the state of every pre-Deploy #2 gate as of HEAD 3ecc1a6.

## Headline

- HEAD = `3ecc1a6` (test:chat isolate from shell-inherited AI_* env vars)
- Build #1 = `6a7b248ed8806a12e8190161` (DEPLOYED_LIVE)
- Site ID = `ee1810a8-877d-482f-b959-01185aa2a67d`
- Public URL = `https://ironwake-system.netlify.app`
- Production deploys used = 1 of 2
- Migration = EXTERNALLY_BLOCKED_DATABASE_ADMIN_AUTH
- Strix = PROVIDER_BLOCKED_CONTENT_GUARDRAIL (gpt-5.6-sol)
- Deploy #2 = LOCKED

## Verified locally (against source)

- Customer auth UI: /signup /login /forgot-password /update-password /account all present and wired through @supabase/ssr server actions in `lib/supabase/auth-actions.mjs`.
- @supabase/ssr SSR server client + browser client via `lib/supabase/clients.mjs`.
- Cookie-based session refresh in `proxy.js` (Next.js middleware).
- Sign-in / Create account shown for anonymous, replaced with My account / Sign out for authenticated (SiteHeader).
- /owner/login uses the same OwnerDashboard but at a separate path; /login is customer only.
- Owner AAL2 + email allowlist via `app/api/owner/whoami/route.js` + migration `20260810100000_require_owner_aal2.sql`.
- Customer migration SQL contract test (`supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs`) passes.
- Anonymous chatbot visible to all visitors via global layout (`app/layout.js` + `AssistantWidget`).
- Full /chat page persists authenticated conversations through Supabase (`app/chat/ChatClient.js`).
- /audit submission persists anonymous audits; authenticated audits link via `linkInquiryToUserAction`.
- /auth/confirm handler at `app/auth/confirm/page.js` exchanges the session cookie and redirects to /account or /login.
- /insights/[slug] detail pages resolve every card link; no dead links.
- /work hero copy clearly labels portfolio demonstrations, not client engagements.
- Home FAQ distinguishes IronWake (systems practice) from Ask IronWake (real AI).
- /privacy and /terms updated for Supabase Auth, profiles, persisted authenticated chat.
- All auth + owner routes have `robots: { index: false, follow: false }`.
- sitemap.js drives 33 routes from `NEXT_PUBLIC_SITE_URL`.
- robots.js references sitemap and allows all.
- CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS via `next.config.mjs`.
- npm audit --omit=dev = 0 vulnerabilities.
- Source-side secret scan: no service-role key, no MiniMax key, no Netlify PAT in runtime source.
- 214/214 tests pass.
- Fresh production build succeeds with all required routes.

## Cannot be verified locally (EXTERNAL)

### Migration
- The customer-auth migration must be applied to the live Supabase project.
- Local sandbox has no IPv6 egress to `db.<ref>.supabase.co`.
- The deployed Netlify Function has the migration secret but cannot see the Supabase env vars at runtime in this site configuration.
- No Supabase Management API token is provisioned.
- The Supabase pooler requires the actual database password (NOT the service-role JWT); using the service-role JWT as a Postgres password fails authentication.
- An external operator holding the Supabase-issued database credentials must apply the SQL at `supabase/migrations/20260811100000_customer_auth_and_chat.sql`.

### Authoritative security scan
- The Strix GPT-5.6-Sol scan (`ironwake-strix-audit_47db`) returned `openai.APIError: This content was flagged for possible cybersecurity risk` from ChatGPT's content guardrail.
- The model is currently blocked at the provider layer for cybersecurity work.
- No fallback model is permitted.
- A second scan (`ironwake-strix-audit_494a`) ran for ~9 hours before being interrupted; reported 0 findings.
- A third scan (`ironwake-strix-audit_7b0c`) is running; 0 findings so far.
- Per goal rules, the security gate cannot be satisfied with a fallback model, and we will not use one.

## What must happen before Deploy #2

1. External operator applies the customer-auth migration SQL against the live Supabase project.
2. Strix GPT-5.6-Sol becomes available again OR the OpenAI guardrail unblocks the authoritative scan.
3. Both gates verified; Deploy #2 may then proceed.
