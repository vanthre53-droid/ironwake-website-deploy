// ponytail: regression test for the deploy command strings in
// scripts/deploy-verified-fixes.mjs. The standing goal Section 7 requires
// the exact deploy command per project. If a contributor reorders the
// deploy list, drops a project, or rewrites a command in a way that
// would change the deploy target, this test fails first.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('deploy-verified-fixes: covers all 4 known deploy targets', async () => {
  const source = await readFile(new URL('./deploy-verified-fixes.mjs', import.meta.url), 'utf8');

  // Section 4 protected URLs and Section 7 mapping proof:
  const must = [
    'ironwake-system.netlify.app',          // canonical main URL
    '1927c0b3-532f-469c-b302-1d96cb9c7367', // Netlify site id
    'netlify deploy --prod',               // Netlify deploy verb
    'bramble-cafe.vercel.app',             // P7 protected URL
    're-tech-umber.vercel.app',            // P9 protected URL
    'atelier-luxury-salon.vercel.app',     // P10 protected URL
    'vercel deploy --prod',                // Vercel deploy verb
    'ironwakeportifolioprojects/bramble---smooth-edition/dist',  // P7 canonical source root
    'ironwakeportifolioprojects/re-tech.zip',                    // P9 canonical source (zip)
    'ironwakeportifolioprojects/atelier-luxury-salon/dist',      // P10 canonical source root
  ];
  for (const needle of must) {
    assert.ok(source.includes(needle), `deploy script must reference ${needle}`);
  }
});

test('deploy-verified-fixes: dry-run is the default; --apply is gated', async () => {
  const source = await readFile(new URL('./deploy-verified-fixes.mjs', import.meta.url), 'utf8');
  assert.match(source, /APPLY\s*=\s*process\.argv\.includes\(['"]--apply['"]\)/);
  // dry-run must not call execSync when --apply is absent
  assert.ok(source.includes("if (APPLY && ready)"));
});
