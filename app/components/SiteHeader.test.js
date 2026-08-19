import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site header exposes every active route through native navigation', async () => {
  const source = await readFile(new URL('./SiteHeader.js', import.meta.url), 'utf8');
  // ponytail: the links array is the single source of truth for nav items.
  assert.match(source, /\['\/', 'Home'\]/);
  assert.match(source, /\['\/work', 'Work'\]/);
  assert.match(source, /\['\/systems', 'Services'\]/);
  assert.match(source, /\['\/systems\/ai-receptionist', 'AI Systems'\]/);
  assert.match(source, /\['\/process', 'Process'\]/);
  assert.match(source, /\['\/pricing', 'Pricing'\]/);
  assert.match(source, /\['\/insights', 'Insights'\]/);
  assert.match(source, /\['\/about', 'About'\]/);
  assert.match(source, /href="\/audit">Book Diagnostic/);
  assert.match(source, /<details className="mobile-nav">/);
  // ponytail: customer Sign in + Create account must appear for anonymous visitors
  assert.match(source, /href="\/login">Sign in/);
  assert.match(source, /href="\/signup">Create account/);
  // ponytail: authenticated customer controls replace those
  assert.match(source, /href="\/account">My account/);
  assert.match(source, /className="[^"]*\bnav-signout\b/);
  // ponytail: no owner-only Login control in the public header
  assert.doesNotMatch(source, /href="\/login">Owner Login/);
});
