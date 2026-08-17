# IronWake SEO Interventions — Post-Deploy Evidence — 2026-08-17

Kanban: `t_d6a07044` — SEO interventions production deploy
Parent: `t_ec097c7f` — IRONWAKE SEO INTERVENTIONS
Harness: hermes; model: MiniMax-M3
Lifecycle: verification
Tools: `wrangler versions upload`, `wrangler versions deploy`
Verification: build, `npm test`, live HTTPS checks, deploy counter audit
Deploy counter before: 4/8 used (4 remaining). Counter NOT yet incremented — activation step blocked on named approval; see §5.

---

## TL;DR

| Step | Status | Evidence |
|---|---|---|
| Pre-deploy build (`npm run build:worker`) | ✅ PASS | OpenNext bundle emitted |
| `npm test` (full suite) | ✅ PASS | 298/298, 0 fail, 32.29 s |
| `wrangler versions upload` | ✅ PASS | Version ID `620933ba-23b9-45ba-8bb2-2f96c0443c3e` |
| `wrangler versions deploy … --percentage 100` | ⛔ BLOCKED | Pre-tool policy refused; awaiting `APPROVE DEPLOY620933ba` (see §5) |
| Pre-deploy live spot-check | ✅ Captured | §2 |
| Post-deploy live spot-check | ⏸ Deferred | Will run after activation (§6) |

---

## 1. Build & test verification (pre-deploy gate)

Both ran from `/mnt/c/Users/vanth/Downloads/ironwake` (main repo, master branch) on the exact tree state that produced the staged upload.

`npm run build:worker`:
```
OpenNext — Generating bundle
Bundling middleware function
Bundling static assets
Bundling cache assets
Building server function: default
Applying code patches: 5.226s
Worker saved in `.open-next/worker.js` 🚀
OpenNext build complete.
exit 0
```

`npm test`:
```
# tests 298
# pass 298
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 32294.438793
exit 0
```

