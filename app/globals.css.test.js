import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('globals.css defines the Stitch light design system', async () => {
  const source = await readFile(new URL('./globals.css', import.meta.url), 'utf8');
  // Stitch canvas color
  assert.match(source, /--paper:\s*#f5f3ee/);
  // Stitch ink color
  assert.match(source, /--ink:\s*#0a0a0a/);
  // Stitch iron red
  assert.match(source, /--copper:\s*#b94d2f/);
  // Light color scheme
  assert.match(source, /color-scheme:\s*light/);
  // Solid surfaces (no translucent)
  assert.match(source, /--surface:\s*#ffffff/);
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
