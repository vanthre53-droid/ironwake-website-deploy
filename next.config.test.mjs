import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('application config supplies baseline browser security headers', async () => {
  const config = await readFile(new URL('./next.config.mjs', import.meta.url), 'utf8');
  for (const header of ['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Strict-Transport-Security', 'Permissions-Policy']) {
    assert.match(config, new RegExp(header));
  }
});
