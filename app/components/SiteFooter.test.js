import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site footer keeps the demonstration disclosure and active legal drafts', async () => {
  const source = await readFile(new URL('./SiteFooter.js', import.meta.url), 'utf8');
  assert.match(source, /Demonstrations are labelled/);
  assert.match(source, /href="\/privacy"/);
  assert.match(source, /href="\/terms"/);
  assert.match(source, /href="\/industries"/);
});