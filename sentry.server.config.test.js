import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('server Sentry config stays inert without a configured DSN and never wraps next.config', async () => {
  const source = await readFile(new URL('./sentry.server.config.js', import.meta.url), 'utf8');
  assert.match(source, /getServerDsn/);
  assert.match(source, /if \(dsn\) \{/);
  assert.match(source, /Sentry\.init/);
  assert.doesNotMatch(source, /withSentryConfig/);
});