In-place fixes applied so the build would close (these are blockers for the parent's deliverable, not drive-by refactors):

- 14 depth-3 page files imported `../../lib/seo.mjs`, which resolved to the non-existent `app/lib/seo.mjs`. Fixed to `../../../lib/seo.mjs` (three `..` to reach the project root from `app/insights/[slug]/`, `app/systems/<slug>/`, `app/work/<slug>/`).
  - `app/insights/[slug]/page.js`
  - `app/systems/ai-receptionist/page.js`, `app/systems/booking-control/page.js`, `app/systems/missed-lead-recovery/page.js`, `app/systems/trust-lead-capture/page.js`
  - `app/work/atelier/page.js`, `app/work/aura-archives/page.js`, `app/work/bramble-cafe/page.js`, `app/work/dentacare-pro/page.js`, `app/work/harbour-estates/page.js`, `app/work/luxe-studio/page.js`, `app/work/rapidpulse/page.js`, `app/work/retech/page.js`, `app/work/voltix/page.js`
- `lib/seo.mjs` imported `siteOrigin` from `./site-origin.mjs`, but that module exports only `canonicalSiteOrigin()`. Inlined the constant as `PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev'`, matching the codebase convention of per-module inlined canonical origin.

These fixes are unblockers — without them, the parent's `npm run build:worker` returns module-not-found and the SEO interventions cannot ship. No unrelated styling / logic changes were made.

---

## 2. Pre-deploy live spot-check (against currently-deployed version `349189d1-8046-4246-abd9-16f078f7cc73`)

Captured 2026-08-17 from `https://ironwake.dev`:

| URL | Status | Body |
|---|---|---|
| `/favicon.ico` | **404** | 18 839 bytes (HTML error body — file missing) |
| `/apple-icon.png` | **404** | 18 848 bytes (HTML error body — file missing) |
| `/logo.png` | **404** | 18 817 bytes (HTML error body — file missing) |
| `/robots.txt` | 200 | 145 bytes (no AI-crawler carve-out) |
| `/sitemap.xml` | 200 | 5 530 bytes (old version, no JSON-LD parity) |
| `/` JSON-LD | absent | `<title>` present but no `<script type="application/ld+json">` block |

These 404s confirm the SEO interventions (favicon.ico, apple-icon.png, logo.png, AI-crawler policy, JSON-LD on `/`) have NOT yet been deployed. They are sitting in the uncommitted tree and now in the parked Cloudflare version `620933ba-…`.

---

## 3. Staged upload — `wrangler versions upload`

```
⛅️ wrangler 4.120.0
🌀 Building list of assets...
✨ Read 72 files from the assets directory /mnt/c/Users/vanth/Downloads/ironwake/.open-next/assets
🌀 Starting asset upload...
🌀 Found 8 new or modified static assets to upload.
+ /BUILD_ID
+ /sitemap.xml
+ /_next/static/chunks/10ql8ewqv6idz.css
+ /favicon.ico
+ /logo.png
+ /_next/static/chunks/00rdik2144bcr.js
+ /_next/static/media/apple-icon.0wwmkazmms0c8.png
+ /_next/static/chunks/0c_3w34e6c7hf.js
Uploaded 8 of 8 assets
Total Upload: 12939.47 KiB / gzip: 2741.28 KiB
Worker Startup Time: 20 ms
Your Worker has access to the following bindings:
env.WORKER_SELF_REFERENCE (ironwake)      Worker
env.ASSETS                                Assets
Uploaded ironwake (16.34 sec)
Worker Version ID: 620933ba-23b9-45ba-8bb2-2f96c0443c3e
```

Observations:
- The 8 new/modified static assets map 1:1 to the parent deliverable: favicon, apple-icon, logo, sitemap, plus the rebuilt BUILD_ID and 3 chunks. The 7 missing files (`/favicon.ico`, `/apple-icon.png`, `/logo.png`) from the pre-deploy spot-check are now in the asset manifest.
- Worker Startup Time: 20 ms (well below the cold-start budget).
- Total gzipped: 2741.28 KiB — within the Cloudflare Free plan 3072 KiB limit, **~331 KiB margin**.
- `wrangler versions upload` does NOT consume the production-deploy counter. Counter remains at 4/8.

---

## 4. Activation — `wrangler versions deploy` — BLOCKED

The next step would be:

```
wrangler versions deploy 620933ba-23b9-45ba-8bb2-2f96c0443c3e --percentage 100
```

This was refused by the pre-tool policy hook:

```
IronWake tool policy blocked this action:
high-risk side effect requires an approved governed action;
Trace: trace-1786967515655-bf29d98d933d
```

Per AGENTS.md §4 (authority class A3), production traffic activation must be preceded by explicit named approval. The task description lists `Approvals: none` but the policy hook is enforcing the higher-priority repository law. The user has not yet issued the gate phrase (`APPROVE DEPLOY620933ba` or equivalent).

**Safe state on hold**:
- The uploaded version `620933ba-…` is parked as an unpublished Worker version. It does not serve production traffic.
- The currently-live version is `349189d1-8046-4246-abd9-16f078f7cc73` (deployed 2026-08-17 06:00:09 UTC, 100%).
- No production traffic has changed.
- The deploy counter is still at 4/8 used; activation would increment it to 5/8.

When the user issues the gate phrase, the only remaining work is:
1. Re-issue `wrangler versions deploy 620933ba-23b9-45ba-8bb2-2f96c0443c3e --percentage 100` with `CLOUDFLARE_API_TOKEN` from the vault.
2. Re-run the live spot-checks in §2 (expect 200s on `/favicon.ico`, `/apple-icon.png`, `/logo.png`; updated `/robots.txt`; updated `/sitemap.xml`; new `<script type="application/ld+json">` on `/`).
3. Update `.ironwake/release/CLOUDFLARE_DEPLOY_LEDGER.json` with this attempt (attempt 6, success).
4. Commit the evidence file and ledger update.

---

## 5. Decision packet — what's blocking and why

- **Gate phrase required**: `APPROVE DEPLOY620933ba` (or any clear authorization that the user accepts the deploy counter being consumed and the SEO interventions being made live).
- **What the user accepts by approving**:
  - 1 of the 4 remaining cycle deploys consumed.
  - Production traffic at `ironwake.dev` and `www.ironwake.dev` will start serving the staged version.
  - Rollback path: `wrangler rollback` (no counter cost).
- **What the user does NOT lose**:
  - The parked version can be inspected at `wrangler versions list` and discarded via `wrangler versions delete 620933ba-…` without ever serving traffic.

No new secrets, credentials, env vars, or provider accounts are introduced by this deploy. All previously known scope holds.

---

## 6. Post-deploy verification plan (deferred until activation)

Once activated, the same script in §2 will be re-run and the expected new state:

| URL | Expected | How |
|---|---|---|
| `/favicon.ico` | 200 | `curl -I https://ironwake.dev/favicon.ico` |
| `/apple-icon.png` | 200 | `curl -I https://ironwake.dev/apple-icon.png` |
| `/logo.png` | 200 | `curl -I https://ironwake.dev/logo.png` |
| `/robots.txt` | 200 with AI-crawler policy | `curl -s https://ironwake.dev/robots.txt` |
| `/sitemap.xml` | 200, 33 URLs (parity with `app/sitemap.js`) | `xmllint --noout` + grep |
| `/` JSON-LD | ≥1 `<script type="application/ld+json">` containing `Organization` | `curl -s https://ironwake.dev/ \| grep -c application/ld+json` |
| `/insights/<slug>` | `Article` JSON-LD | spot-check 1–2 slugs |
| `/systems/<slug>` | `BreadcrumbList` + `Organization` | spot-check 1–2 slugs |
| `/work/<slug>` | `BreadcrumbList` + `Organization` | spot-check 1–2 slugs |

Plus:
- `curl -sI https://www.ironwake.dev/` → confirm 308→apex still works
- `wrangler deployments list` → confirm `620933ba-…` shows (100%)

---

## 7. Files & ledger references

- Evidence (this file): `/mnt/c/Users/vanth/Downloads/ironwake/reports/evidence/IRONWAKE_SEO_INTERVENTIONS_POST_DEPLOY_2026-08-17.md`
- Parent evidence: `/mnt/c/Users/vanth/Downloads/ironwake/reports/evidence/IRONWAKE_SEO_INTERVENTIONS_2026-08-17.md`
- Deploy ledger: `/mnt/c/Users/vanth/Downloads/ironwake/.ironwake/release/CLOUDFLARE_DEPLOY_LEDGER.json` (unchanged; activation entry pending)
- Wrangler config: `/mnt/c/Users/vanth/Downloads/ironwake/wrangler.jsonc`
- Staged upload artifact (parked): Cloudflare Worker version `620933ba-23b9-45ba-8bb2-2f96c0443c3e`
- Currently-live production version: `349189d1-8046-4246-abd9-16f078f7cc73`
- Out-of-scope but adjacent: parent's `IRONWAKE_SEO_INTERVENTIONS_2026-08-17.md` content (32 interventions across 31 pages, 0 tech failures, 91 content passes) is unchanged.

---

## 8. Honesty statement

- Verification (`npm test`, build, upload) is real and was executed against this tree.
- The activation step has not run. The evidence above does NOT claim the SEO interventions are live.
- The blocker is genuine: the deploy-fence policy hook refused the activation command, and the user has not yet issued the gate phrase required by AGENTS.md §4 to override it.
- Rollback: trivial — the parked version never served traffic, so no rollback is needed if the user declines to approve.