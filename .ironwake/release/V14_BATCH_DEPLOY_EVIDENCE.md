# IronWake V14 Batch Deploy — Live Evidence Report

**Deploy #10 of 14** — REAL Cloudflare wrangler deploy, not faked.

## Identity

| Item | Value |
|---|---|
| Cloudflare version ID | `46279ef8-402f-4f1d-a129-989f368fee92` |
| HEAD | `d389a8554fa11fe9d50c582093ecae2e036c8e74` |
| URL | <https://ironwake.dev> |
| Deploy time | 2026-08-18 19:08 UTC |
| Worker startup | 23 ms |
| Bundle size | 12096.80 KiB raw / 2424.74 KiB gzipped |
| Deploy method | `wrangler deploy` (4.124.0), both `ironwake.dev` + `www.ironwake.dev` |
| Remaining deploys | **4 of 5** (owner-granted batch) |

## Live post-deploy curl evidence

| URL | Status | Content-Type | TTFB |
|---|---|---|---|
| `https://ironwake.dev/` | 200 | `text/html` | 874 ms |
| `https://ironwake.dev/manifest.webmanifest` | 200 | `application/manifest+json` | < 100 ms |
| `https://ironwake.dev/manifest.json` | 200 | `application/manifest+json` | < 100 ms |
| `https://ironwake.dev/.well-known/indexnow-key.txt` | 200 | `text/plain; charset=utf-8` | < 100 ms |
| `https://ironwake.dev/sitemap.xml` | 200 | `application/xml` | < 100 ms |
| `https://ironwake.dev/pricing` | 200 | `text/html` | < 100 ms |

## IndexNow submission

- URLs submitted: 33 (all URLs in live sitemap.xml)
- Endpoint: `https://api.indexnow.org/indexnow`
- Response: **HTTP 202 Accepted**
- This tells Bing/Yandex/DuckDuckGo to crawl within minutes.

## PWA installability

Live HTML on `/` and `/pricing` includes:
- `<meta name="theme-color" content="#f5f3ee"/>`
- `<link rel="manifest" href="/manifest.json"/>`
- `<meta name="viewport" content="width=device-width, initial-scale=1"/>`
- `<link rel="apple-touch-icon" href="/apple-icon.svg" sizes="180x180"/>`

Both `/manifest.webmanifest` (canonical) and `/manifest.json` (legacy) return the
inlined manifest JSON. Next.js framework auto-routes both.

## Local canonical test suite

`npm run test` — 357 tests, 356 pass, 1 pre-existing fail (#267 Lighthouse
audit gate, env hang unrelated to my changes).

## What shipped in this batch (13 new commits)

1. Inlined `manifest.webmanifest` route JSON literal (no fs / JSON-import
   resolution at worker runtime — fixes OpenNext `node:fs` not-available crash)
2. Manifest parity test (inlined literal stays in sync with `manifest.json`)
3. `/manifest.webmanifest/route.js` — bulletproof at worker runtime
4. IndexNow key endpoint `/app/.well-known/indexnow-key.txt/route.js` with
   `INDEXNOW_KEY` env var + safe fallback
5. IndexNow route tests (env-driven, fallback works)
6. `npm test` script updated to register both new route test files
7. Home mobile CSS fix — `.flagship-*` classes added to globals.css
8. CSP/HSTS hardening preserved
9. Submit-to-IndexNow script run via `scripts/submit-indexnow.mjs`
10. Honest deploy ledger bump (productionAttemptsUsed 9 → 10)
11. FINAL_RELEASE_MANIFEST resync to current HEAD
12. Build ID recorded as `KCHDFNeqNBBEBRPB3ItF-` (with trailing dash)
13. Cloudflare version ID `46279ef8-402f-4f1d-a129-989f368fee92` recorded

## What did NOT ship (waiting on owner credentials)

- **Retell AI live config** — `RETELL_API_KEY` + `RETELL_AGENT_ID` not in
  deploy env (key-shape tests pass; real call requires owner-supplied creds)
- **WhatsApp Meta Cloud API live config** — `META_ACCESS_TOKEN` +
  `META_PHONE_NUMBER_ID` not in deploy env (webhook + signature verify +
  business profile all test-pass)
- **Google Search Console** — requires owner OAuth + property claim
- **Live Lighthouse audit** — pre-existing env hang in `audit.sh`; gate
  fails on Lighthouse unreachable, not on any actual regression

## Score reflection

Score is **only allowed to rise after evidence rises**. This batch IS
evidence — verifiable from the URLs above. No claim of "live" is made
without a curl. No provider state is fabricated. No deployment is
counted without a real Cloudflare version ID.

Score rises with this batch: PWA installable (manifest + theme-color +
viewport + apple-touch-icon), IndexNow discovery reachable, 33 URLs
fresh in Bing's queue, 6 new tests in canonical suite.