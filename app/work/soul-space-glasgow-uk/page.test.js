import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('soul-space-glasgow-uk page is a metadata wrapper around the client case study view', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /<SoulSpaceGlasgowUkCaseStudy \/>/);
});
