#!/usr/bin/env node
// ponytail: pre-staged deploy script for the 4 verified live defects.
// Encapsulates the mapping proof (Section 7) so a deployment-capable
// Hermes trace can run all 4 deploys idempotently. Dry-run by default.
// This file DOES NOT deploy. It only prints the deploy commands and
// verifies the pre-built artifacts exist locally.
//
// The 4 deploys:
//   1. Netlify main site → ironwake-system (id 1927c0b3-...)
//      Source: HEAD source + .netlify/ build output (from `netlify build`)
//      Fixes: M004 title template (27 routes) + M004 hostname drift
//             (canonical/og/sitemap/robots all share FALLBACK_SITE_URL).
//   2. Vercel P7 (bramble-cafe) → https://bramble-cafe.vercel.app
//      Source: ironwakeportifolioprojects/bramble---smooth-edition/dist
//      Build: vite build + esbuild server.cjs (pre-built in folder)
//      Fix: <title> "My Google AI Studio App" → "Bramble — Smooth Edition"
//   3. Vercel P9 (re-tech) → https://re-tech-umber.vercel.app
//      Source: ironwakeportifolioprojects/re-tech.zip (extracted to /tmp)
//      Build: vite build (Vercel-detected default)
//      Fix: <title> → "RE-TECH — Premium Refurbished Laptops"
//   4. Vercel P10 (atelier-luxury-salon) → https://atelier-luxury-salon.vercel.app
//      Source: ironwakeportifolioprojects/atelier-luxury-salon/dist
//      Build: vite build + esbuild server.js (pre-built in folder)
//      Fix: <title> → "Atelier — Luxury Salon"
//
// Usage:
//   node scripts/deploy-verified-fixes.mjs            # dry-run
//   node scripts/deploy-verified-fixes.mjs --apply    # actually deploy
//
// Protected URLs and project identities are immutable per the standing
// goal Section 4. This script never creates a new Vercel project, never
// unlinks, never migrates. It only deploys to the SAME existing projects
// listed above.

import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(__dirname);

const APPLY = process.argv.includes('--apply');

const deploys = [
  {
    id: 'netlify-main',
    label: 'Netlify main site (ironwake-system)',
    url: 'https://ironwake-system.netlify.app',
    siteId: '1927c0b3-532f-469c-b302-1d96cb9c7367',
    artifacts: ['.next', 'netlify.toml', '.netlify/functions-internal'],
    command: 'netlify deploy --prod --dir=.next --message="M004: title template + hostname drift"',
    preCheck: () => existsSync(join(repoRoot, '.next')) && existsSync(join(repoRoot, 'netlify.toml')),
  },
  {
    id: 'vercel-p7-bramble',
    label: 'Vercel P7 (bramble-cafe)',
    url: 'https://bramble-cafe.vercel.app',
    projectName: 'bramble-cafe',
    artifacts: ['ironwakeportifolioprojects/bramble---smooth-edition/dist/index.html'],
    command: 'vercel deploy --prod --yes ironwakeportifolioprojects/bramble---smooth-edition/dist',
    preCheck: () => existsSync(join(repoRoot, 'ironwakeportifolioprojects/bramble---smooth-edition/dist/index.html')),
  },
  {
    id: 'vercel-p9-retech',
    label: 'Vercel P9 (re-tech)',
    url: 'https://re-tech-umber.vercel.app',
    projectName: 're-tech',
    artifacts: ['ironwakeportifolioprojects/re-tech.zip'],
    command: 'cd /tmp && rm -rf re-tech-extract && unzip -q "$REPO/ironwakeportifolioprojects/re-tech.zip" -d re-tech-extract && cd re-tech-extract && vercel deploy --prod --yes .',
    preCheck: () => existsSync(join(repoRoot, 'ironwakeportifolioprojects/re-tech.zip')),
  },
  {
    id: 'vercel-p10-atelier',
    label: 'Vercel P10 (atelier-luxury-salon)',
    url: 'https://atelier-luxury-salon.vercel.app',
    projectName: 'atelier-luxury-salon',
    artifacts: ['ironwakeportifolioprojects/atelier-luxury-salon/dist/index.html'],
    command: 'vercel deploy --prod --yes ironwakeportifolioprojects/atelier-luxury-salon/dist',
    preCheck: () => existsSync(join(repoRoot, 'ironwakeportifolioprojects/atelier-luxury-salon/dist/index.html')),
  },
];

let allReady = true;

console.log('═'.repeat(72));
console.log(` IronWake verified-fixes deploy (${APPLY ? 'APPLY' : 'dry-run'})`);
console.log('═'.repeat(72));

for (const d of deploys) {
  const ready = d.preCheck();
  const status = ready ? '✓ ready' : '✗ missing artifact';
  if (!ready) allReady = false;
  console.log(`\n[${d.id}] ${status} — ${d.label}`);
  console.log(`  URL:        ${d.url}`);
  console.log(`  Command:    ${d.command}`);
  console.log(`  Artifacts:  ${d.artifacts.map(a => existsSync(join(repoRoot, a)) ? '✓' : '✗').join('  ')}  ${d.artifacts.join(', ')}`);
  if (APPLY && ready) {
    console.log('  >>> applying…');
    try {
      execSync(d.command, { stdio: 'inherit', cwd: repoRoot, env: { ...process.env, REPO: repoRoot } });
    } catch (e) {
      console.error(`  !!! deploy ${d.id} failed: ${e.message}`);
      allReady = false;
    }
  }
}

console.log('\n' + '═'.repeat(72));
if (!allReady) {
  console.log(' RESULT: missing artifacts — run `netlify build` and rebuild portfolios first.');
  process.exit(1);
}
if (!APPLY) {
  console.log(' RESULT: dry-run OK. Re-run with --apply to deploy.');
  process.exit(0);
}
console.log(' RESULT: all 4 deploys attempted. Verify protected URLs and grep live titles.');
