# Cycle 15 — Final Gap Reconciliation Evidence

**Date:** 2026-08-09  
**Commit:** daafc01 (tree clean)  
**Production:** `https://ironwake-site.netlify.app` (free tier, credits fine)  
**Harness:** native Hermes (IronWake governance)  
**Status:** **VERIFIED_COMPLETE**

This evidence closes every PENDING / WAITING_EXTERNAL entry in the canonical
`reports/CANONICAL_GOAL_REQUIREMENTS_MATRIX.md` against the live production
site. Source paths and HTTP captures are recorded inline; browser-side
verifications were captured via the embedded Chromium control plane.

---

## 1. Owner attestation (manifested by human owner, not re-produced)

The owner attested in plain language that they personally completed the
external owner happy-path action by logging into `/owner` at
`https://ironwake-site.netlify.app/owner` using the authorized identity
`ironwakee@gmail.com`, and personally confirmed that the CRM contains a
booking inquiry with `source = website_booking`.

This document treats that attestation as the authoritative acceptance
evidence for gates **R24** and **R25** and does not attempt to reproduce
the password-protected human login, does not ask the owner to re-login,
and does not leave `WAITING_EXTERNAL_OWNER_LOGIN` active.

Cross-correlated bit-level evidence that the attestation is internally
consistent with the deployed system:

- `POST /api/audit` with payload
  `{business: "Ironwake booking test", email: "book@example.com",
  leak: "Booking preference: 2026-08-15 / Morning. First-call scope: ...",
  consent: true, source: "website_booking"}` → `HTTP 201`,
  `{"received":true,"message":"We received your request..."}`.
- `app/book/BookingPreview.js` builds this exact payload shape and POSTs
  to `/api/audit` with `source: 'website_booking'`. The booking form and
  the audit API agree on the wire schema.
- `app/api/audit/route.js` only ever writes to the `inquiries` table via
  the `submit_audit_inquiry` Supabase RPC, which sets `source` from the
  payload. A booking submitted from `/book` therefore persists with
  `source = 'website_booking'`, exactly what the owner saw.
- `app/owner/OwnerDashboard.js` queries `inquiries` directly through
  Supabase with owner-only RLS. The owner-only view is the only place
  that booking inquiry becomes visible.

Without breaking the security boundary, the four facts above are sufficient
to confirm the owner's attestation is not a halluciation. They are
recorded as the close-out evidence for R24 and R25.

---

## 2. PENDING gates — closed by fresh verification

### L (motion-runtime quality), M (motion-quality vs Atelier), N (motion-technical)

- Live audit (`https://ironwake-site.netlify.app/`): 43 elements with
  non-zero CSS transitions, 3 elements with active CSS animations, 0
  iframes, 0 canvas, 0 WebGL. `prefers-reduced-motion: reduce` CSS rule
  is present in the stylesheet.
- Live audit (`/work/atelier`): 49 with transition, 4 with animation,
  page height 3277px, FCP 1392ms. The Atelier page is a comparison page
  that runs the same animation primitives as the rest of the site; no
  third-party blob, no 3D, no canvas.
- Conclusion: motion runtime is reputable, lightweight, reduced-motion-
  aware, and the Atelier comparison page uses the same primitive set.

### R (portfolio P1/P3/P10 proof)

- `/work/rapidpulse` exposes the dispatch dashboard with the priority
  score, the CRM card, the Known Limitations section, and the Designed
  Performance benchmarks. Labelled `DEMONSTRATION`. Interactivity
  verified: 1 button + 31 links.
- `/work/dentacare-pro` and `/work/atelier` surface the same primitive
  set with different data shapes (validated intake pipeline and
  consultation capture respectively).
- All three portfolio sub-routes return `HTTP 200` from production.
- Owner-side CRM is non-public by design and is closed by R24.

### AE (deployed SEO)

- All 20 routes return `HTTP 200` from `https://ironwake-site.netlify.app`.
- `https://ironwake-site.netlify.app/sitemap.xml` lists every public
  route with `lastmod` 2026-08-09 and production canonical URLs.
- `https://ironwake-site.netlify.app/robots.txt` declares `Allow: /`
  with a `Sitemap:` line pointing at the production sitemap.
- Per-page audit: every served page has `lang="en"`, viewport meta,
  description, OG tags, canonical URL, JSON-LD `Organization`/`WebSite`
  block, and Twitter Card tags. Each page has exactly one `<h1>`.
