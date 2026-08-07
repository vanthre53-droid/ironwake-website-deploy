import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site header exposes every active route through native navigation', async () => {
  const source = await readFile(new URL('./SiteHeader.js', import.meta.url), 'utf8');
  for (const [href, label] of [
    ['/', 'Home'],
    ['/work', 'Work'],
    ['/systems', 'Services'],
    ['/systems/ai-receptionist', 'AI Systems'],
    ['/process', 'Process'],
    ['/pricing', 'Pricing'],
    ['/insights', 'Insights'],
    ['/about', 'About']
  ]) {
    assert.match(source, new RegExp(`\\['${href}', '${label}'\\]`));
  }
  assert.match(source, /href="\/audit">Book Diagnostic/);
  assert.match(source, /<details className="mobile-nav">/);
});
