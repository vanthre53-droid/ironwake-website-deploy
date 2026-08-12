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
  assert.match(source, /href="\/login">Sign in/);
  assert.match(source, /href="\/signup">Create account/);
  // ponytail: footer must NOT expose Ask IronWake for anonymous visitors.
  // The customer-only round launcher is the canonical entry for authenticated
  // customers. The /chat route is still reachable via account navigation.
  assert.doesNotMatch(source, /href="\/chat">Ask IronWake/);
});
