'use client';
// ponytail: pricing region toggle — switches all .pricing-card-pricing blocks
// between [data-region="india"] and [data-region="intl"]. Default region is
// read from localStorage (key: ironwake:pricing-region); falls back to India
// for first-time visitors. No external state, no analytics, no PII. Pure DOM.
import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'ironwake:pricing-region';

export default function PricingRegionToggle({ defaultRegion = 'india' }) {
  const buttonsRef = useRef(null);

  useEffect(() => {
    let region = defaultRegion;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'india' || stored === 'intl') region = stored;
    } catch (_e) {
      /* localStorage blocked — fall through to default */
    }
    applyRegion(region);

    const buttons = buttonsRef.current?.querySelectorAll('button[data-pricing-region]') ?? [];
    const handle = (event) => {
      const next = event.currentTarget.getAttribute('data-pricing-region');
      if (next !== 'india' && next !== 'intl') return;
      try { window.localStorage.setItem(STORAGE_KEY, next); } catch (_e) { /* ignore */ }
      applyRegion(next);
    };
    buttons.forEach((b) => b.addEventListener('click', handle));
    return () => buttons.forEach((b) => b.removeEventListener('click', handle));
  }, [defaultRegion]);

  return (
    <div ref={buttonsRef} className="pricing-region-toggle" role="group" aria-label="Pricing region">
      <button type="button" data-pricing-region="india" className="pricing-region-btn" aria-pressed="true">
        <span className="pricing-region-flag" aria-hidden="true">�</span>
        <span>India</span>
      </button>
      <button type="button" data-pricing-region="intl" className="pricing-region-btn" aria-pressed="false">
        <span className="pricing-region-flag" aria-hidden="true">$</span>
        <span>International</span>
      </button>
    </div>
  );
}

function applyRegion(region) {
  const doc = typeof document === 'undefined' ? null : document;
  if (!doc) return;
  const cards = doc.querySelectorAll('.pricing-card-pricing[data-region]');
  cards.forEach((el) => {
    el.hidden = el.getAttribute('data-region') !== region;
  });
  const buttons = doc.querySelectorAll('button[data-pricing-region]');
  buttons.forEach((b) => {
    const pressed = b.getAttribute('data-pricing-region') === region;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  });
}
