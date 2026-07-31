import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('globals.css defines a dark theme without a manual toggle dependency', async () => {
  const source = await readFile(new URL('./globals.css', import.meta.url), 'utf8');
  assert.match(source, /@media \(prefers-color-scheme: dark\)/);
  assert.match(source, /--paper: #111110;/);
  assert.match(source, /color-scheme: dark;/);
  assert.match(source, /color-scheme: light;/);
  const rawSurfaceLiteralCount = (source.match(/rgb\(255 255 255 \/ \.6\)/g) || []).length;
  assert.equal(rawSurfaceLiteralCount, 1, 'the literal only belongs in the --surface token definition; every other rule must reference var(--surface)');
});

test('signal rail animation is transform/opacity only and fully disabled under reduced motion', async () => {
  const source = await readFile(new URL('./globals.css', import.meta.url), 'utf8');
  assert.match(source, /@keyframes signal-rail-move/);
  const keyframeBlock = source.match(/@keyframes signal-rail-move\s*\{[\s\S]*?\n\}/)[0];
  assert.doesNotMatch(keyframeBlock, /\b(top|left|right|bottom|width|height|margin|padding)\s*:/, 'keyframes must only animate transform/opacity to avoid layout thrashing');
  assert.match(keyframeBlock, /transform:/);
  assert.match(keyframeBlock, /opacity:/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  const reducedMotionBlock = source.slice(source.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reducedMotionBlock, /animation-duration:\s*\.001ms\s*!important/);
  assert.match(reducedMotionBlock, /\.signal-rail-pulse\s*\{\s*display:\s*none;\s*\}/);
});
