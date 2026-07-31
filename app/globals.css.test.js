import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('globals.css defines a dark theme without a manual toggle dependency', async () => {
  const source = await readFile(new URL('./globals.css', import.meta.url), 'utf8');
  assert.match(source, /@media \(prefers-color-scheme: dark\)/);
  assert.match(source, /--paper: #111110;/);
  assert.match(source, /color-scheme: dark;/);
  assert.match(source, /color-scheme: light;/);
  const rawSurfaceLiteralCount = (source.match(/rgb\(255 255 255 \/ \.6\)/g) || []).length;
  assert.equal(rawSurfaceLiteralCount, 1, 'the literal only belongs in the --surface token definition; every other rule must reference var(--surface)');
});
