'use client';

// ponytail: minimal cookie consent banner. IronWake uses:
//   - strictly necessary: auth session cookie (Supabase), CSRF cookie,
//     rate-limit cookie if any — these are essential and cannot be opted out.
//   - analytics: not currently enabled.
//   - preferences: not currently used.
// When analytics are added later, surface them here and gate on this
// preference. Storage key: iw-consent-v1.

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'iw-consent-v1';

function readConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

function writeConsent(value) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setVisible(true);
  }, []);

  const accept = () => { writeConsent({ necessary: true, ts: Date.now() }); setVisible(false); };
  const decline = () => { writeConsent({ necessary: true, analytics: false, ts: Date.now() }); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          IronWake uses strictly necessary cookies for authentication and security. Analytics and marketing cookies are off by default.
        </p>
        <div className="cookie-banner-actions">
          <button type="button" className="btn btn-secondary" onClick={decline}>Decline non-essential</button>
          <button type="button" className="btn btn-primary" onClick={accept}>Accept necessary</button>
        </div>
      </div>
    </div>
  );
}
