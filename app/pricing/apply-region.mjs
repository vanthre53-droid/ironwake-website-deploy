// ponytail: pure ESM version of the pricing region toggle's applyRegion.
// Extracted from PricingRegionToggle.js so it can be unit-tested without
// loading JSX in node --test. The behavior is identical — single source of
// truth for what 'switch pricing region' means at the DOM level.

export function applyRegion(region) {
  const doc = typeof document === 'undefined' ? null : document;
  if (!doc) return;

  // Every visible price node on the page — both per-tier-row prices
  // AND any future .pricing-card-pricing blocks. The earlier selector
  // missed this and the toggle became decorative; the broad selector fixes
  // that without breaking anything because every data-region node carries
  // the same semantics.
  const priceNodes = doc.querySelectorAll('[data-region="india"], [data-region="intl"]');
  priceNodes.forEach((el) => {
    if (el.tagName === 'SPAN' || el.tagName === 'DIV') {
      el.hidden = el.getAttribute('data-region') !== region;
    }
  });

  // Also swap any block-level container marked with data-region
  // (e.g. a future .pricing-card-pricing wrapper)
  const blockNodes = doc.querySelectorAll('.pricing-card-pricing[data-region]');
  blockNodes.forEach((el) => {
    el.hidden = el.getAttribute('data-region') !== region;
  });

  const buttons = doc.querySelectorAll('button[data-pricing-region]');
  buttons.forEach((b) => {
    const pressed = b.getAttribute('data-pricing-region') === region;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  });
}