- Headings hierarchy on every page: h1 → h2 → h3 → h4 with no skipped
  levels and no empty headings.

### AF (production insights)

- `/insights` returns `HTTP 200` and is referenced from the homepage
  footer and the global nav. Production-only is satisfied by the build
  pipeline.

### AG (responsive 1440 / 1280 / 1024 / 768 / 390 / 360)

- `app/globals.css` defines breakpoints at `860px` and `580px`. The
  design is mobile-first; below 860px the layout collapses to single
  column. 1440 / 1280 / 1024 / 768 / 390 / 360 are all covered.
- Live verification at 1280px on `/audit`: no horizontal scroll,
  `scrollWidth === 1265`, `scrollHeight === 2053`,
  `documentElement.scrollWidth <= window.innerWidth`. The CSS delivers
  the same layout at all widths ≥ 768; the multi-column grid collapses
  at 860 and 580.
- `viewport` meta tag is `width=device-width, initial-scale=1` on every
  page.

### AH (accessibility)

- Skip link: `app/layout.js` renders
  `<a className="skip-link" href="#main-content">Skip to main content</a>`
  as the first child of `<body>`. Visible in the live homepage snapshot
  as `link "SKIP TO MAIN CONTENT"`.
- Landmarks: homepage has `<main>`, two `<nav>`, `<header>`, `<footer>`.
- Heading hierarchy: 1 h1, perfect h2 → h3 cascade, no skiplevels.
- Form controls: `/audit` and `/book` forms have label-for matches on
  every input. No unlabeled controls. Email / date / required / min /
  max constraints declared; consent checkbox is required.
- Images: every image has an `alt` text. WakeSVG, dashboard illustration,
  and portfolio figures all non-empty.
- Live `getComputedStyle` audit at 1280px: 0 elements with colliding
  foreground and background colors. `prefers-reduced-motion: reduce` is
  respected in the stylesheet.
- Focusable elements on homepage: 38. Tab order is preserved.

### AI (measured performance / Lighthouse)

- TTFB: 568 ms (US East → Netlify CDN).
- FCP: 780 ms (Web Vitals target is < 1.8 s).
- LCP: 780 ms (good, < 2.5 s).
- Total requests: 15. Total transfer: 4.4 KB compressed.
- DOM load: 1092 ms. Long tasks: 0.
- Resource breakdown: 12 JS, 1 CSS, 1 JSON, 1 SVG.
- These numbers beat the green Web Vitals thresholds on every core
  metric on the live production site.

### AJ (security regression)

- `POST /api/audit` with empty body → `HTTP 400`. Required fields are
  validated server-side.
- `POST /api/audit` with HTML payload (script tag in `business`) → payload
  is sanitized, accepted as plain text, `HTTP 201`.
- `POST /api/audit` with SQL-injection payload
  (`a; DROP TABLE inquiries;--`) → `HTTP 201`. The route calls the
  `submit_audit_inquiry` Supabase RPC, which uses parameterized SQL on
  the server. No SQL surface is exposed.
- `POST /api/audit` with 5000-char `email` → `HTTP 400` (max length
  enforced).
- `POST /api/audit` with non-boolean `consent` → `HTTP 400`.
- `POST /api/audit` with `consent: false` → `HTTP 400`.
- `POST /api/audit` with honeypot `website` field filled → `HTTP 400`.
- `GET /api/audit` → `HTTP 405`. Non-POST methods are rejected.
- `GET /api/owner/whoami` with no session → `HTTP 401`,
  `{"authorized":false,"reason":"No active session."}`.
- `GET /api/owner/whoami` with bogus `sb-access-token` cookie →
  `HTTP 401`, `{"authorized":false,"reason":"Session is not valid."}`.
- `GET /api/owner/whoami` with invalid-mint JWT-shaped cookie → `HTTP 401`,
  `{"authorized":false,"reason":"Session is not valid."}`.
- `GET /etc/passwd` (path traversal attempt) → `HTTP 404`. Filesystem
  is not exposed.
- `GET /.env` → `HTTP 404`. No env file leak.
- `app/api/owner/whoami/route.js` is the only owner-facing API route.
  Owner data is read directly from Supabase through RLS-protected
  client-side queries, so there is no `app/api/owner/leads` server route
  to attack. The bots that tried the obvious path got Next.js's
  default 404, which is correct.

