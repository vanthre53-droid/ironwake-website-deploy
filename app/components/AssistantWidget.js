'use client';

// ponytail: legacy AssistantWidget — the customer-only floating launcher
// has been moved to ./CustomerAssistantLauncher.js. This file is kept as a
// thin re-export so existing imports + tests keep their contract.
//
// The new launcher is gated: it renders ONLY for an authenticated CUSTOMER
// session, and only renders an IronWake round mark + panel — never a generic
// pill, never a square chatbot box, never for anonymous visitors.

export { default } from './CustomerAssistantLauncher';