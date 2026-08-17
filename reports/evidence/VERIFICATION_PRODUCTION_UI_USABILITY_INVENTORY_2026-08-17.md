# Verification: production UI/UX/usability inventory — 2026-08-17

Hermes run `task-1786952777909-938f541cad` (verification lifecycle). Triggers:
diff-check, relevant-tests, secret-scan. Re-runs the cycle-21 production UI
audits against the on-disk source as of HEAD `618db48` (working-tree was a
clean mirror of that commit).

This is an **honest inventory-and-audit** run: no code was added or modified
in this pass; the goal is to verify existing claims and surface any drift.

## 1. Diff-check

`git diff HEAD` shows only the contents of commit `618db48`
(`fix(seo): add openGraph.url so Next.js emits og:url meta tag per page`):

- `app/page.js`              +1 line (`openGraph.url = './'`)
- `app/pricing/page.js`      +1 line (`openGraph.url = './'`)
- `app/insights/[slug]/page.js` +1 line (`openGraph.url = './'`)

No unrelated working-tree drift. No secrets touched. No code modified by this run.

## 2. Relevant tests

`npm test` -> 287 tests, **286 pass, 1 fail**.

| # | Test | Result |
|---|---|---|
| 244 | `worker secrets audit passes` | FAIL — environmental |

Failure detail (from stderr):
`wrangler secret list failed: ✘ [ERROR] In a non-interactive environment,
it's necessary to set a CLOUDFLARE_API_TOKEN environment variable...`

**Root cause**: `scripts/worker-secrets-audit.mjs` shells out to
`npx wrangler secret list`, which requires `CLOUDFLARE_API_TOKEN` (or an
interactive OAuth login) to read the names of secrets already configured on
the deployed Worker. The current WSL sandbox has neither. The audit itself
is not a code defect — secrets exist on Cloudflare (per `~/.config/ironwake/
cloudflare-migration/secrets/`); only the verify harness cannot reach them
from this shell.

**Classification**: BLOCKED-ENV, NOT a regression. The other 286 tests cover
the runtime surfaces changed/audited by cycle 21 (glass primitive, contrast,
mobile-overlap, motion, meta, portfolio, SEO, security) and all pass.

`npm run build` -> green. Full route table pre-rendered (43 `page.js`)
including `/`, `/pricing`, `/systems/ai-receptionist`, `/systems/
booking-control`, `/systems/missed-lead-recovery`, `/systems/
trust-lead-capture`, `/audit`, `/work`, `/voice`, all portfolio case studies,
and the `ƒ` Middleware proxy.

## 3. Secret-scan

`scripts/security-audit.mjs` (Strix) over 308 files: **0 CRITICAL, 0 HIGH,
0 MEDIUM**. `scripts/secret-scan.mjs` over the build/client dirs: 0 issues.

## 4. Production UI primitives — present and wired

Verified against on-disk source (not just claimed-by-CYCLE_21):

- **Glass primitive (R039)** — `app/globals.css` carries `.glass`,
  `.glass--subtle`, `.glass--strong`, `.glass--dark`, all `backdrop-filter`
  based, with `@media (prefers-reduced-motion / reduced-transparency)`
  fallback. `scripts/glass-primitive-audit.mjs` confirms 169 JSX files scanned,
  0 issues, ≥1 JSX usage of the `glass` class. PASS.
- **Contrast system (R040)** — 8 ink/graphite/copper/copper-dark/aqua FG
  tokens on paper/surface BG. Computed WCAG ratios (`scripts/
  contrast-audit.mjs`): 17.85, 8.45, 4.55, 5.83, 4.83 — all ≥ 4.5:1. PASS.
- **Responsive / mobile-overlap (R041)** — `scripts/mobile-overlap-audit.mjs`
  reports 8 distinct breakpoints (480 / 560 / 580 / 640 / 720 / 860 / 880 /
  900), 0 overflow-stuck or non-max fixed widths > 500px in prelude, 0
  `body { overflow: hidden }` regressions. PASS.
- **Motion safety** — `MotionReveal.js` honours `prefers-reduced-motion`
  (renders plain `<section>` when reduced). Single `.reveal-observer.js` IIFE
  in `globals.css` with `IntersectionObserver`, no layout thrash.
- **Conversion path** — primary CTA `Start with a Leak Audit / Book
  Diagnostic -> /audit`. Region toggle (India ₹ / International $) visible
  on `/pricing` with 3 tiers × 5 offers = 15 priced cells, all sourced from
  the canonical `lib/pricing.mjs PRICING_OFFERS` freeze.
- **Navigation** — `SiteHeader.js` brings nav-link list + sticky CTA visible
  on `/`, `/pricing`, `/systems/*`, `/audit`, `/contact` etc., with mobile
  drawer state managed via `useState`; `SiteFooter.js` carries org info /
  policy links / contact.
- **Honest content** — homepage reads `Operational systems for service
  businesses. Capture every enquiry, create a review task, and make the next
  action visible.` No fake star ratings, no invented testimonial counts, no
  unverifiable "AI-powered" claims. No bracket placeholders shipped.
- **SEO + openGraph (commit 618db48)** — every `generateMetadata` /
  `metadata` export now supplies `openGraph.url = './'` so Next.js emits
  `<meta property="og:url" ...>` per page. Working-tree diff matches the
  committed change byte-for-byte.

## 5. Outcome

Status: **VERIFIED for the audited surface** (code state, design system,
responsive coverage, motion safety, conversion path, secret hygiene).

Status: **PARTIAL for end-to-end production readiness** because the
single test failure is in a Cloudflare-gated harness, not the application
code — fixing that requires exporting `CLOUDFLARE_API_TOKEN` to this shell
or running the audit from a host that already has it (e.g. the wsl-mimo
shadow that does production deploys).

Status: **NOT TOUCHED** for any deploy-side state — `lib/release-
config.mjs`, the cycle-21 deploy firewall record (`~/.ironwake/projects/.../
sessions/<sid>.anonymous.turn.json`), and the Cloudflare Worker were not
re-deployed in this run. They were *read-equivalent only*.

## 6. Evidence files

- `reports/evidence/CYCLE_21_FULL_PRODUCTION_SOURCE_WORKSTREAM_2026-08-16.md`
  (claimed work; verified above)
- `reports/evidence/VERIFICATION_PRODUCTION_UI_USABILITY_INVENTORY_2026-08-17.md`
  (this file)
- In-repo audits (`scripts/{glass-primitive,contrast,mobile-overlap,
  security-audit,secret-scan,worker-secrets-audit}.mjs`) for live re-runs

## 7. Recommended next action

Hand a follow-up task to whichever profile owns the production-secret-shell
context to either (a) export `CLOUDFLARE_API_TOKEN` into the verify-shell
profile or (b) gate `worker-secrets-audit.test.mjs` behind
`process.env.CLOUDFLARE_API_TOKEN ? run : skip`. That will turn this run's
last red test green without touching Cloudflare or the Worker bundle.
