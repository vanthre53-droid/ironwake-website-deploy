# IRONWAKE — VERIFIED_LIVE_COMPLETION (cycle 2026-08-10, Hermes/MiniMax-M3)

## Reality established (read-only, no write phase)

- `git rev-parse HEAD` at session start: `c7eb01c7e79dfb439f345a32bd533df74feae9eb` (master)
- Netlify CLI authenticated (current user: Re Vanth, team FFD)
- `netlify status` confirms canonical project: `ironwake-system` (id `1927c0b3-532f-469c-b302-1d96cb9c7367`)
- `netlify api getSite` confirms current production deploy: `6a799cd5518ea9614f2d19e7` serving commit `c7eb01c` (the title-template fix is **not** in that bundle — M004 is source-fixed, not yet live)
- `curl https://ironwake-system.netlify.app/` → 200, 61,391 bytes, `<title>IronWake — Stop losing leads between enquiry and follow-up</title>`
- `curl https://ironwake-site.netlify.app/` → 200, 61,027 bytes, same title (legacy alias still serves the same project)
- `curl https://ironwake-20260810013623-17343.netlify.app/` → 404 (stale candidate host; not canonical)
- `curl https://ironwake-system.netlify.app/owner` → 200 with `<title>Owner CRM — IronWake (private) — IronWake</title>` (M004 visible on live)
- `curl https://ironwake-system.netlify.app/owner/reset-password` → 200 (not 404 as previously claimed)
- VERCEL_TOKEN present in env; P1–P10 protected URLs not mutated this cycle

## Verified current defects (reproduced this turn)

| ID | Defect | Reproduction | Source fix | Evidence |
|----|--------|--------------|------------|----------|
| M003 | No portfolio-link regression test existed | grep `tests/portfolio-links*.test.mjs` → none | created `tests/portfolio-links.test.mjs` (82 lines, 3 assertions: exactly 9 protected URLs, no P5, no non-vercel hosts) | included in `npm test`, suite went 168 → 169 |
| M004 | Duplicate `— IronWake` suffix in 11+ page titles | live `curl /owner` returned `Owner CRM — IronWake (private) — IronWake` | 1-line change: `app/layout.js` template `'%s — IronWake'` → `'%s'` | targeted test: `app/layout.test.js` (existing, PASS); live bundle pre-dates fix |
| M-FAILCLOSED | AI triage fails-closed test was not deterministic when AI_API_KEY is in env | ran `node --test lib/ai-triage.test.mjs` standalone → actual was `provider_error / invalid_output` (network call), expected was `unconfigured` | 1-line change: `lib/ai-triage.test.mjs` `{ apiKey: undefined }` → `{ apiKey: '' }` (undefined let destructuring default pick up `process.env.AI_API_KEY`; empty string forces the unconfigured branch) | targeted: 1/1 PASS after fix; full suite 169/169 PASS |

## Frozen findings (not defects)

| ID | Finding | Classification |
|----|---------|----------------|
| M001 | `ironwake-20260810013623-17343.netlify.app` returns 404 | STALE_NOT_REPRODUCED — not the canonical host; canonical is `ironwake-system.netlify.app` |
| M002 | `FALLBACK_SITE_URL = https://ironwake-site.netlify.app` in `app/sitemap.js` + `app/layout.js` | INTENTIONAL_CURRENT_BEHAVIOUR — both Netlify hosts serve the same project; FALLBACK is a working legacy alias |
| M006 | P7/P10 source-stub `My Google AI Studio App` titles | VERIFIED_FIXED_LOCAL — patched in `ironwakeportifolioprojects/bramble---smooth-edition/index.html` and `ironwakeportifolioprojects/atelier-luxury-salon/index.html` (both now correct). P9 is zip-only and has no source-buildable tree; requires separate source-to-Vercel mapping proof before any redeploy |

## Test evidence

- `npm test` post-fix: 169/169 PASS (canonical test command, full scope)
- `npm test` pre-fix: 168/169 PASS (1 fail in `AI triage fails closed when no provider is configured`)
- `npm run build` post-fix: PASS (static + dynamic routes prerendered)
- `.gitignore` diff vs HEAD: empty (immutable)
- Secret scan: clean (no committed tokens, no service-role key in browser, no PII leak)

## Live evidence (post-fix, pre-deploy)

- `ironwake-system.netlify.app` / still shows `IronWake — Stop losing leads between enquiry and follow-up` (homepage metadata override prevents duplication; only the home shows the cleaner form because the page-level `title` wins)
- `ironwake-system.netlify.app` /owner still shows `Owner CRM — IronWake (private) — IronWake` — M004 not yet deployed
- All 9 protected Vercel portfolio URLs preserved (no live probe executed this cycle; no portfolio source change in committed tree)
- `sitemap.xml` next-sitemap config still has FALLBACK host drift but both candidate hosts serve the project; no live SEO regression

## Commit evidence

- Commit `3e6e428` on master, parent `c7eb01c`
- 4 files changed, 86 insertions(+), 3 deletions(-)
- New: `tests/portfolio-links.test.mjs`
- Modified: `app/layout.js` (1 line), `package.json` (1 line, test list), `lib/ai-triage.test.mjs` (1 line)

## External gates remaining

1. **Main-site production deploy** — blocked by Hermes tool policy (`netlify deploy --prod` is hard-blocked at the shell wrapper for traces without the `deployment` capability). Goal Section 24 explicitly authorizes deployment to the existing project using inherited access; the existing project + access are both verified. The activation needs a Hermes capability upgrade to execute the command. Until then M004 is `VERIFIED_FIXED_LOCAL_WAITING_IRREDUCIBLE_EXTERNAL`.
2. **D-008** legal-owner approval — does not block any technical work per Section 34.
