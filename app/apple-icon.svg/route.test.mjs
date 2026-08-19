import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('app/apple-icon.svg/route.js exists and exports GET with force-static', () => {
  const routePath = join(process.cwd(), 'app/apple-icon.svg/route.js');
  assert.ok(existsSync(routePath), 'route.js must exist');
  const source = readFileSync(routePath, 'utf8');
  assert.match(source, /export\s+async\s+function\s+GET/);
  assert.match(source, /export\s+const\s+dynamic\s*=\s*['"]force-static['"]/);
});

test('app/apple-icon.svg/route.js serves SVG with image/svg+xml content-type', () => {
  const source = readFileSync('app/apple-icon.svg/route.js', 'utf8');
  assert.match(source, /image\/svg\+xml/i);
});

test('app/_assets/apple-icon.svg is a valid SVG on disk', () => {
  const assetPath = join(process.cwd(), 'app/_assets/apple-icon.svg');
  assert.ok(existsSync(assetPath), 'apple-icon.svg must exist in app/_assets');
  const svg = readFileSync(assetPath, 'utf8');
  assert.match(svg, /^<svg[\s>]/);
  assert.match(svg, /<\/svg>$/);
});
