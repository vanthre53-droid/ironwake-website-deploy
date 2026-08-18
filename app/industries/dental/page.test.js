import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dental industry landing page wires SEO metadata, demo proof, and a real ROI calculator', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');

  // ponytail: metadata is server-rendered, not faked via client hooks.
  assert.match(source, /export const metadata/);
  assert.match(source, /alternates: \{ canonical:/);
  assert.match(source, /openGraph:/);
  assert.match(source, /\/industries\/dental/);

  // ponytail: non-clinical, non-diagnostic disclaimer is present and visible.
  assert.match(source, /Not a clinical, diagnostic, or compliance service/);

  // ponytail: calculator is a real React client island, not a static widget.
  assert.match(source, /import \{ RoiCalculator \} from ['"]\.\/RoiCalculator['"]/);
  assert.match(source, /<RoiCalculator \/>/);

  // ponytail: existing portfolio proof is referenced as a demonstration, not a real client result.
  assert.match(source, /href="\/work\/dentacare-pro"/);
  assert.match(source, /demonstration/i);

  // ponytail: lead surfaces and proof surfaces point to the existing systems.
  assert.match(source, /href="\/audit"/);
  assert.match(source, /href="\/systems\/ai-receptionist"/);

  // ponytail: no fabricated "X% of calls are missed after Y rings" style stat.
  // We forbid a percent sign pinned to a digit for call-recovery framing.
  assert.doesNotMatch(source, /\d+%\s*of\s*(?:callers|calls|inbound|patients)/i);
});

test('ROI calculator is a client component, pulls pricing from lib/pricing.mjs, and has no fabricated benchmarks', async () => {
  const source = await readFile(new URL('./RoiCalculator.js', import.meta.url), 'utf8');

  assert.match(source, /^['"]use client['"]/m);
  assert.match(source, /from ['"]\.\.\/\.\.\/\.\.\/lib\/pricing\.mjs['"]/);
  assert.match(source, /PRICING_BY_ID\['ai-receptionist'\]/);

  // ponytail: every numeric result is computed from local inputs — no hardcoded
  // "industry average show rate" or "conversion benchmark" string embedded.
  assert.doesNotMatch(source, /industry average|industry benchmark|national average/i);
});