import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site header exposes every active route through native navigation', async () => {
  const source = await readFile(new URL('./SiteHeader.js', import.meta.url), 'utf8');
  for (const [href, label] of [
    ['/', 'Home'],
    ['/systems', 'Systems'],
    ['/work', 'Work'],
    ['/process', 'Process'],
    ['/about', 'About']
  ]) {
    assert.match(source, new RegExp(`\\['${href}', '${label}'\\]`));
  }
  assert.match(source, /href="\/audit">Request a Business Leak Audit/);
  assert.match(source, /<details className="mobile-nav">/);
});
