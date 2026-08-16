import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('IronWake deploy-verified-fixes does not contain a Netlify main entry or Netlify hosting URL', async () => {
  const source = await readFile(new URL('./deploy-verified-fixes.mjs', import.meta.url), 'utf8');
  // ponytail: Netlify is forbidden as IronWake hosting per Goal §2.
  // We forbid only the runtime artifacts (URL, site id, token env var)
  // so historical/architectural comments explaining the removal are allowed.
  assert.doesNotMatch(source, /1927c0b3-532f-469c-b302-1d96cb9c7367/);
  assert.doesNotMatch(source, /ironwake-system\.netlify\.app/);
  assert.doesNotMatch(source, /NETLIFY_TOKEN/);
  assert.doesNotMatch(source, /NETLIFY_SITE_ID/);
  assert.doesNotMatch(source, /netlify\s+deploy/);
});

test('IronWake deploy-verified-fixes declares deployable external portfolio targets', async () => {
  const source = await readFile(new URL('./deploy-verified-fixes.mjs', import.meta.url), 'utf8');
  // ponytail: the remaining deploys must point to verified portfolio
  // destinations, not IronWake production hosting.
  assert.match(source, /bramble-cafe\.vercel\.app/);
});

test('IronWake deploy-verified-fixes still declares a deploy array', async () => {
  const source = await readFile(new URL('./deploy-verified-fixes.mjs', import.meta.url), 'utf8');
  assert.match(source, /const\s+deploys\s*=\s*\[/);
  assert.match(source, /label:\s*['"]/);
});
