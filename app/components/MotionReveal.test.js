import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('motion reveal uses a one-shot observer and activates immediately for reduced motion', async () => {
  const source = await readFile(new URL('./MotionReveal.js', import.meta.url), 'utf8');
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /motion-reveal/);
});
