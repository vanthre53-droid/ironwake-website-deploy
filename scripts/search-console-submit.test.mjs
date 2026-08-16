import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const script = pathToFileURL(
  path.resolve('scripts/search-console-submit.mjs')
).href;

test('CLI prints unconfigured code when no credentials', () => {
  const env = { ...process.env };
  for (const k of Object.keys(env)) {
    if (k.startsWith('GOOGLE_SEARCH_') || k.startsWith('IRONWAKE_GOOGLE_SEARCH_')) delete env[k];
  }
  const result = spawnSync('node', ['scripts/search-console-submit.mjs'], {
    env,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, `expected exit 0 for unconfigured, got ${result.status}\nSTDOUT: ${result.stdout}\nSTDERR: ${result.stderr}`);
  const json = JSON.parse(result.stdout);
  assert.equal(json.ok, false);
  assert.equal(json.safeErrorCode, 'search_console_unconfigured');
  // ponytail: never fake a successful submit when caller lacks credentials.
  assert.ok(typeof json.message === 'string' && json.message.length > 0);
});

test('isSearchConsoleConfigured returns false when secrets missing', async () => {
  const mod = await import(script);
  const config = mod.readSearchConsoleConfig({});
  assert.equal(mod.isSearchConsoleConfigured(config), false);
});

test('exchangeRefreshToken returns unconfigured when credentials missing', async () => {
  const mod = await import(script);
  const result = await mod.exchangeRefreshToken({
    clientId: null,
    clientSecret: null,
    refreshToken: null
  });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'search_console_unconfigured');
});

test('submitSitemapToSearchConsole returns unconfigured when not configured', async () => {
  const mod = await import(script);
  const result = await mod.submitSitemapToSearchConsole({
    config: { clientId: null, clientSecret: null, refreshToken: null }
  });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'search_console_unconfigured');
});

test('submitSitemap requires siteUrl, sitemapUrl, and accessToken', async () => {
  const mod = await import(script);
  const result = await mod.submitSitemap({ siteUrl: null, sitemapUrl: null, accessToken: null });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'search_console_missing_arguments');
});

test('exchangeRefreshToken surfaces fetch error without throwing', async () => {
  const mod = await import(script);
  const result = await mod.exchangeRefreshToken({
    clientId: 'x',
    clientSecret: 'x',
    refreshToken: 'x',
    fetchImpl: async () => { throw new Error('network down'); }
  });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'search_console_network_unreachable');
});
