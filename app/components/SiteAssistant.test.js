import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site assistant is a truthful static request guide and uses the validated audit request path', async () => {
  const source = await readFile(new URL('./SiteAssistant.js', import.meta.url), 'utf8');
  assert.match(source, /not a live AI chat/);
  assert.match(source, /id="ironwake-assistant"/);
  assert.match(source, /fetch\('\/api\/audit'/);
  assert.match(source, /What does IronWake do\?/);
  assert.match(source, /I agree to be contacted about this request/);
  assert.match(source, /href="\/book"/);
  assert.doesNotMatch(source, /password|payment details|identity documents/i);
});
