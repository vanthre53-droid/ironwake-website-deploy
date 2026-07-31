---
name: webchat-widget
description: Build the embeddable AI web-chat widget — one script tag, shadow-DOM UI, pgvector RAG over the business's real data, grounded answers only, lead capture, booking, AI disclosure, injection-hardened public route. Use when the user says website chatbot, web widget, embed chat, site assistant, RAG chatbot, chat bubble, product recommendation bot, or wants the chatbot piece of a demo site (P1–P4).
---

# Web-Chat Widget (v7.2 §34)

## Build (order + gate in `references/39c-V7_2_UPGRADE_MODULE.md` §34E)
DB (chunks/entities/leads/conversations) → ingest script (chunk services/pricing/FAQ/policies → embeddings) → streaming chat route (Vercel AI SDK; Haiku intent · Sonnet or GLM-5.2 answers) → `widget.js` (shadow DOM, <50KB gz, async, config via `data-tenant/accent/name/greeting/logo`) → embed → tests.

## Hard rules (§34D — zero exceptions, demos included)
1. Grounding lock: answers ONLY from retrieved chunks/`entities`; absent fact → "leave your number and [owner] will confirm." Never invent.
2. Page visitors are untrusted input: the 5 injection tests pass before deploy; rate-limit the public route; CORS locked; no client-side secrets.
3. Disclosure in header + first message; human-escalation captures contact + context.
4. Every conversation → lead row even without conversion; auto-CSAT scoring.
5. Host page Lighthouse ≥90 with the widget loaded.

## The config surface is the product
`data-*` attributes exist so **demo-personalization-pipeline** can rebrand the widget per prospect without touching code. Never hardcode a business name/color into the widget bundle.

## Gate (paste all)
Grounded answer citing its chunk · absent-fact fallback verbatim · lead row from a non-converting chat · 5/5 injection · Lighthouse ≥90.

## Chains with
- Consumed by: **portfolio-demo-factory** (P1 trades site, P2 property-search, P3 dental FAQ, P4 retail recommendations), **demo-personalization-pipeline**
- Consumes: **supabase-backend-pro** (pgvector + RLS + rate-limit patterns), **script-generator** (web-widget channel adapter for its copy)
- Feeds: **lead qualification** (widget leads enter scoring), **voice-agent-build**/**whatsapp-bot-build** (shared n8n intent brain where all three channels exist)
