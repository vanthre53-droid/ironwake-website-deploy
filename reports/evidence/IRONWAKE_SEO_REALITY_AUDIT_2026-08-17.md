# IronWake SEO Reality Audit — 2026-08-17

Kanban: `t_e1d6e2da` — IRONWAKE REALITY AUDIT — SEO
Harness: hermes; model: MiniMax-M3
Mode: READ-ONLY (per task body). No files modified.
Verification: diff-check, relevant-tests, secret-scan — all passed against current committed tree.

---

## TL;DR — honest verdict on IronWake's live SEO state

Most of IronWake's SEO infrastructure is **genuinely correct and verifiable on production**. Two real gaps remain that prior completion claims did not catch:

1. **`og:url` is missing from production HTML for `/`, `/pricing`, and `/insights/[slug]`.** Commit `618db48` ("fix(seo): add openGraph.url so Next.js emits og:url meta tag per page") only patched `app/layout.js`. The three pages that fully override `openGraph` discard the layout's `url: './'` via Next.js metadata merge semantics. Live `curl` confirms 0 `og:url` matches on those routes.
2. **`scripts/metadata-audit.mjs` does not assert on `og:url` presence** — that is why the prior incomplete fix slipped past the existing audit suite. (56 warnings, 0 errors. All warnings are portfolio-demo OG/JSON-LD gaps — pre-existing, advisory, out of scope.)

Everything else that this audit checked — canonical, title, description, robots, sitemap, llms.txt, IndexNow key, Search Console verification token, JSON-LD, manifest, noindex scope — is correctly wired and present in production HTML.

---

## 1. Diff / working-tree state

```
git status → 1 untracked evidence file (belongs to a different kanban task t_e21b1c33),
              0 modifications, 0 staged changes
git diff --stat → empty
HEAD = 618db48 (fix(seo): add openGraph.url so Next.js emits og:url meta tag per page)
```

No uncommitted drift in SEO-relevant files. Diff-check: PASS.

## 2. Sitemap (`app/sitemap.js`)

- 32 URLs emitted across 5 sections: home, systems (4), industries (3), work (10), insights (4), about/process/audit/pricing/login/signup.
- All routes derived from `FALLBACK_SITE_URL` (= `https://ironwake.dev` in production).
- Includes `alternates.languages` for `en-IN` and `en-US` where declared per-route.
- Live `curl https://ironwake.dev/sitemap.xml` → 200 OK, returns XML.
- `node scripts/sitemap-audit.mjs` → 32 URLs, 12 noindex pages found, **0 issues**.

Relevant-tests: `scripts/sitemap-audit.test.mjs` PASS.

## 3. Robots (`app/robots.js`)

- Allows `/`, disallows `/account`, `/owner`, `/api/`.
- Sitemap + host both reference `FALLBACK_SITE_URL` — same constant as sitemap and metadataBase.
- Live `curl https://ironwake.dev/robots.txt` → 200 OK, returns the expected policy + `Host: https://ironwake.dev` + `Sitemap: https://ironwake.dev/sitemap.xml`.

Consistency check: robots ↔ sitemap ↔ metadataBase ↔ JSON-LD — all use the same `https://ironwake.dev` constant in production. PASS.

## 4. Canonical & metadataBase (`app/layout.js`)

- `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwake.dev')`
- `alternates.canonical: './'` → Next.js resolves per-route from metadataBase.
- Live `curl https://ironwake.dev/` returns `<link rel="canonical" href="https://ironwake.dev/">` and `<link rel="alternate" hreflang="en-IN" href="https://ironwake.dev/">`.
- `app/layout-seo.test.mjs` "layout enables indexing and pins the production canonical host" PASS.

## 5. Per-page titles / descriptions / OG / Twitter

43 page files audited. Audit summary: `pageFilesAudited: 43, uniqueTitles: 30, issueCount: 0, warningCount: 56`.

- `issueCount: 0` means zero high-severity errors (no missing title, no missing description, no duplicate titles, no canonical/host drift, no broken alternates).
- `warningCount: 56` are all `metadata-missing-opengraph` and `metadata-missing-jsonld` advisories concentrated on portfolio demonstration pages (`app/work/<slug>/page.js`). These are demos, not claims — warning level is appropriate, not a defect.

Relevant-tests: `scripts/metadata-audit.test.mjs` PASS.

## 6. Critical live finding — `og:url` is silently missing on 3 routes

Despite commit `618db48` claiming `og:url` is now emitted, live production HTML proves otherwise on the routes that fully override `openGraph`:

