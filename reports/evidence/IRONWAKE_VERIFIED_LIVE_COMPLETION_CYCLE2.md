# IRONWAKE — VERIFIED_LIVE_COMPLETION (cycle 2, 2026-08-10, Hermes/MiniMax-M3)

## Reality established (read-only, no write phase)

- HEAD at session start: `3e6e4288b00be847501496bd473df7df63fad3be` (master)
- Parent: `c7eb01c7e79dfb439f345a32bd533df74feae9eb`
- Branch: `master`
- Working tree at session start: 1 untracked (`reports/evidence/IRONWAKE_VERIFIED_LIVE_COMPLETION_CYCLE.md` from cycle 1)
- `.gitignore` byte-for-byte unchanged
- No source modifications made this cycle (all M004/M003/fails-closed fixes already in `3e6e428` from cycle 1)

## Provider reality (verified, not historical)

- **Netlify auth**: VERIFIED — `netlify status` shows `ironwake-system` (id `1927c0b3-532f-469c-b302-1d96cb9c7367`)
- **Netlify canonical host**: `https://ironwake-system.netlify.app` (200, serves 61KB homepage)
- **Alias host**: `https://ironwake-site.netlify.app` (200, same content) — bound separately
- **Stale candidate host**: `https://ironwake-20260810013623-17343.netlify.app` (**404 dead**)
- **Vercel auth**: VERIFIED — `vercel whoami` = `revanthiitian1-5469` (personal scope), team `revanth7`
- **Vercel projects under team**: 20 listed, all 9 protected URLs present as separate projects

## Source-to-Vercel mapping (Section 7)

| Code | Project | Protected URL | Local canonical source | Local build | Live title |
|------|---------|---------------|------------------------|-------------|-----------|
| P1 | rapidpulse-plumbing | https://rapidpulse-plumbing.vercel.app | (zip only) | — | RapidPulse Plumbing \| 24/7 Emergency Plumber in Manchester |
| P2 | bristol-architectural | https://bristol-architectural.vercel.app | (zip only) | — | Bristol Architectural \| Estate Agents for Distinctive Homes |
| P3 | manchester-gentle-dental | https://manchester-gentle-dental.vercel.app | (zip only) | — | Manchester Gentle Dental \| Calm, Anxiety-Aware Dentistry |
| P4 | bluestone-jewellery-prototype | https://bluestone-jewellery-prototype.vercel.app | `ironwakeportifolioprojects/bluestone-jewellery-prototype/` (folder + zip) | — | BlueStone \| Fine Jewellery & Bespoke Rings |
| P6 | luxe-studio | https://luxe-studio-wine.vercel.app | (zip only) | — | LuxeStudio - Premium Luxury Hotel & Photo Studio Booking |
| P7 | bramble-cafe | https://bramble-cafe.vercel.app | `ironwakeportifolioprojects/bramble---smooth-edition/` (folder + zip, Vite + vercel.json) | yes | **My Google AI Studio App** |
| P8 | voltix-fawn | https://voltix-fawn.vercel.app | (zip only) | — | Voltix \| Precision Engineered Electronics |
| P9 | re-tech | https://re-tech-umber.vercel.app | `ironwakeportifolioprojects/re-tech.zip` (zip only, no uncompressed folder) | — | **My Google AI Studio App** |
| P10 | atelier-luxury-salon | https://atelier-luxury-salon.vercel.app | `ironwakeportifolioprojects/atelier-luxury-salon/` (folder + zip, Vite + vercel.json) | yes | **My Google AI Studio App** |
| P5 | (absent) | — | — | — | — |

## Defects reproduced (Section 9 classification)

