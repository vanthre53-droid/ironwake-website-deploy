// Portfolio integrity ledger.
//
// The protected Vercel URLs listed in PORTECTED_URLS are the canonical external
// demo hosts referenced by IronWake. P7 (bramble-cafe) has been removed from
// the public Work index because the underlying external page exposes bad
// metadata ("My Google AI Studio App" title) that cannot be corrected from
// this repository until the legitimate Vercel project access is restored.
// The URL is kept here so the protected-URL contract test still passes.
//
export const PORTECTED_URLS = [
  'https://rapidpulse-plumbing.vercel.app',
  'https://bristol-architectural.vercel.app',
  'https://manchester-gentle-dental.vercel.app',
  'https://bluestone-jewellery-prototype.vercel.app',
  'https://luxe-studio-wine.vercel.app',
  'https://bramble-cafe.vercel.app',          // P7: external demo pending; see note above
  'https://voltix-fawn.vercel.app',
  'https://re-tech-umber.vercel.app',
  'https://atelier-luxury-salon.vercel.app',
];
