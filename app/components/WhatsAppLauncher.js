'use client';
// ponytail: WhatsApp launch FAB. Renders only when NEXT_PUBLIC_WHATSAPP_NUMBER
// is a real E.164 number AND the user has not previously dismissed it.
// Otherwise renders a disabled "PENDING" chip so the owner sees the icon
// without us faking a wa.me link. Honest by construction.

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'ironwake:wa:dismissed';
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

function isLikelyE164(n) {
  return /^\+\d{8,15}$/.test(String(n || '').trim());
}

export default function WhatsAppLauncher() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1'; } catch (_) {}
    const realNumber = isLikelyE164(NUMBER);
    setReady(realNumber);
    setShow(realNumber && !dismissed);
  }, []);

  if (!ready && !show) return null;

  if (!ready) {
    // ponytail: surface the icon for the owner but refuse to fabricate a link.
    return (
      <button
        type="button"
        className="wa-fab wa-fab--pending"
        aria-label="WhatsApp launch pending provider number"
        title="Provider number pending — visible only so the icon is in place"
        disabled
        aria-disabled="true"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M19.05 4.91A10 10 0 0 0 4.1 19.16L3 22l2.94-1.1A10 10 0 1 0 19.05 4.91Zm-7.02 15.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-2.15.8.81-2.1-.2-.32a8.18 8.18 0 1 1 6.02 2.94Zm4.7-6.13c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.83-.81 1-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.05-1.27-.76-.68-1.27-1.51-1.42-1.77-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44-.15-.01-.32-.01-.5-.01a.96.96 0 0 0-.7.32c-.24.26-.92.9-.92 2.2 0 1.3.95 2.55 1.08 2.73.13.17 1.87 2.85 4.53 3.99.63.27 1.13.43 1.51.55.63.2 1.21.17 1.66.1.51-.08 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z"
          />
        </svg>
        <span className="wa-fab__label">WhatsApp</span>
      </button>
    );
  }

  const href = `https://wa.me/${NUMBER.replace(/^\+/, '')}?text=${encodeURIComponent('Hi IronWake, I have an enquiry.')}`;
  return (
    <div className="wa-fab-group" data-open={open ? 'true' : 'false'}>
      {open && (
        <div className="wa-fab-menu" role="dialog" aria-label="WhatsApp launch">
          <p className="wa-fab-menu__title">Open IronWake on WhatsApp</p>
          <p className="wa-fab-menu__body">
            Send a quick message to our business number. Replies during India business hours.
          </p>
          <a className="button wa-fab-menu__cta" href={href} target="_blank" rel="noopener noreferrer">
            Open WhatsApp
          </a>
        </div>
      )}
      <a
        className="wa-fab"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open IronWake on WhatsApp"
        title="Chat on WhatsApp"
        onClick={(e) => {
          // ponytail: open the small in-page menu first on desktop for accessibility;
          // let the native click-through on mobile.
          if (window.matchMedia('(hover: hover)').matches) {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M19.05 4.91A10 10 0 0 0 4.1 19.16L3 22l2.94-1.1A10 10 0 1 0 19.05 4.91Zm-7.02 15.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-2.15.8.81-2.1-.2-.32a8.18 8.18 0 1 1 6.02 2.94Zm4.7-6.13c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.83-.81 1-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.05-1.27-.76-.68-1.27-1.51-1.42-1.77-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44-.15-.01-.32-.01-.5-.01a.96.96 0 0 0-.7.32c-.24.26-.92.9-.92 2.2 0 1.3.95 2.55 1.08 2.73.13.17 1.87 2.85 4.53 3.99.63.27 1.13.43 1.51.55.63.2 1.21.17 1.66.1.51-.08 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z"
          />
        </svg>
        <span className="wa-fab__label">WhatsApp</span>
      </a>
      <button
        type="button"
        className="wa-fab__close"
        aria-label="Dismiss WhatsApp button"
        onClick={() => { try { localStorage.setItem(DISMISS_KEY, '1'); } catch (_) {} setShow(false); }}
        title="Dismiss"
      >
        ×
      </button>
    </div>
  );
}