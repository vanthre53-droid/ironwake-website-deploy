import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site footer keeps the demonstration disclosure and active links', async () => {
  const source = await readFile(new URL('./SiteFooter.js', import.meta.url), 'utf8');
  assert.match(source, /Demonstrations and pending providers are clearly labelled/);
  assert.match(source, /record a review task/);
  assert.doesNotMatch(source, /assign a named owner/);
  assert.match(source, /href="\/privacy"/);
  assert.match(source, /href="\/terms"/);
  assert.match(source, /href="\/pricing"/);
  assert.match(source, /href="\/insights"/);
});
