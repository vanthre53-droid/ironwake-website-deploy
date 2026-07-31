# Website Prebuild Content and Route Contract

Status: `INTERNAL PREBUILD DRAFT — NOT IMPLEMENTED`

This contract converts the audited 30-screen prototype into a minimum truthful website scope. It does not authorize frontend implementation, deployment, provider connection, or publication.

## Launch route candidate set

| Route | Purpose | Truthful content boundary | CTA/state |
|---|---|---|---|
| `/` | Agency positioning | IronWake helps service businesses improve inquiry, booking, follow-up, and reception workflows. No outcome, uptime, provider, or client claims. | Request a Business Leak Audit → `ironwake.dev@gmail.com` |
| `/about` | Standards and identity | IronWake-led identity; Revanth Nunna as Founder only where approved. Explain truth labels and verification standard. | Email CTA only |
| `/audit` | Business Leak Audit explanation | Explain what is reviewed; no benchmark, price, purchase, or guaranteed result. | Request a Business Leak Audit |
| `/audit/request` | Inquiry intake | Minimal form; server validation and durable persistence required before success state. | `received; awaiting confirmation` |
| `/systems` | Guided systems index | Explain categories without implying connected providers or live availability. | Explore a system / request audit |
| `/process` | Delivery method | Map → fix → test → document. No unapproved contract, payment, uptime, or SLA claims. | Request scope |
| `/work` | Demonstration index | Show only approved demonstration labels and limitations. No client engagement, metric, testimonial, or provider claims. | Review proof status |
| `/privacy` | Privacy draft route | Must use real entity/contact/retention/processor decisions; do not publish a placeholder legal policy. | None until reviewed |
| `/terms` | Terms draft route | Must receive adult/legal-owner review before publication. | None until reviewed |
| `404` | Recovery | Link only to active routes; no prototype WebGL dependency. | Return home |

## Deferred route set

Defer `/pricing`, `/systems/ai-receptionist`, `/systems/booking-control`, `/systems/missed-lead-recovery`, `/systems/trust-lead-capture`, all industry pages, all case-study routes, `/insights`, and any provider/payment-specific route until the applicable proof, pricing, legal, content, and provider gates pass.

## Shared UI states

Every interactive flow must support:

- idle;
- loading;
- validation error;
- network/server error;
- retry;
- received and awaiting confirmation;
- duplicate/request already received;
- unavailable/deferred provider state;
- reduced-motion and keyboard-accessible operation.

A green UI state must never imply a database commit, notification send, booking, payment, or provider success unless the relevant evidence exists.

## Global copy rules

- Use `DEMONSTRATION`, `PROVIDER PROOF PENDING`, or `AWAITING VERIFICATION` where needed.
- Never publish `ironwake.dev` as a live URL before purchase and DNS verification.
- Use `ironwake.dev@gmail.com` as the working contact route only after send/receive monitoring is confirmed.
- Omit phone, WhatsApp, social links, prices, testimonials, client logos, metrics, and guarantees until verified and approved.
- Do not use Stitch HTML, CDN dependencies, hotlinked imagery, unverified copy, fake statistics, or prototype success states.

## Build gate

Implementation remains blocked until the repository's named G1/G1.5/GS1 decisions are reconciled. After approval, implement the smallest route set above, then add database/API acceptance tests before dependent UI success states.