| ID | Symptom | Source state | Live state | Classification |
|----|---------|-------------|-----------|----------------|
| M004-main | Duplicated `— IronWake` suffix on 12 main-site pages (`/`, `/about`, `/work`, `/systems`, `/pricing`, `/process`, `/insights`, `/audit`, `/book`, `/privacy`, `/terms`, `/owner`) | FIXED in `3e6e428` (`app/layout.js` template changed from `'%s — IronWake'` to `'%s'`) | DUPLICATED on every public page | **VERIFIED_DEPLOYMENT_DELTA** — source fixed, live stale, deploy blocked |
| M004-sitemap | Sitemap hostname points to dead host `ironwake-20260810013623-17343.netlify.app` (404) | source `app/sitemap.js` has `FALLBACK_SITE_URL='https://ironwake-site.netlify.app'` | sitemap serves dead-host URL across all routes | **VERIFIED_DEPLOYMENT_DELTA** — source corrected to live alias; deployed bundle still bakes old env `NEXT_PUBLIC_SITE_URL` |
| P7-title | `<title>My Google AI Studio App</title>` | source `bramble---smooth-edition/index.html` has `<title>Bramble — Smooth Edition</title>` | live serves `My Google AI Studio App` | **VERIFIED_DEPLOYMENT_DELTA** — source fixed, live stale, deploy blocked |
| P9-title | `<title>My Google AI Studio App</title>` | zip `re-tech.zip` has `<title>RE-TECH — Premium Refurbished Laptops</title>` | live serves `My Google AI Studio App` | **VERIFIED_DEPLOYMENT_DELTA** — source zip fixed, live stale, deploy blocked |
| P10-title | `<title>My Google AI Studio App</title>` | source `atelier-luxury-salon/index.html` has `<title>Atelier — Luxury Salon</title>` | live serves `My Google AI Studio App` | **VERIFIED_DEPLOYMENT_DELTA** — source fixed, live stale, deploy blocked |
| M003-portfolio-links | No regression test for 9 protected URLs | **FIXED in `3e6e428`** (`tests/portfolio-links.test.mjs` created, registered in `package.json`) | n/a (test) | **VERIFIED_FIXED_LOCAL** |
| M-fails-closed | `AI triage fails closed when no provider is configured` test failing | **FIXED in `3e6e428`** (`apiKey: ***` → `apiKey: ''` — passes through to FALLBACK branch) | n/a (test) | **VERIFIED_FIXED_LOCAL** |
| /owner/reset-password 404 | Reported in WORK_LOG | route exists in app router | 200 OK | **STALE_NOT_REPRODUCED** |
| sitemap.xml host = ironwake-20260810013623-17343 | Reported in WORK_LOG | n/a | n/a | **RECONFIRMED_DEPLOYMENT_DELTA** |

## Frozen items (do not reopen)

- Owner auth: 2FA via Supabase OTP, canonical project `ipcpthmmcdtshbbsirwj`, canonical owner `ironwakee@gmail.com` — frozen
- Public contact `ironwake.dev@gmail.com` is **not** the owner dashboard identity — frozen
- P5 absent — frozen (do not invent)
- 9 protected URL identities — frozen (do not create replacement projects)
- P7 coffee-bean center opener visual contract — frozen
- P9 `dangerouslySetInnerHTML`/raw-HTML injection contract — frozen
- P10 motion/polish quality floor — frozen (do not clone to other portfolios)

## Test / build evidence (reused from cycle 1, fingerprint unchanged)

- `npm test` → 169/169 PASS, 0 fail, fingerprint `3e6e428 @ 2026-08-10`
- `npm run build` → PASS, fingerprint `3e6e428 @ 2026-08-10`
- `tests/portfolio-links.test.mjs` covers all 9 protected URLs and rejects non-vercel host references

## Irreducible gates (this trace)

1. **Netlify production deploy** — `netlify deploy --prod` blocked by IronWake tool policy wrapper. Active trace capabilities: `security-sweep, code-review-gate, dev-process-gates, acquisition`. Missing capability: `deployment`. No in-process path can grant it. This gate blocks the live verification of M004-main and M004-sitemap.
2. **Vercel portfolio deploys (P7, P9, P10)** — `vercel deploy --prod` blocked by the same wrapper with the same missing capability. This gate blocks the live verification of P7/P9/P10 title fixes.

Both gates are valid per Section 32 (tool actually attempted, policy rejected, no legitimate software path remains). The wrapper rejection references the trace id directly, confirming capability-driven enforcement.

## What is done (software-executable)

- 7/7 verified source defects (M004, M004-sitemap, P7/P9/P10 titles, M003 portfolio-links, ai-triage fails-closed) have source fixes in `3e6e428`
- 169/169 tests green
- Build green
- No secrets committed
- No service-role exposure
- No `.gitignore` change
- 6/9 protected portfolio URLs already serve correct live titles (P1, P2, P3, P4, P6, P8) — no deploy needed for those

## Final report (per Section 41)

- `IRONWAKE_SOFTWARE = VERIFIED_FIXED_LOCAL_WAITING_IRREDUCIBLE_EXTERNAL`
- `EXTERNAL_GATES_REMAIN = YES`
  - Netlify production deploy authorization (tool-policy wrapper blocks `netlify deploy --prod`)
  - Vercel portfolio deploy authorization (same wrapper blocks `vercel deploy --prod` for P7, P9, P10)
- Resume path: when an activation trace includes the `deployment` capability and is given to Hermes, the same source diff (`3e6e428`) deploys to existing projects in 2 deploys (1 Netlify main, 1 batched Vercel portfolio).
