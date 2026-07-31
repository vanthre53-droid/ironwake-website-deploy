import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('process page describes the map/fix/test/document method without SLA or price claims', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Map\. Fix\. Test\. Document\./);
  assert.match(source, /'01 \/ map', 'Map'/);
  assert.match(source, /'02 \/ fix', 'Fix'/);
  assert.match(source, /'03 \/ test', 'Test'/);
  assert.match(source, /'04 \/ document', 'Document'/);
  assert.match(source, /Request scope/);
  assert.match(source, /export const metadata/);
  assert.match(source, /does not commit IronWake to a fixed timeline, price, or guaranteed outcome/);
  assert.doesNotMatch(source, /we guarantee|guaranteed results|guaranteed to|SLA of|\$\d|₹\d/i);
});
