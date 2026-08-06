import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Voltix case study is labelled demonstration with no external demo link or metrics', async () => {
  const source = await readFile(new URL('./VoltixCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /PORTFOLIO DEMONSTRATION/);
  assert.match(source, /Demonstration only/);
  assert.match(source, /does not represent a client relationship/);
  assert.doesNotMatch(source, /https?:\/\/(?!localhost)/);
});
