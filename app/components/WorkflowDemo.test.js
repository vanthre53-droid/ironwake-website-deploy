import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('workflow demo does not represent an unimplemented named owner assignment as live', async () => {
  const source = await readFile(new URL('./WorkflowDemo.js', import.meta.url), 'utf8');

  assert.match(source, /Review task created/);
  assert.match(source, /Due date recorded; no named assignee/);
  assert.match(source, /Owner review is required/);
  assert.doesNotMatch(source, /Owner assigned/);
  assert.doesNotMatch(source, /Named person, real due date/);
});
