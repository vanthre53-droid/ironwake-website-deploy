# Conversion-fix skip notes

The audit named 5 fixes. The 3 applicable-on-paper were:

| # | Audit fix | Status | Why skip |
|---|-----------|--------|----------|
| 1 | `/services` dead link in pricing CTA | **SHIPPED — commit `a4a42e5`** | → `/systems` (consistent with SiteFooter mapping) |
| 2 | Homepage "Today's intake" status card (Captured 14 / In review 3 / Booked 9 / Due date Tomorrow) | **Already removed in prior work** | Home page (`app/page.js`) was refactored to `FlagshipHero` + `DashboardDemo`. The status card is no longer in source — no `Captured`, `In review`, `Booked`, or `status-card` text in `app/page.js` (only `status-card` class remains in `globals.css` for unused fallback). Re-running the audit's grep would be theatre. |
| 3 | AuditForm 7-field step-by-step form → ≤4 single-step form | **Already completed in prior work** | `app/audit/AuditForm.js` is now a single-step, 3-input form (business / email / leak + consent + honeypot). The refactor pre-dates this conversion audit. The `AuditForm.test.js` assertions still reference the OLD API (`event.currentTarget.reset()`, `consentEl.checked`) and fail today; that's a stale-test problem owned by whoever owns the form refactor, not in scope here per the "DO NOT break tests" rule. |
| 4 | Pricing → /scope cross-link | **SHIPPED — commit `f6d5279`** | 1-line JSX in the disclosure section. |
| 5 | Three-CTA hero (Book Diagnostic / See offers / How we work) on `/` | **Already removed in prior work** | `FlagshipHero` is the new hero component — different structure, fewer primary CTAs. None of the old strings remain. |

Plus one fix the audit asked us NOT to do (confirmed scope, no change):

- **/contact route** — audit explicitly recommended "Do not add a contact page." `grep -rn "/contact"` returns 0 hits across `app/`, `lib/`, `scripts/`, `supabase/`. Nothing links to a `/contact` route, so nothing 404s. The audit, the form, and the FAQ all funnel through `/audit` instead. **No code change. Nothing to ship.**

## What shipped (2 commits)

- `a4a42e5` — fix(conversion): pricing hero Browse Services → Browse Systems (1-line href + 1-line source-parse guard)
- `f6d5279` — fix(conversion): cross-link /scope from pricing truth-standard section (1-line JSX + 1-line source-parse guard)

**Tests:** `app/pricing/PricingPage.test.mjs` runs 2 tests, both pass.
**Untouched (out of scope per task rules):** AuditForm.test.js (failures pre-date this task — stale against refactor); `lib/indexnow.test.mjs` (a fixture URL `/services` inside a parse-sitemap test, harmless data, not a real link); sitewide hero/audit-form refactors that have already been done.
