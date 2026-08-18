import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const routeSrc = readFileSync(path.join(here, 'route.js'), 'utf8');
const manifestSrc = readFileSync(path.join(here, '..', 'manifest.json'), 'utf8');

const routeMod = await import('./route.js');

test('manifest route returns valid manifest with correct content-type', async () => {
  assert.strictEqual(typeof routeMod.GET, 'function', 'handler exports GET');
  const res = await routeMod.GET();
  assert.strictEqual(res.status, 200, 'should be 200 not 500');
  const ct = res.headers.get('content-type') || res.headers.get('Content-Type') || '';
  assert.ok(/application\/manifest\+json/.test(ct), `content-type should be application/manifest+json, got "${ct}"`);
  const body = await res.text();
  const parsed = JSON.parse(body);
  assert.strictEqual(parsed.name, 'IronWake — Systems that answer', 'name must match');
  assert.strictEqual(parsed.start_url, '/', 'start_url must be "/"');
  assert.ok(Array.isArray(parsed.icons) && parsed.icons.length >= 1, 'has at least one icon');
});

test('manifest route is force-static', () => {
  assert.strictEqual(routeMod.dynamic, 'force-static');
});

test('manifest.json and route.js inlined manifest are in sync', () => {
  // Extract the inlined JSON literal from route.js for the parity check.
  const match = routeSrc.match(/const MANIFEST\s*=\s*(\{[\s\S]*?\});/);
  assert.ok(match, 'route.js should define const MANIFEST = {...}');
  // Normalise whitespace before comparing because route.js uses pretty-print.
  const inlined = JSON.stringify(JSON.parse(match[1]));
  const onDisk  = JSON.stringify(JSON.parse(manifestSrc));
  assert.strictEqual(inlined, onDisk, 'inlined MANIFEST must equal ../manifest.json');
});
