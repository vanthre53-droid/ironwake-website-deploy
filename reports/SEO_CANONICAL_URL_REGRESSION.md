# SEO Canonical URL Regression — Found and Fixed 2026-08-08

## Symptom (observed on production)

The deployed `https://lucent-sunflower-966982.netlify.app/` (the current Netlify site) was serving:

- `/sitemap.xml` — `<loc>` URLs all pointed at `https://ironwake-app.netlify.app/...` (an OLD Netlify subdomain, site id `4643d967`)
- `/robots.txt` — `Sitemap: https://ironwake-app.netlify.app/sitemap.xml`
- JSON-LD on every page (from `app/layout.js`) — all `url` fields hardcoded to `https://ironwake.netlify.app/...` (a third, historical Netlify subdomain)

This is a real SEO bug: search engines crawling the current site would index URLs that either 404 (ironwake-app.netlify.app now serves a redirect or different content) or be told a canonical at a host the site no longer lives on (ironwake.netlify.app).

## Root cause

Three hardcoded host strings in source, with no environment-variable override:

1. `app/sitemap.js:2` — `const base = 'https://ironwake-app.netlify.app';`
2. `app/robots.js:7` — `sitemap: 'https://ironwake-app.netlify.app/sitemap.xml',`
3. `app/layout.js:23-34` — all JSON-LD `@type` `url` fields hardcoded to `'https://ironwake.netlify.app/...'`

These were left over from an earlier Netlify deployment (`4643d967`) that has since been replaced by the current site (`dbc60402`).

## Fix (commit 0195f0a)

- All three files now read `process.env.NEXT_PUBLIC_SITE_URL` with `https://lucent-sunflower-966982.netlify.app` as fallback.
- The fallback matches the current production host exactly, so even without an env var configured on Netlify, the prerendered sitemap/robots will be correct.
- If/when `ironwake.dev` (or another domain) is set up, setting `NEXT_PUBLIC_SITE_URL=https://ironwake.dev` on Netlify (without touching source) will retarget all three.

## Verification (local)

- `npm run build` → clean, 35 routes.
- Prerendered sitemap body shows `<loc>https://lucent-sunflower-966982.netlify.app</loc>` and child URLs.
- Prerendered robots body shows `Sitemap: https://lucent-sunflower-966982.netlify.app/sitemap.xml`.
- 73/73 tests pass.

## Deployment status

**Not yet deployed.** The local commits 0195f0a and 9527a77 (matrix update) are in `master` but the most recent Netlify build is still on commit `40dd8d1`. The tool policy in this session gates `netlify deploy --prod` behind an owner-approved governed action. Until the owner triggers a fresh build, the deployed `/sitemap.xml` and `/robots.txt` still reference the OLD hosts.

## Owner action (one step)

Trigger a fresh Netlify build for site `dbc60402-b4ac-42d1-b8aa-9d331cf01cfa`. Either:

1. From the Netlify dashboard → Deploys → "Trigger deploy" → "Deploy site" (no rebuild needed if you use the existing build cache), OR
2. From a local shell: `NETLIFY_AUTH_TOKEN=<your token> netlify deploy --prod --no-build --site dbc60402-b4ac-42d1-b8aa-9d331cf01cfa --message "seo: canonical URL fix"`.

After deploy, verify with:

```
curl -s https://lucent-sunflower-966982.netlify.app/sitemap.xml | grep -c 'lucent-sunflower'
curl -s https://lucent-sunflower-966982.netlify.app/robots.txt | grep 'Sitemap'
curl -s https://lucent-sunflower-966982.netlify.app/ | grep -oE 'https://[a-z0-9.-]+/audit' | sort -u
```

All three should show `lucent-sunflower-966982.netlify.app` (not `ironwake-app.netlify.app` or `ironwake.netlify.app`).