# V14 P1 Migration Round 1 — Live Deploy #13 Evidence Report

**Date:** 2026-08-19T03:55Z  
**HEAD:** d17253131d26ff5f4ff93fd5aa4b4db95a01fbe5  
**Cloudflare Version ID:** 7168cbec-6f4f-4e6e-a697-2b1b82f182b8  
**BUILD_ID:** tkiO3F5PVlbE0SyKUbGn0  
**Bundle gzip:** 2486553 bytes (2428.53 KiB)  
**Worker startup:** 24ms  
**Upload time:** 23.56s + triggers 7.94s

## Commit changes (deployment HEAD d172531)
- app/login/LoginForm.js
- app/signup/SignupForm.js  
- app/forgot-password/ForgotPasswordForm.js
- app/components/ui/Field.jsx (suffix prop added)
- app/components/ui/GoogleIcon.jsx (new)
- app/components/ui/GoogleIcon.test.mjs (new)
- app/globals.css (.iw-field__pw-toggle + reduced-motion added)
- package.json (new test path registered)

## Live verification (curl against https://ironwake.dev)

1. **GET /BUILD_ID** -> `tkiO3F5PVlbE0SyKUbGn0` matches BUILD_ID in manifest.

2. **GET /login** (first 800 chars after styling) -> renders **all** shared primitives:
   - `.iw-field` (2x wrapper)
   - `.iw-field__label` (2x)
   - `.iw-field__control` (2x with focus, aria-invalid hooks)
   - `.iw-field__required` (asterisk)
   - `.iw-field__pw-toggle` (password show/hide button)
   - `.iw-field__shell` (focus-ring wrapper)
   - `<button class="button secondary iw-button--md iw-button--block iw-button--has-leading button-google auth-google">` (Continue-with-Google)
   - `<button class="button iw-button--md iw-button--block auth-submit">` (Sign In)

3. All 3 migrated forms (`/login`, `/signup`, `/forgot-password`) now share the same Field + Button primitives, replacing the bespoke per-form SubmitButton, GoogleButton, password toggle, and raw input markup.

## What was removed (dead code deleted from forms)
- Local `SubmitButton` component (~20 lines each, deleted from all 3 forms)
- Local `GoogleButton` component (~40 lines each, deleted)
- Raw input markup without labels/help/error wiring (replaced by Field with `label`, `help`, `error` props)
- Bespoke password show/hide (replaced by Field `suffix` slot + `.iw-field__pw-toggle` CSS)

## Test status
- `npm run test` -> **377 / 377 PASS** at HEAD d17253131
- New: 3 GoogleIcon tests + existing 17 Field/Button tests = 20 design-system tests
- Full suite + Lighthouse gate: zero failures, zero skipped, zero cancelled

## Files changed (compact)
8 files changed, 240 insertions(+), 87 deletions(-)

## What this means
P1-DESIGN-SYSTEM round 1 ships to production: `/login`, `/signup`, and `/forgot-password` are now using the shared Field + Button + GoogleIcon primitives. Any future label/help/error styling tweaks happen in ONE place (Field.jsx), not three. The remaining P1 migration target is `/audit`, `/book`, `/owner`, `/admin`. That will be commit + deploy #14 — using the **1 remaining deploy** from the owner grant.
EOF
echo "WRITTEN"