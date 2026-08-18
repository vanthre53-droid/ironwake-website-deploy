import { test } from 'node:test';
import assert from 'node:assert';

// Force a key so the FALLBACK isn't relied upon in test environments.
process.env.INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'aabbccddeeff00112233445566778899';

// Next.js route handlers export named exports, so dyn+dynamic+GET should all be present.
const mod = await import('./route.js');

test('IndexNow key endpoint returns text/plain with the env key', async () => {
  assert.strictEqual(typeof mod.GET, 'function', 'handler exports GET');
  const res = await mod.GET();
  assert.strictEqual(res.status, 200);
  const ct = res.headers.get('content-type') || res.headers.get('Content-Type') || '';
  assert.ok(/text\/plain/.test(ct), `content-type should be text/plain, got "${ct}"`);
  const body = await res.text();
  assert.ok(body.trim().length > 0, 'body should not be empty');
  assert.ok(/^[0-9a-f]+$/i.test(body.trim()), `body should be a hex key, got "${body.trim()}"`);
});

test('IndexNow key route is force-static', () => {
  assert.strictEqual(mod.dynamic, 'force-static');
});
