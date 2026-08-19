import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

// ponytail: V13 — this test encodes the Pearl / Graphite / Petrol / Mineral
// design system contract. The previous Stitch "warm ivory + iron red" system
// was explicitly rejected by the V13 owner directive. Any future regression
// to copper / warm-ivory values fails this test on purpose.
test('globals.css defines the Pearl / Graphite / Petrol / Mineral system', async () => {
  const source = await readFile(new URL('./globals.css', import.meta.url), 'utf8');

  // Canvas / surface palette (P0-B).
  assert.match(source, /--pearl:\s*#F3F5F7/);
  assert.match(source, /--pearl-canvas:\s*#F3F5F7/);
  assert.match(source, /--secondary-canvas:\s*#E9EDF1/);
  assert.match(source, /--high-emphasis-surface:\s*#FBFCFD/);

  // Ink / graphite palette (P0-B).
  assert.match(source, /--graphite-ink:\s*#161B22/);
  assert.match(source, /--secondary-ink:\s*#343C45/);
  assert.match(source, /--muted-text:\s*#66717D/);

  // Petrol + mineral accent (P0-B).
  assert.match(source, /--petrol:\s*#1F5D67/);
  assert.match(source, /--petrol-hover:\s*#194C54/);
  assert.match(source, /--petrol-pressed:\s*#143F46/);
  assert.match(source, /--mineral:\s*#5F7F87/);
  assert.match(source, /--soft-mineral:\s*#D7E5E8/);
  assert.match(source, /--frosted-blue-grey:\s*#E5EEF1/);
  assert.match(source, /--focus-accent:\s*#2E7A85/);

  // Semantic colours — not brand colours (P0-B).
  assert.match(source, /--semantic-success:\s*#1F7A4D/);
  assert.match(source, /--semantic-warning:\s*#B67A0E/);
  assert.match(source, /--semantic-error:\s*#B03A3A/);

  // Glass material tokens — three material levels (P0-C).
  assert.match(source, /--base-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.54\)/);
  assert.match(source, /--cool-mineral-glass:\s*rgba\(237,\s*244,\s*246,\s*0\.44\)/);
  assert.match(source, /--interactive-glass:\s*rgba\(248,\s*251,\s*252,\s*0\.64\)/);
  assert.match(source, /--strong-foreground-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.76\)/);
  assert.match(source, /--glass-border:\s*rgba\(34,\s*61,\s*68,\s*0\.14\)/);
  assert.match(source, /--glass-inner-highlight:\s*rgba\(255,\s*255,\s*255,\s*0\.78\)/);
  assert.match(source, /--depth-shadow:\s*rgba\(17,\s*35,\s*40,\s*0\.09\)/);
  assert.match(source, /--deep-shadow:\s*rgba\(14,\s*31,\s*36,\s*0\.13\)/);

  // Legacy aliases now resolve to the new system (P0-B).
  // JSX still uses --copper / --paper / --ink; their values are petrol / pearl / graphite.
  assert.match(source, /--paper:\s*var\(--pearl\)/);
  assert.match(source, /--copper:\s*var\(--petrol\)/);
  assert.match(source, /--action:\s*var\(--petrol\)/);
  assert.match(source, /--copper-dark:\s*var\(--petrol-hover\)/);
  assert.match(source, /--aqua:\s*var\(--mineral\)/);
  assert.match(source, /--ink:\s*var\(--graphite-ink\)/);

  // Section rhythm + width tokens (P0-D).
  assert.match(source, /--section-pad-y:\s*clamp\(/);
  assert.match(source, /--section-pad-x:\s*clamp\(/);
  assert.match(source, /--section-gap:\s*clamp\(/);
  assert.match(source, /--card-gap:\s*clamp\(/);
  assert.match(source, /--reading-width:\s*64ch/);
  assert.match(source, /--hero-heading-width:\s*18ch/);
  assert.match(source, /--page-max:\s*76rem/);

  // Motion tokens (P0-D).
  assert.match(source, /--motion-fast:\s*150ms/);
  assert.match(source, /--motion-base:\s*250ms/);
  assert.match(source, /--motion-slow:\s*400ms/);
  assert.match(source, /--motion-spring:\s*cubic-bezier\(/);

  // Light colour scheme remains the default.
  assert.match(source, /color-scheme:\s*light/);

  // No legacy warm copper / iron-red hex literals may leak back into the
  // colour definitions. (rgb(...) shadows that were copper are migrated in
  // earlier commits; these asserts block re-introduction at the token level.)
  assert.doesNotMatch(source, /--paper:\s*#f5f3ee/i);
  assert.doesNotMatch(source, /--copper:\s*#b94d2f/i);
  assert.doesNotMatch(source, /--ink:\s*#0a0a0a/i);
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
