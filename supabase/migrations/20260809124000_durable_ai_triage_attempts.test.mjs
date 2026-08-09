import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('durable AI triage migration stores only safe provider attempt metadata', async () => {
  const source = await readFile(new URL('./20260809124000_durable_ai_triage_attempts.sql', import.meta.url), 'utf8');
  assert.match(source, /triage_provider text/);
  assert.match(source, /triage_error_code text/);
  assert.match(source, /triage_attempted_at timestamptz/);
  assert.match(source, /inquiries_triage_attempted_at_idx/);
  assert.doesNotMatch(source, /add column[^;]*(api[_ -]?key|authorization)/i);
});
