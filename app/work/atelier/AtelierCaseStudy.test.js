import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('atelier case study is labelled demonstration with no client claims', async () => {
  const source = await readFile(new URL('./AtelierCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /DEMONSTRATION/);
  assert.match(source, /AWAITING VERIFICATION/);
  assert.match(source, /SiteHeader/);
  assert.match(source, /SiteFooter/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external links');
  assert.doesNotMatch(source, /client said|our client|measured result|production result/i);
});