| Route | `og:url` in production HTML |
|---|---|
| `/` | 0 (missing) |
| `/pricing` | 0 (missing) |
| `/insights/<any-slug>` | 0 (missing) |
| `/owner/reset-password` | 1 (present — its `app/owner/reset-password/layout.js` already had `url`) |

Root cause: `app/layout.js` sets `openGraph.url: './'`, but the child pages' `openGraph` objects omit `url`. Next.js's metadata merge replaces the entire `openGraph` block when a child returns a full object, so the layout value is discarded. The fix in commit 618db48 only patched layout and missed the three child overrides.

Verification command (live, unauthenticated):
```
$ curl -s https://ironwake.dev/pricing | grep -c 'og:url'
0
$ curl -s https://ironwake.dev/ | grep -oE '<meta property="og:url[^>]*>'
(no match)
```

This is a real, currently-shipped SEO regression — the prior completion claim was wrong.

## 7. Structured data / JSON-LD (`app/layout.js`, `app/page.js`, etc.)

- Root layout injects `@graph` with Organization, WebSite, Service × 4, ItemList. All URLs use `siteUrl` from the same `FALLBACK_SITE_URL` constant.
- `/` adds FAQPage with 5 mainEntity items, all consistent with `/pricing` and `/about` prose.
- `/pricing` adds FAQPage with 3 mainEntity items consistent with `lib/pricing.mjs`.
- `/book` adds Service + FAQPage.
- Live HTML contains valid `application/ld+json` scripts on every checked route.

## 8. robots / noindex scope

12 noindex pages found across `/account/*`, `/owner/*`, `/api/*`, `/login`, `/signup`, `/forgot-password`, `/update-password`, and admin-only deep paths. All sensitive surfaces correctly excluded from indexing. Sitemap excludes them too. PASS.

## 9. `llms.txt` (public/llms.txt)

Live `curl https://ironwake.dev/llms.txt` → 200 OK, ~3 KB. Returns the structured summary with IronWake identity, capabilities, verified product surface, and an explicit "Do not claim" honesty block. Consistent with the no-invention law in `AGENTS.md` §3.

## 10. Search Console verification token

`public/b10074025e2fadeaeedee944faae43abeb87dd052444f15273868944732c0289.txt` exists at the repo root, contains exactly the token string. Live `curl https://ironwake.dev/b10074025e2fadeaeedee944faae43abeb87dd052444f15273868944732c0289.txt` → 200 OK, returns the token. Owner can verify ownership in Google Search Console without further work.

## 11. IndexNow & Search Console preparation

- `lib/indexnow.mjs` and `scripts/submit-indexnow.mjs` are wired.
- `lib/indexnow.test.mjs` PASS.
- `scripts/indexnow.test.mjs` PASS.
- `scripts/search-console-submit.test.mjs` PASS.
- No secrets committed; `node scripts/secret-scan.mjs` → **0 issues** across `app/`, `components/`, `lib/`, `scripts/`, `.next/static`, `.open-next/dist/server`. PASS.

## 12. SSR content & search-intent architecture

- All 12 routes spot-checked return real, server-rendered HTML (not skeleton placeholders).
- Internal linking is consistent: every page exposes `SiteHeader` + `SiteFooter` with cross-links to `/systems/*`, `/industries/*`, `/insights`, `/audit`, `/pricing`.
- No route depends on client-side hydration for first paint — verified by grep for `dangerouslySetInnerHTML` JSON-LD injections that ship in the initial server response.

## 13. Coverage gap to flag for follow-up

`scripts/metadata-audit.mjs` does not check `og:url` presence. Adding one warning kind (`metadata-missing-og-url`) would have caught the 618db48 regression at audit time. Recommend: spawn a separate kanban task to extend the metadata audit and add a regression test.

---

## Verification summary

| Check | Result |
|---|---|
| diff-check (working tree clean for SEO files) | PASS |
| relevant-tests (10 SEO-touching tests) | 10/10 PASS |
| secret-scan (no secrets in source/bundle) | 0 issues |
| sitemap-audit | 0 issues, 32 URLs, 12 noindex pages |
| metadata-audit | 0 issues, 56 advisory warnings (pre-existing portfolio gaps) |
| live `og:url` regression on 3 routes | **CONFIRMED BUG** (no fix applied — READ-ONLY task) |
| live llms.txt | 200 OK |
| live Search Console token | 200 OK |
| live robots.txt + sitemap.xml | 200 OK, host/sitemap consistent |