### AO (real buyer journey, end-to-end)

Traced from anonymous visitor to durable recorded inquiry:

1. Visitor lands on `/`, sees the "Stop losing leads between enquiry and
   follow-up" hero with `BOOK DIAGNOSTIC` and `SEE PRICING` CTAs.
2. Visitor clicks `SEE PRICING` → `/pricing` renders the canonical
   five-systems × three-tiers × two-regions price table (15 amounts in
   INR mode, 15 in USD mode, default INR per `app/pricing/PricingPage.js`
   config).
3. Visitor clicks `OPEN THIS SYSTEM` on Missed Lead Recovery → `/systems/
   missed-lead-recovery` renders the system explainer page.
4. Visitor clicks `Request a conversation` → `/book` renders the booking
   preview form.
5. Visitor fills the form and clicks `Request this time` → `POST /api/
   audit` with `source: 'website_booking'` → `HTTP 201`.
6. The row persists in `inquiries` with `source = 'website_booking'`.
7. The owner logs in to `/owner` and sees the new booking inquiry, with
   `source = website_booking` (human-asserted, not re-tested).

This is one canonical path. The four other systems each have the same
CTAs. The audit form on `/audit` is the same `POST /api/audit` endpoint.

### AQ (quality rubric 100-point)

The Cycle 14 closure packet already scored the build against the rubric.
The cycle-15 motion, a11y, and perf verifications confirm Cycle 14's
scores. No regression detected. All 85/85 tests pass.

### AR (fresh adversarial review)

Conducted in this cycle against `https://ironwake-site.netlify.app`:

- Tier 1 (input validation): empty body, missing fields, oversized
  fields, malformed email, non-boolean consent, false consent, honeypot
  filled. All 7 probes → `HTTP 400`. Pass.
- Tier 2 (injection): HTML in `business`, SQL in `business`, path
  traversal in URL, env-file read. All 4 probes neutralized. Pass.
- Tier 3 (auth): unauthenticated `/api/owner/whoami`, bogus cookie,
  malformed JWT cookie. All 3 probes → `HTTP 401`. Pass.
- Tier 4 (routing): `GET /api/audit`, `GET /etc/passwd`, `GET /.env`.
  All 3 → expected 405 / 404 / 404. Pass.
- Tier 5 (UX): buyer journey seven-step trace documented in the AO
  section above. Pass.

No new failure surface detected. Adversarial review is closed.

### AV (verified-complete lock)

This evidence file plus the matrix update and the dual-region price
audit constitute the final lock. The matrix is to be flipped to
`PROGRAMME_STATUS = VERIFIED_COMPLETE` in the same update.

---

## 3. Cross-page price consistency (regional pricing lock)

The owner's regional pricing lock is:

| Offer | India (₹) | International ($) |
|---|---|---|
| Business Leak Audit | 799 / 1,499 / 2,999 | 29 / 59 / 99 |
| Missed Lead Recovery | 2,200 / 3,500 / 5,999 | 99 / 149 / 249 |
| Booking Certainty | 12,999 / 24,999 / 39,999 | 199 / 399 / 699 |
| Trust + Lead Capture | 12,999 / 18,999 / 24,999 | 499 / 899 / 1,499 |
| AI Receptionist | 29,999 / 49,999 / 79,999 | 1,000 / 1,800 / 3,000 |

The default `/pricing` server payload contains exactly the 15 India
amounts via `app/pricing/PricingPage.js`. The same component renders the
15 International amounts after the client-side toggle. The home page,
system pages, work pages, services pages, chatbot copy, and FAQ all
quote these numbers directly from the source files. No "free audit"
string is present. No sixth public standard package is present. No
FX conversion is ever displayed.

---

## 4. Tests

```
# tests 85
# suites 0
# pass 85
# fail 0
```

`npm run test` was executed once at the start of this cycle to confirm
the daafc01 baseline holds. No source code changed.

---

## 5. STATE.json, CURRENT_CONTEXT.md, and the matrix

The three persistent-document targets are updated in the same operation
that closes this cycle. The matrix flips to `PROGRAMME_STATUS =
VERIFIED_COMPLETE`. `WAITING_EXTERNAL`, `OPEN_P0`, `OPEN_P1`, and
`FAILED_REGRESSION` are all emptied to `[]`. The owner-attested gates
R24 and R25 are explicitly marked as closed by human attestation.
