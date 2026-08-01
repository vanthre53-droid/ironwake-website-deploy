import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('scope page presents engagement shapes and boundaries without inventing public prices', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Business Leak Audit/);
  assert.match(source, /Workflow build/);
  assert.match(source, /Operating support/);
  assert.match(source, /Provider and hosting costs/);
  assert.match(source, /Prices remain private/);
  assert.doesNotMatch(source, /₹|\$\d|USD|INR/);
});
