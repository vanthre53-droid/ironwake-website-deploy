import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('booking lifecycle persists a request without reserving or confirming a calendar slot', async () => {
  const sql = await readFile(new URL('./20260809130000_request_only_booking_lifecycle.sql', import.meta.url), 'utf8');
  for (const status of ['REQUEST_RECEIVED', 'REVIEWING', 'CONFIRMED', 'NEEDS_FOLLOW_UP', 'CANCELLED', 'FAILED']) {
    assert.match(sql, new RegExp(`'${status}'`));
  }
  assert.match(sql, /case when v_is_booking then 'REQUEST_RECEIVED'/i);
  assert.match(sql, /case when v_is_booking then 'Review booking request'/i);
  assert.match(sql, /booking_request_received/i);
  assert.match(sql, /owner_new_booking_request[\s\S]*?customer_booking_request_received/i);
  const executable = sql.replace(/^--.*$/gm, '');
  assert.doesNotMatch(executable, /calendar|http_post|fetch|smtp|resend\.emails|send_email/i);
});
