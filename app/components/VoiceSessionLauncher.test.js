import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

// ponytail: the launcher's SDK loader MUST resolve the ctor via the
// module namespace's `.RetellWebClient` export. microbundle@0.15 also
// emits a truthy `default` namespace object, so a naive `mod.default ??
// mod.RetellWebClient` returns the wrong thing and `new` throws at
// runtime — locks in the correct resolution shape.

test('VoiceSessionLauncher imports retell-client-js-sdk (no @ scope)', async () => {
  const source = await readFile(new URL('./VoiceSessionLauncher.js', import.meta.url), 'utf8');
  assert.match(source, /'retell-client-js-sdk'/);
  assert.doesNotMatch(source, /['"]@retell\/client-sdk['"]/);
});

test('VoiceSessionLauncher loadRetellSdk resolves ctor via .RetellWebClient (not mod.default)', async () => {
  const source = await readFile(new URL('./VoiceSessionLauncher.js', import.meta.url), 'utf8');
  // Lock the resolution order: namespace export first, default-fallback second.
  assert.match(source, /mod\?\.RetellWebClient\s*\|\|\s*mod\?\.default\?\.RetellWebClient/);
  // Guard against returning the unusable namespace-shaped default object.
  assert.match(source, /typeof ctor === 'function'\s*\?\s*ctor\s*:\s*null/);
});

test('VoiceSessionLauncher only listens for documented SDK events', async () => {
  const source = await readFile(new URL('./VoiceSessionLauncher.js', import.meta.url), 'utf8');
  for (const evt of ['agent_start_talking', 'agent_stop_talking', 'call_ended', 'error']) {
    assert.match(source, new RegExp(`call\\.on\\(['"]${evt}['"]`));
  }
});

test('VoiceSessionLauncher unmount releases the call and client', async () => {
  const source = await readFile(new URL('./VoiceSessionLauncher.js', import.meta.url), 'utf8');
  // ponytail: source uses `if (callRef.current?.stop) callRef.current.stop();`
  assert.match(source, /if\s*\(\s*callRef\.current\?\.stop\s*\)\s*callRef\.current\.stop\s*\(/);
  assert.match(source, /if\s*\(\s*clientRef\.current\?\.stop\s*\)\s*clientRef\.current\.stop\s*\(/);
});
