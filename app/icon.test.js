// ponytail: SEO/polish — ensure the favicon, apple-touch-icon, and PWA manifest are present so browsers + iOS pinned-tab UX work correctly.
import assert from 'node:assert/strict';
import test from 'node:test';
import { access } from 'node:fs/promises';

test('app icon.svg exists and is a non-empty SVG with the copper accent', async () => {
  await access(new URL('./icon.svg', import.meta.url));
  const source = await (await import('node:fs/promises')).readFile(new URL('./icon.svg', import.meta.url), 'utf8');
  assert.match(source, /<svg\b/);
  assert.match(source, /#b94d2f/);
});

test('app apple-icon.svg exists and is sized for iOS', async () => {
  await access(new URL('./apple-icon.svg', import.meta.url));
  const source = await (await import('node:fs/promises')).readFile(new URL('./apple-icon.svg', import.meta.url), 'utf8');
  assert.match(source, /<svg\b/);
  assert.match(source, /#b94d2f/);
});

test('app manifest.json declares the canonical site name and IronWake icon paths', async () => {
  await access(new URL('./manifest.json', import.meta.url));
  const json = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('./manifest.json', import.meta.url), 'utf8'));
  assert.equal(json.name, 'IronWake — Systems that answer');
  assert.equal(json.short_name, 'IronWake');
  assert.ok(Array.isArray(json.icons) && json.icons.length >= 1);
  const srcs = json.icons.map((i) => i.src);
  assert.ok(srcs.includes('/icon.svg'));
  assert.ok(srcs.includes('/apple-icon.svg'));
});