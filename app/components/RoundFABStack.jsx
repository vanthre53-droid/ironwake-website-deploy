'use client';

// RoundFABStack — two independent floating round icons mounted globally.
//   1. Chat-bot FAB  (Copper/Ivory, top-left)   → opens the AI chat assistant (separate surface)
//   2. WhatsApp FAB  (real WhatsApp green, bottom-left) → redirects to wa.me (our published WhatsApp bot)
//
// Per owner directive (2026-08-22):
//   • WhatsApp FAB is a REAL REDIRECT to wa.me, not an in-page API overlay.
//   • Chat bot is SEPARATE from WhatsApp (different surfaces).
//   • Apple-quality craft: rounded, soft floating animation, frosted glass,
//     focus ring, reduced-motion honored.
//   • Voice AI is OUTBOUND ONLY — never a customer-facing entry.
//
// Accessibility: aria-labels, focus-visible, ESC handled by each child,
// body scroll lock handled by chat overlay only.

import { useEffect, useState } from 'react';
import CustomerAssistantLauncher from './CustomerAssistantLauncher.js';

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/[^0-9+]/g, '');
const WHATSAPP_PREFILL =
  process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ||
  'Hi IronWake — I would like to learn more about your AI receptionist systems.';
const WA_FALLBACK = '/contact';

function buildWaMeHref(number, prefill) {
  if (!/^\+\d{8,15}$/.test(number)) return null;
  const digits = number.replace(/^\+/, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(prefill)}`;
}

const WA_HREF = buildWaMeHref(WHATSAPP_NUMBER, WHATSAPP_PREFILL);

function WhatsAppIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M19.05 4.91A10 10 0 0 0 4.1 19.16L3 22l2.94-1.1A10 10 0 1 0 19.05 4.91Zm-7.02 15.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-2.15.8.81-2.1-.2-.32a8.18 8.18 0 1 1 6.02 2.94Zm4.7-6.13c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.83-.81 1-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.05-1.27-.76-.68-1.27-1.51-1.42-1.77-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44-.15-.01-.32-.01-.5-.01a.96.96 0 0 0-.7.32c-.24.26-.92.9-.92 2.2 0 1.3.95 2.55 1.08 2.73.13.17 1.87 2.85 4.53 3.99.63.27 1.13.43 1.51.55.63.2 1.21.17 1.66.1.51-.08 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.7 7.1L3 21l1.9-6.3A8 8 0 1 1 21 12z" />
      <circle cx="8.5" cy="12" r="1" fill="currentColor" />
      <circle cx="12"  cy="12" r="1" fill="currentColor" />
      <circle cx="15.5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export default function RoundFABStack() {
  const [chatOpen, setChatOpen] = useState(false);
  const [waMounted, setWaMounted] = useState(false);
  useEffect(() => { setWaMounted(true); }, []);

  return (
    <>
      <style jsx global>{`
        .round-fab {
          position: fixed;
          left: 20px;
          z-index: 60;
          width: 60px;
          height: 60px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          box-shadow:
            0 10px 30px -10px rgba(10,10,10,0.40),
            0 2px 8px rgba(10,10,10,0.12),
            inset 0 1px 0 rgba(255,255,255,0.85);
          cursor: pointer;
          transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 240ms ease, background 240ms ease, border-color 240ms ease;
          animation: round-fab-float 4.2s ease-in-out infinite;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .round-fab:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow:
            0 22px 44px -14px rgba(10,10,10,0.50),
            0 6px 14px rgba(10,10,10,0.14),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .round-fab:focus-visible {
          outline: 2px solid #B94D2F;
          outline-offset: 3px;
          border-color: rgba(255,255,255,0.95);
        }
        .round-fab:active { transform: translateY(0) scale(0.98); }
        .round-fab.whatsapp {
          background: linear-gradient(180deg, #25D366 0%, #128C7E 100%);
          color: #FFFFFF;
          border-color: rgba(255,255,255,0.35);
        }
        .round-fab.whatsapp:hover {
          background: linear-gradient(180deg, #2BDB6F 0%, #0E7A6D 100%);
        }
        .round-fab.chatbot {
          background: linear-gradient(180deg, #B94D2F 0%, #842E18 100%);
          color: #F5F3EE;
          border-color: rgba(255,255,255,0.30);
        }
        .round-fab.chatbot:hover {
          background: linear-gradient(180deg, #C75A37 0%, #962F19 100%);
        }
        .round-fab .icon { width: 28px; height: 28px; }
        .round-fab .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .round-fab .pulse {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          pointer-events: none;
        }
        .round-fab.whatsapp .pulse {
          box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55);
          animation: wa-pulse 2.6s ease-out infinite;
        }
        @keyframes round-fab-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes wa-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
          70%  { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .round-fab { animation: none; }
          .round-fab:hover { transform: none; }
          .round-fab.whatsapp .pulse { animation: none; }
        }
        @media (max-width: 640px) {
          .round-fab { left: 16px; width: 56px; height: 56px; }
          .round-fab .icon { width: 26px; height: 26px; }
        }
      `}</style>

      <button
        type="button"
        aria-label="Open chat assistant"
        aria-expanded={chatOpen}
        onClick={() => setChatOpen(v => !v)}
        className="round-fab chatbot"
        style={{ bottom: 'calc(20px + 80px)' }}
      >
        <ChatIcon />
        <span className="sr">Chat with IronWake assistant</span>
      </button>

      {/* WhatsApp — REAL floating button that redirects to our published WhatsApp bot.
          wa.me opens the user's WhatsApp app with our verified business number + a
          prefilled message. NEVER an in-page API overlay (per owner directive). */}
      {waMounted && WA_HREF ? (
        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="round-fab whatsapp"
          style={{ bottom: '20px' }}
          aria-label="Chat with IronWake on WhatsApp"
          title="Chat with IronWake on WhatsApp"
          data-track="fab-whatsapp"
        >
          <span className="pulse" aria-hidden="true" />
          <WhatsAppIcon />
          <span className="sr">Open WhatsApp conversation with IronWake</span>
        </a>
      ) : waMounted ? (
        // No wa.me number yet — keep the FAB visible so visitors can find us,
        // and send them to /contact as the honest fallback.
        <a
          href={WA_FALLBACK}
          className="round-fab whatsapp"
          style={{ bottom: '20px', background: 'rgba(255,255,255,0.92)', color: '#128C7E' }}
          aria-label="Contact IronWake on WhatsApp"
          title="Contact IronWake on WhatsApp"
          data-track="fab-whatsapp-contact"
        >
          <WhatsAppIcon />
          <span className="sr">Contact IronWake on WhatsApp</span>
        </a>
      ) : null}

      {chatOpen && (
        <CustomerAssistantLauncher onClose={() => setChatOpen(false)} />
      )}
    </>
  );
}
