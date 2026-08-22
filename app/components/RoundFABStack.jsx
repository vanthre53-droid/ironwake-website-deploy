'use client';

// ponytail: RoundFABStack — two separate round floating icons mounted globally.
//   1. Round chat-bot FAB (copper, bottom-left, top)    → opens the AI assistant
//   2. Round WhatsApp FAB (emerald, bottom-left, below)  → opens Meta WhatsApp path
//
// Style: 56px perfect circle, subtle floating animation, soft Copper/Ivory shadow,
//        Apple-level craft — no panels, no menus, no overlapping circles.
// Accessibility: aria-labels, focus-visible, ESC closes any open sheet, body scroll lock.

import { useEffect, useRef, useState } from 'react';
import WhatsAppLauncher from './WhatsAppLauncher.js';
import CustomerAssistantLauncher from './CustomerAssistantLauncher.js';

export default function RoundFABStack() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <style jsx global>{`
        .round-fab {
          position: fixed;
          left: 20px;
          z-index: 60;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.55);
          background: #FFFFFF;
          box-shadow:
            0 10px 30px -10px rgba(10,10,10,0.35),
            0 2px 8px rgba(10,10,10,0.10),
            inset 0 1px 0 rgba(255,255,255,0.7);
          cursor: pointer;
          transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 200ms ease, background 200ms ease;
          animation: round-fab-float 4.2s ease-in-out infinite;
        }
        .round-fab:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -12px rgba(10,10,10,0.45), 0 4px 12px rgba(10,10,10,0.12); }
        .round-fab:focus-visible { outline: 2px solid #B94D2F; outline-offset: 3px; }
        .round-fab:active { transform: translateY(0); }
        .round-fab.whatsapp { background: linear-gradient(180deg, #25D366 0%, #128C7E 100%); color: #fff; }
        .round-fab.whatsapp:hover { background: linear-gradient(180deg, #2BDB6F 0%, #0E7A6D 100%); }
        .round-fab.chatbot { background: linear-gradient(180deg, #B94D2F 0%, #842E18 100%); color: #F5F3EE; }
        .round-fab.chatbot:hover { background: linear-gradient(180deg, #C75A37 0%, #962F19 100%); }
        .round-fab .icon { width: 26px; height: 26px; }
        .round-fab .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        @keyframes round-fab-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .round-fab { animation: none; }
          .round-fab:hover { transform: none; }
        }
        @media (max-width: 640px) {
          .round-fab { left: 16px; width: 52px; height: 52px; }
        }
      `}</style>

      <button
        type="button"
        aria-label="Open chat assistant"
        aria-expanded={chatOpen}
        onClick={() => setChatOpen(v => !v)}
        className="round-fab chatbot"
        style={{ bottom: 'calc(20px + 72px)' }}
      >
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.7 7.1L3 21l1.9-6.3A8 8 0 1 1 21 12z" />
          <circle cx="8.5" cy="12" r="1" fill="currentColor" />
          <circle cx="12"  cy="12" r="1" fill="currentColor" />
          <circle cx="15.5" cy="12" r="1" fill="currentColor" />
        </svg>
        <span className="sr">Chat with IronWake assistant</span>
      </button>

      <WhatsAppLauncher />

      {chatOpen && (
        <CustomerAssistantLauncher onClose={() => setChatOpen(false)} />
      )}
    </>
  );
}
