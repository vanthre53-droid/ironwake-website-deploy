# Priority, Decision, and Real-Data Protocol

## Locked priority

| Order | Workstream | Cannot pass until |
|---:|---|---|
| 0 | Repository/input assembly and integrity | Sources discovered and hashed |
| 1 | P0 audit: Stitch, kits, skills, claims, assets, portfolio proof, existing profiles | P0 evidence exists |
| 2 | P1 live research: competitors, search results, pricing, UX, providers, policies, technical standards | G1 packet exists |
| 3 | G1 consolidated user/adult/legal-owner decisions | Approvals ledger is explicit |
| 4 | P1.5 portfolio truth repair and provider-proof readiness for P3 DentaCare, P10 Atelier, and P1 RapidPulse | Public claims have proof labels and missing source access is resolved or approved as deferred |
| 5 | S1 minimum social foundation: identity, profile ownership, verified routes, nine truthful source assets, three pinned assets | GS1 passes or a platform is explicitly deferred and omitted |
| 6 | P2 data model, RLS, APIs, auth, audit/outbox, owner shell | Backend tests pass |
| 7 | P3 production design system, responsive public routes, motion, assets, content | Route/state/visual/accessibility evidence passes |
| 8 | P4 CRM, service selector, inquiry, slot requests, follow-up, email/WhatsApp/calendar/voice/payment adapters | E2E and provider-specific gates pass |
| 9 | P5 SEO, content, security, privacy, performance, accessibility, browser/E2E verification | Release evidence passes |
| 10 | G5 preview and production approval | User approves exact commit, costs, limitations, and rollback |
| 11 | P6 production deployment, one approved real flow, monitoring, and handover | G6 evidence exists |

Public website implementation must not begin before the minimum GS1 social foundation and portfolio truth gate. Research, decision preparation, and non-public technical prototyping may proceed, but they cannot be represented as the website build.

## AI decision boundary

The instruction “do not take self-decisions” means the CLI must not invent material business choices. It does not mean asking the user how to name every variable.

| Decision type | Examples | Rule |
|---|---|---|
| Objective/reversible | semantic markup, test organization, accessible labels, lint fixes | Follow approved standards and proceed |
| Material business | offer scope, public copy, price, regional differentiation, guarantee | Recommend with evidence; stop for G1/G2 approval |
| External/provider | account choice, paid plan, number, mailbox, calendar, WhatsApp, voice | Compare current official facts; stop before connection/mutation |
| Legal/identity/payment | KYC owner, contract owner, tax treatment, payment/refund ownership | Adult/legal owner or qualified professional decides |
| Public/irreversible | publish, send, deploy production, delete data, destructive migration | Explicit named approval and rollback evidence |

Questions must be consolidated. Each question contains: missing fact, why it blocks, recommended option, alternatives, cost/risk, affected tasks, and what continues after approval.

## Real-data-only rule

Create or update the claim, price, asset, identity, provider, and contact ledgers before public rendering.

Never invent or infer:

- business address, legal owner, staff, client, testimonial, result, ROI, case-study outcome, certification, partner, integration, security guarantee, uptime, price, tax, discount, phone, email, social URL, provider state, availability, booking success, or payment success;
- founder/team portrait or customer/business photograph;
- screenshots that imply a live CRM/provider transaction when the evidence is only a demonstration.

If data is missing:

1. hide the optional public element;
2. show an approved neutral truth label if the element is necessary;
3. add one item to `state/DECISION_QUEUE.md`;
4. continue work that does not depend on the answer.

## Pricing and choice architecture

Research must separate India and each approved international target. Record currency, taxes, support windows, delivery cost, provider costs, buying norms, competitors, and scope differences. Do not hide one market's prices from another or pretend visitors will not compare.

The public choice system must:

- start with desired outcome and urgency, not a wall of packages;
- ask only information needed to recommend the smallest sufficient service;
- show one recommended option, a lower-scope option, and a custom path only where evidence supports them;
- explain inclusions, exclusions, provider costs, setup cost, ongoing cost, assumptions, cancellation/refund terms, and proof state;
- use truthful `starting at` or `request scope` when fixed prices are not defensible;
- avoid fake anchors, fake discounts, countdowns, forced continuity, hidden fees, obstructed cancellation, and fabricated ROI.

The objective is low decision friction and high trust, not preventing comparison through manipulation.

## Design/research boundary

Competitors and design benchmarks are evidence, not templates. Extract patterns, friction, gaps, proof structures, content hierarchy, and interaction behavior. Do not copy protected text, art, source code, branded components, or a distinctive page composition.

The final UI must preserve the approved IronWake identity while improving:

- task clarity and next-action visibility;
- proof and truth labeling;
- form completion and recovery;
- mobile behavior and accessible states;
- meaningful 2D system motion;
- restrained optional 3D with static/reduced-motion fallback;
- performance and readability across the full page, not only the hero.

No design choice is accepted only because it “looks premium.” It needs a buyer task, business meaning, accessibility behavior, performance cost, and evidence.
