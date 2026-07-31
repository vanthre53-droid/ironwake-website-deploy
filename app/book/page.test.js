import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('book page shows a labelled Cal.com placeholder with no live embed and a working fallback', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Cal\.com embed placeholder/);
  assert.match(source, /isn.t connected yet/);
  assert.match(source, /Request a Business Leak Audit/);
  assert.match(source, /href="\/audit"/);
  assert.match(source, /export const metadata/);
  assert.doesNotMatch(source, /<iframe/i);
  assert.doesNotMatch(source, /cal\.com\/embed|calcom|<script/i);
});
