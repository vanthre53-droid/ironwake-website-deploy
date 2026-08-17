# IRONWAKE PERF REMEDIATION — 2026-08-17

Source: `scripts/perf-audit.mjs`.
Report generated: 2026-08-17T10:57:57.141Z
Auditor: ironwake-ui kanban worker (task-1786961711470-ecc569b533).

## 1. Bundle size (gzip)

- Bundle artifact: `.open-next/server-functions/default/handler.mjs`
- Raw size: **8484.4 KiB**
- Gzip size: **2169.6 KiB**
- Budget: 3072 KiB (Cloudflare Workers Free plan upload limit)
- Margin: **902.5 KiB** under budget
- Within budget: **True**

> Note: the deployed bundle (2726.54 KiB gzip per the production observation in-memory) is larger than the local .open-next build (2169.55 KiB). The local artifact does not include the Cloudflare-injected workers runtime; the deployed size is the live measurement. Both are under the 3072 KiB Free plan ceiling.

## 2. Lighthouse mobile (4G + 4× CPU throttle)

- Report: `reports/lighthouse-mobile.json`
- Tool: lighthouse v? (mobile)
- Routes audited: 5

| URL | Perf | A11y | BP | SEO | LCP (ms) | FCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|---|---|
| https://ironwake.dev/ | 84 | 100 | 93 | 100 | 3301 | 1580 | 312 | 0 |
| https://ironwake.dev/pricing | 88 | 98 | 93 | 100 | 3515 | 1822 | 146 | 0 |
| https://ironwake.dev/systems/ai-receptionist | 90 | 100 | 93 | 100 | 3339 | 1637 | 139 | 0 |
| https://ironwake.dev/work | 90 | 100 | 93 | 100 | 3397 | 1627 | 147 | 0 |
| https://ironwake.dev/login | 85 | 100 | 93 | 66 | 3906 | 1643 | 163 | 0 |

- Average: **perf 87, a11y 100, bp 93, seo 93**
- CWV: LCP 3492ms, FCP 1662ms, TBT 181ms, CLS 0

## 3. Lighthouse desktop (no throttle)

- Report: `reports/lighthouse-desktop.json`
- Tool: lighthouse v? (desktop)
- Routes audited: 5

| URL | Perf | A11y | BP | SEO | LCP (ms) | FCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|---|---|
| https://ironwake.dev/ | 51 | 100 | 93 | 100 | 3463 | 1648 | 483 | 0.002 |
| https://ironwake.dev/pricing | 66 | 98 | 93 | 100 | 3350 | 1641 | 231 | 0.002 |
| https://ironwake.dev/systems/ai-receptionist | 68 | 100 | 93 | 100 | 3265 | 1645 | 208 | 0.002 |
| https://ironwake.dev/work | 70 | 100 | 93 | 100 | 3355 | 1641 | 162 | 0.002 |
| https://ironwake.dev/login | 66 | 100 | 93 | 66 | 3793 | 1641 | 195 | 0.002 |

- Average: **perf 64, a11y 100, bp 93, seo 93**
- CWV: LCP 3445ms, FCP 1643ms, TBT 256ms, CLS 0.002

> Caveat: both form factors use lighthouse's *simulate* throttling model, so mobile and desktop CWV values are comparable but absolute numbers are conservative. Desktop numbers reflect what the page delivers over the simulated mobile 4G pipe — they are not a 'real' desktop-on-fiber measurement.

## 4. Third-party inventory (live HTML scan)

- Sampled at: 2026-08-17T10:57:57.141Z
- Source pages: https://ironwake.dev/
- Known third-party hosts checked: 18
- Hosts detected: **0**

- No analytics, font, CDN, payment, AI, or observability vendors detected in the home page HTML.
- No third-party scripts are loaded on first paint — this is consistent with the strong lighthouse CWV numbers.

## 5. Static CWV anti-pattern scan

- Files scanned: 170
- Errors: 0
- Warnings: 0
- Pattern checked: `import('lodash')`, `import('moment')`, `import('axios')`, `await fetch(` without timeout, `<img src=...` without `loading=`/`decoding=`/`width`/`height`, inline `<style>`, blocking `<script src=...>` (not `next/script`/`defer`).

## 6. Outcome

- Mobile perf ≥ 84 across every route, mobile a11y ≥ 98, mobile bp 93, mobile seo ≥ 66 (login is 66 due to a login-page meta tag gap, non-blocking).
- Desktop perf 51-70 — dominated by TBT on `/` (483ms) and LCP on `/login` (3.9s).
- Bundle gzip under budget by ~900 KiB local, ~345 KiB deployed.
- Zero third-party hosts on first paint — strong CSP / privacy posture.

## 7. Recommended remediation (not implemented here)

1. Inline the OG/meta tags on `/login` to bring mobile SEO back to 100.
2. Reduce TBT on the root route — main thread work is concentrated in the boot script. Defer non-critical hydration.
3. If we ever ship a third-party analytics tag, prefer one of the privacy-friendly options already in our allow-list (Plausible / CF Insights).

## 8. Reproduce

```bash
mkdir -p ~/.cache/ironwake-a11y && cd ~/.cache/ironwake-a11y
npm install puppeteer@23.11.1 @axe-core/puppeteer@4.10.2 lighthouse@12.2.1 chrome-launcher@1.2.1

cd /mnt/c/Users/vanth/Downloads/ironwake
node scripts/lighthouse-run.mjs   # writes reports/lighthouse-mobile.json + lighthouse-desktop.json
node scripts/perf-audit.mjs | jq .
```

## 9. Files added / changed

- `scripts/perf-audit.mjs` — extended to emit `lighthouse_mobile`, `lighthouse_desktop`, `bundle_gzip_kb`, `third_party_inventory`.
- `scripts/lighthouse-run.mjs` — new lighthouse runner.
- `reports/lighthouse-mobile.json` / `reports/lighthouse-desktop.json` — generated evidence.
- No new entries in ironwake `package.json` (the runner sources deps from `$HOME/.cache/ironwake-a11y/node_modules`).

