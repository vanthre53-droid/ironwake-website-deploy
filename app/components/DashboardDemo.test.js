import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dashboard illustration does not claim fictional rows or named assignment are live', async () => {
  const source = await readFile(new URL('./DashboardDemo.js', import.meta.url), 'utf8');

  assert.match(source, /fictional illustration/);
  assert.match(source, /named assignment is not connected on this site/);
  assert.match(source, /Named assignment not connected/);
  assert.match(source, /MFA-authenticated owner-session proof remains pending/);
  assert.doesNotMatch(source, /Every enquiry has a named owner/);
  assert.doesNotMatch(source, /shows real enquiry data/);
});
