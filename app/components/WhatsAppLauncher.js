'use client';
// IronWake WhatsApp FAB — always actionable, never fakes a destination.
// Real E.164 number configured? → opens wa.me with prefilled message.
// Otherwise? → opens the in-page /contact route so the icon is honest
// and the visitor can still reach IronWake. Provider status is reflected
// in the badge text so the owner can see at a glance whether the real
// channel is live.

import { useEffect, useState } from 'react';

const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').trim();

function isLikelyE164(n) {
  return /^\+\d{8,15}$/.test(n);
}

const hasRealNumber = isLikelyE164(NUMBER);
const PREFILL =
  process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ||
  'Hi IronWake — I would like to learn more about your AI receptionist systems.';

export default function WhatsAppLauncher() {
  // Server-rendered fallback so the FAB is visible immediately on first paint
  // (search engines, no-JS clients, slow connections). The client effect then
  // upgrades href/text after hydration if a real number is configured.
  const [href, setHref] = useState(hasRealNumber ? `https://wa.me/${NUMBER.replace(/^\+/, '')}?text=${encodeURIComponent(PREFILL)}` : '/contact');
  const [label, setLabel] = useState(
    hasRealNumber
      ? 'Open IronWake on WhatsApp'
      : 'WhatsApp — contact IronWake (real channel pending)',
  );
  const [target, setTarget] = useState(hasRealNumber ? '_blank' : undefined);
  const [rel, setRel] = useState(hasRealNumber ? 'noopener noreferrer' : undefined);
  const [mounted, setMounted] = useState(false);
  const badge = hasRealNumber ? 'Live' : 'Pending number';

  useEffect(() => {
    setMounted(true);
    // Re-check env at hydration in case it changed (e.g. config rolled).
    if (hasRealNumber) {
      setHref(`https://wa.me/${NUMBER.replace(/^\+/, '')}?text=${encodeURIComponent(PREFILL)}`);
      setLabel('Open IronWake on WhatsApp');
      setTarget('_blank');
      setRel('noopener noreferrer');
    } else {
      setHref('/contact');
      setLabel('WhatsApp — contact IronWake (real channel pending)');
      setTarget(undefined);
      setRel(undefined);
    }
  }, []);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`wa-fab ${hasRealNumber ? 'wa-fab--live' : 'wa-fab--fallback'}`}
      aria-label={label}
      title={label}
    >
      <span className="wa-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
          <path
            fill="currentColor"
            d="M19.05 4.91A10 10 0 0 0 4.1 19.16L3 22l2.94-1.1A10 10 0 1 0 19.05 4.91Zm-7.02 15.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-2.15.8.81-2.1-.2-.32a8.18 8.18 0 1 1 6.02 2.94Zm4.7-6.13c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.83-.81 1-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.05-1.27-.76-.68-1.27-1.51-1.42-1.77-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44-.15-.01-.32-.01-.5-.01a.96.96 0 0 0-.7.32c-.24.26-.92.9-.92 2.2 0 1.3.95 2.55 1.08 2.73.13.17 1.87 2.85 4.53 3.99.63.27 1.13.43 1.51.55.63.2 1.21.17 1.66.1.51-.08 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z"
          />
        </svg>
      </span>
      <span className="wa-fab__text">
        <span className="wa-fab__label">WhatsApp</span>
        <span className="wa-fab__badge">{badge}</span>
      </span>
    </a>
  );
}