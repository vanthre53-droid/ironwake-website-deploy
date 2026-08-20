import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

// V3: keep the owner-approved Copper / Ivory source contract explicit. These
// assertions intentionally inspect source literals rather than alias values so
// the immutable palette cannot drift behind a semantic indirection.
test('globals.css defines the V3 Copper / Ivory system', async () => {
  const source = await readFile(new URL('./globals.css', import.meta.url), 'utf8');

  // Canvas / surface palette.
  assert.match(source, /--pearl:\s*#F5F3EE/);
  assert.match(source, /--pearl-canvas:\s*#F5F3EE/);
  assert.match(source, /--secondary-canvas:\s*#EDEAE3/);

  // Ink and Copper action palette.
  assert.match(source, /--graphite-ink:\s*#0A0A0A/);
  assert.match(source, /--petrol:\s*#B94D2F/);
  assert.match(source, /--petrol-hover:\s*#A33D20/);
  assert.match(source, /--petrol-pressed:\s*#842E18/);

  // Supporting Aqua must remain a direct source literal, not only an alias.
  assert.match(source, /--mineral:\s*#1E7582/);

  // Semantic colours — not brand colours.
  assert.match(source, /--semantic-success:\s*#1F7A4D/);
  assert.match(source, /--semantic-warning:\s*#B67A0E/);
  assert.match(source, /--semantic-error:\s*#B03A3A/);

  // Glass material tokens — three material levels.
  assert.match(source, /--base-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.58\)/);
  assert.match(source, /--cool-mineral-glass:\s*rgba\(239,\s*232,\s*224,\s*0\.48\)/);
  assert.match(source, /--interactive-glass:\s*rgba\(255,\s*252,\s*248,\s*0\.68\)/);
  assert.match(source, /--strong-foreground-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.80\)/);
  assert.match(source, /--glass-border:\s*rgba\(92,\s*66,\s*52,\s*0\.14\)/);
  assert.match(source, /--glass-inner-highlight:\s*rgba\(255,\s*255,\s*255,\s*0\.78\)/);
  assert.match(source, /--depth-shadow:\s*rgba\(57,\s*39,\s*31,\s*0\.09\)/);
  assert.match(source, /--deep-shadow:\s*rgba\(46,\s*29,\s*22,\s*0\.13\)/);

  // Semantic aliases preserve the existing component contract.
  assert.match(source, /--paper:\s*var\(--pearl\)/);
  assert.match(source, /--copper:\s*var\(--petrol\)/);
  assert.match(source, /--action:\s*var\(--petrol\)/);
  assert.match(source, /--copper-dark:\s*var\(--petrol-hover\)/);
  assert.match(source, /--aqua:\s*var\(--mineral\)/);
  assert.match(source, /--ink:\s*var\(--graphite-ink\)/);

  // Section rhythm + width tokens.
  assert.match(source, /--section-pad-y:\s*clamp\(/);
  assert.match(source, /--section-pad-x:\s*clamp\(/);
  assert.match(source, /--section-gap:\s*clamp\(/);
  assert.match(source, /--card-gap:\s*clamp\(/);
  assert.match(source, /--reading-width:\s*64ch/);
  assert.match(source, /--hero-heading-width:\s*18ch/);
  assert.match(source, /--page-max:\s*76rem/);

  // Motion tokens.
  assert.match(source, /--motion-fast:\s*150ms/);
  assert.match(source, /--motion-base:\s*250ms/);
  assert.match(source, /--motion-slow:\s*400ms/);
  assert.match(source, /--motion-spring:\s*cubic-bezier\(/);

  // Light colour scheme remains the default.
  assert.match(source, /color-scheme:\s*light/);
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
