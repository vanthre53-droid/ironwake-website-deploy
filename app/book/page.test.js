import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('book page provides a truthful calendar-request preview with no live embed', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /BookingPreview/);
  assert.match(source, /Calendar confirmation is not connected yet/);
  assert.match(source, /export const metadata/);
  assert.doesNotMatch(source, /<iframe/i);
  assert.doesNotMatch(source, /cal\.com\/embed|calcom|<script/i);
});
