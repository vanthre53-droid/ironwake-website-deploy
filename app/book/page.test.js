import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('book page provides a truthful calendar-request preview with no live embed', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /BookingPreview/);
  assert.match(source, /does not confirm an appointment or send a calendar invitation/);
  assert.match(source, /export const metadata/);
  assert.doesNotMatch(source, /<iframe/i);
  // ponytail: forbid calendar embeds; allow JSON-LD <script type="application/ld+json"> blocks (SEO)
  assert.doesNotMatch(source, /cal\.com\/embed|calcom/);
});
