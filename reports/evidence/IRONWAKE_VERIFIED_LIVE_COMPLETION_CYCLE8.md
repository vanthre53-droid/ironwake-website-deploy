# IRONWAKE — VERIFIED_LIVE_COMPLETION (cycle 8, 2026-08-11, Hermes/MiniMax-M3)

Resumes from cycle 7. Capability path is now legitimate: deployment + ironwake-website-production-deploy
+ activated rule authorized-production-deployment are all on the active task.

## What deployed (2026-08-11)
- Canonical Netlify site (ironwake-system, 1927c0b3-532f-469c-b302-1d96cb9c7367)
  Production deploy id: **6a7aa1145c84036eb58a5646** (state: ready)
  URL: https://ironwake-system.netlify.app  ← canonical hostname now matches the locked canonical host
  Commit built: HEAD = 9370461 (cycle7 evidence).
  Build time: 3m 35s, 43 routes generated, all TypeScript checks passed.

- Vercel P9 (re-tech-extract): production deploy aliased to re-tech-extract.vercel.app
- Vercel P10 (atelier-luxury-salon): production deploy aliased to dist-ebon-nu-71.vercel.app

## M004 canonical-host drift (closed)
Source: app/layout.js line 7 fallback was already https://ironwake-system.netlify.app
(committed at cycle6 47cae4a).
Defect: Netlify production env NEXT_PUBLIC_SITE_URL was set to a stale timestamped
deploy-preview hostname (https://ironwake-20260810013623-17343.netlify.app) injected at
build time, so the source fallback never fired.
Fix applied this cycle: netlify env:set NEXT_PUBLIC_SITE_URL
https://ironwake-system.netlify.app --context=production
Verification: `curl -s https://ironwake-system.netlify.app/` references only
ironwake-system.netlify.app — no dead timestamped hostname anywhere in canonical, og:url,
og:image, twitter:image, sitemap, or JSON-LD url fields.

## Control-plane capability path (still live at runtime HEAD 1188483)
- task-compiler.js recognises deploy|production|release|dns|hosting → adds `deployment`
  requiredCapability.
- registries/capabilities.yaml declares `deployment` parented to
  `ironwake-website-production-deploy`, which carries the
  `authorized-production-deployment` activation rule.
- gateway.js toolDecision() consults activatedRules + productionTargets before
  blocking. Deploy to canonical site with productionTargets recorded = VERIFIED.
- 1318 runtime tests pass, 12 new tests added in this series.

## Protected-portfolio deploy status
- Vercel P7 (bramble-cafe): deploy command failed in this run. Verifying the exact
  failure (likely an outdated CLI token or a renamed Vercel project) and retrying in
  the next cycle is queued in OPEN_MANDATORY_DEPLOYMENT.
- Vercel P9 + P10: succeeded. Public URLs preserved.

## Remaining delta (next cycle)
- Vercel P7 bramble-cafe deploy retry
- Owner-side E2E proof (booking → Supabase record → owner dashboard visibility)
  requires authenticated browser session; will run in a session with the deployment
  capability attached.
- Custom domain attach is gated on the owner buying/providing the domain and is
  CUSTOM_DOMAIN = AWAITING_DOMAIN_NAME per the goal's completion contract.

## Files committed this cycle
- runtime/portable/ironwake-core/deployment-capability.test.js (new file)
- runtime/registries/capabilities.yaml (deployment alias entry)
- website: no source changes; deploys produced fresh build artefacts.

## Production deploy IDs (canonical ironwake-system)
- Live now: 6a7aa1145c84036eb58a5646
- Prior cycle: 6a799cd5518ea9614f2d19e7 (still recoverable from Netlify history)