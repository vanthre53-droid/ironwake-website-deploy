import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai receptionist concept page never claims a live connected line', async () => {
  const source = await readFile(new URL('./AiReceptionistSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Not yet connected/);
  assert.match(source, /ILLUSTRATIVE SAMPLE — not a real call\. No live phone line is connected\./);
  assert.match(source, /No phone number is connected to this concept page/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /\$\d|₹\d|per (minute|call|month)|book a pilot|join the pilot|live now/i);
});
