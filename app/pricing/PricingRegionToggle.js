'use client';
// ponytail: pricing region toggle — switches every visible INR/USD price
// between [data-region="india"] and [data-region="intl"]. Default region is
// read from localStorage (key: ironwake:pricing-region); falls back to India
// for first-time visitors. No external state, no analytics, no PII. Pure DOM.

import { useEffect, useRef } from 'react';
import { applyRegion as applyRegionCore } from './apply-region.mjs';

const STORAGE_KEY = 'ironwake:pricing-region';

export default function PricingRegionToggle({ defaultRegion = 'india' }) {
  const groupRef = useRef(null);

  useEffect(() => {
    let region = defaultRegion;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'india' || stored === 'intl') region = stored;
    } catch (_e) {
      /* localStorage blocked — fall through to default */
    }
    applyRegionCore(region);

    const buttons = groupRef.current?.querySelectorAll('button[data-pricing-region]') ?? [];

    const setRegion = (next) => {
      if (next !== 'india' && next !== 'intl') return;
      try { window.localStorage.setItem(STORAGE_KEY, next); } catch (_e) { /* ignore */ }
      applyRegionCore(next);
    };

    const handleClick = (event) => {
      const next = event.currentTarget.getAttribute('data-pricing-region');
      setRegion(next);
    };
    const handleKey = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const next = event.currentTarget.getAttribute('data-pricing-region') === 'india' ? 'intl' : 'india';
      setRegion(next);
      const target = groupRef.current?.querySelector(`button[data-pricing-region="${next}"]`);
      if (target) target.focus();
      event.preventDefault();
    };

    buttons.forEach((b) => {
      b.addEventListener('click', handleClick);
      b.addEventListener('keydown', handleKey);
    });
    return () => {
      buttons.forEach((b) => {
        b.removeEventListener('click', handleClick);
        b.removeEventListener('keydown', handleKey);
      });
    };
  }, [defaultRegion]);

  return (
    <div ref={groupRef} className="pricing-region-toggle" role="group" aria-label="Pricing region">
      <button
        type="button"
        data-pricing-region="india"
        className="pricing-region-btn"
        aria-pressed="true"
      >
        <span className="pricing-region-flag" aria-hidden="true">🇮🇳</span>
        <span>India</span>
        <span className="pricing-region-symbol" aria-hidden="true">₹</span>
      </button>
      <button
        type="button"
        data-pricing-region="intl"
        className="pricing-region-btn"
        aria-pressed="false"
      >
        <span className="pricing-region-flag" aria-hidden="true">🌐</span>
        <span>International</span>
        <span className="pricing-region-symbol" aria-hidden="true">$</span>
      </button>
    </div>
  );
}
