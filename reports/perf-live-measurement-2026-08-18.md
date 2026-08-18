# Live-site performance measurement — ironwake.dev

- **Date:** 2026-08-18 (Tue, 02:20 UTC)
- **Probe:** `curl 8.x`, WSL → Cloudflare edge (`cf-ray: a2cd7…-SIN`, `cf-placement: local-SIN`)
- **Protocol:** HTTP/2, alt-svc h3 advertised
- **Backend:** Next.js on Cloudflare via OpenNext (`x-powered-by: Next.js`, `x-opennext: 1`)
- **All three routes returned:** `HTTP/2 200`

## TTFB / timing (`-w`)

| Route | DNS | TCP | TLS | TTFB (`time_starttransfer`) | Total |
|---|---:|---:|---:|---:|---:|
| `/`         | 73 ms | 148 ms | 128 ms | **506 ms** | 506 ms |
| `/pricing`  | 71 ms | 90 ms  | 118 ms | **454 ms** | 454 ms |
| `/audit`    | 78 ms | 147 ms | 154 ms | **1232 ms** | 1232 ms |

- 3-run repeat on `/`: TTFB 470 / 536 / 450 ms → median ~470 ms, jitter ~85 ms.
- `/audit` is the cold outlier (~1.23 s); likely first cache-MISS + dynamic generation. Subsequent hits against the same CDN POP should land on the prerendered artifact (`x-nextjs-prerender: 1`).

## Response headers (live)

Common to all three:
- `content-encoding: br` (Brotli) — compressed transport ✓
- `cache-control: s-maxage=31536000` (1 year shared cache) ✓
- `etag: "ix…"/"hj…"/"h1…"` — strong validators ✓
- `x-nextjs-cache: MISS` (first probe), `x-nextjs-prerender: 1`, `x-nextjs-stale-time: 300`
- `vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch` — Next.js RSC routing vary
- Security headers present: `strict-transport-security`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, CSP (default-src 'self'), `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy: camera=(), microphone=(), geolocation=()`

Per-route HTML size (uncompressed `content-length`):
- `/` — 61,711 B
- `/pricing` — 28,683 B
- `/audit` — 22,314 B

## Verdict

- Edge hit ✓ — all three pages served from Cloudflare POP `SIN`, Brotli on, HSTS + CSP + XFO present, 1-year `s-maxage` shared cache with strong ETags.
- TTFB on `/` and `/pricing` ~450–500 ms (TLS ~120 ms dominates; server work after TLS ~330 ms). Solid for a dynamic Next.js route through OpenNext, not "static CDN fast" — these are first-byte prerender MISSes.
- `/audit` ~1.23 s first hit, well above the 500 ms bar. Needs a warm-up or edge-cache hit on the second probe to be acceptable. If `s-maxage=31536000` is honored at the CDN, any second request within a year should be sub-100 ms TTFB.

## Issues / follow-ups

- `/` payload is large (61 KB uncompressed HTML) — Brotli compresses it for transfer, but the DOM still ships that much. Worth profiling for above-the-fold-only streaming or component-level hydration deferral.
- `cache-control` is `s-maxage=31536000` only — no `max-age` for browsers, so end users revalidate every navigation. Add `max-age` (e.g., `max-age=300, s-maxage=31536000, stale-while-revalidate=600`) if private caching is acceptable.
- `vary` includes Next.js RSC internal keys — fine for correctness, but check that no upstream layer strips/duplicates them on cache key derivation.
- `x-nextjs-cache: MISS` on all three first probes suggests the cache was cold in this POP/session. Re-probe after a 1 s delay to see HIT/WARN; if it stays MISS for a 2nd hit, the OpenNext cache adapter may not be writing the artifact for these routes.

## Re-probe commands

```bash
curl -sI -H "Accept-Encoding: gzip, br" -w "ttfb=%{time_starttransfer}s total=%{time_total}s\n" -o /dev/null https://ironwake.dev/
curl -sI -H "Accept-Encoding: gzip, br" -w "ttfb=%{time_starttransfer}s total=%{time_total}s\n" -o /dev/null https://ironwake.dev/pricing
curl -sI -H "Accept-Encoding: gzip, br" -w "ttfb=%{time_starttransfer}s total=%{time_total}s\n" -o /dev/null https://ironwake.dev/audit
```
