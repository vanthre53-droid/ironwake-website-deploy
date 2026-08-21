# PRICING_CONFLICTS.md

V15 §89 — Catalogue of historical prices, stale numbers, currency mistakes, removed offers, and the source-of-truth they were replaced with. This is a reference document only. All current customer-facing prices live in `lib/pricing.mjs` (frozen canonical source) and are surfaced exclusively at `/pricing`.

## Canonical source-of-truth

`lib/pricing.mjs` exports:
- `PRICING_OFFERS` — the approved five offers.
- `PRICING_TIERS` — three tiers (Lite, Standard, Pro).
- `dualLitePrice(offerId)` — region-aware Lite price string.
- `litePriceSummary()` — the headline summary string used on the homepage and `/pricing`.

Any price string outside `lib/pricing.mjs` is non-authoritative.

## Current approved five-offer Lite price grid

| Offer ID                    | Offer name             | India (₹)    | International ($) |
| --------------------------- | ---------------------- | ------------ | ----------------- |
| `business-leak-audit`       | Business Leak Audit    | 799          | 29                |
| `missed-lead-recovery`      | Missed Lead Recovery   | 2,200        | 99                |
| `booking-control`           | Booking Certainty      | 12,999       | 199               |
| `trust-lead-capture`        | Trust and Lead Capture | 12,999       | 499               |
| `ai-receptionist`           | AI Receptionist        | 29,999       | 1,000             |

These prices are locked in `lib/pricing.test.mjs` (regression assertions on lines 12-18) and in `app/pricing/PricingPage.test.{js,mjs}` (visual and structural assertions). They are also mirrored in the FAQ JSON-LD on `/pricing`.

## Historical price corrections (replaced before launch)

| Date            | Surface             | Old value                                    | New (current) value                                                                 | Reason for correction                                                                                                  |
| --------------- | ------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| pre-V15 §80     | Homepage hero JSON-LD | Single `Offer` node with `price: '799'`      | Removed `Offer/PriceSpecification` from homepage JSON-LD; Lite grid lives only at `/pricing` | V15 §80 regression: AI retrieval systems were reducing IronWake to a single currency amount. Org/service nodes only at the homepage now. |
| pre-V15 §87     | `app/terms/page.js:23` | "This site is a capability demo running in pre-launch mode." | "The published setup prices are real, the scope request is a real form, customer accounts are real, and the chatbot is a real AI. Proposals and contracts are handled by email during the current low-volume phase." | V15 §87/§127: truthful demo disclosure preserved on `/work/*` portfolio pages; whole-site labelling replaced on `/terms` so the company is not framed as a noncommercial framework demo. |
| pre-V15 §86     | `app/systems/*/page.js` `<title>` | "X — IronWake Systems"                                | "X — IronWake"                                                                          | §86 brand rename: canonical brand is `IronWake`. The `Systems` suffix was a §86 forbidden variant. Already correct in `openGraph.title`; synced to `<title>` for consistency. |
| pre-V15 §127    | `app/manifest.json` + `app/manifest.webmanifest/route.js` description | "Operational workflow mapping and implementation for service businesses…" | "IronWake designs and builds conversion websites, AI receptionists, booking and lead-recovery systems, and CRM/follow-up automation for service businesses…" | §127: "workflow mapping" mis-positioned IronWake as a consultancy-only mapping shop, contradicting §88 OFFERED_NOW. Replaced with the build-and-deploy statement. |
| pre-V15 §102    | `app/components/SiteHeader.js` nav | `['/systems', 'Services']` (sub-index), no `/verification` entry | `['/services', 'Services']` + `['/verification', 'Proof']` | §102 internal-link discoverability: `/services` is the canonical OFFERED_NOW overview; `/verification` is the proof-class index. Both must be discoverable from the homepage nav. |

## Removed offers (catalog history)

None removed in V15 window. The OFFERED_NOW_MATRIX is the first canonical service matrix; previous Stitch-derived placeholders were scrapped during the §80 cut-over without ever being published.

## Currency representation rules

- Lite India prices are written in **rupees** (`₹` + Indian grouping, e.g. `₹12,999`).
- Lite International prices are written in **USD** (`$` + thousands separator, e.g. `$1,000`).
- The dual Lite price string is `'<INR> / $<USD>'` with a literal slash and a single space on each side.
- No other currencies are listed. No cents are listed. No per-month / per-year suffixes appear on Lite.
- Recurring provider costs (telephony, hosting, AI runtime) are itemised separately and only after a verified provider is selected.

## Number-form and rounding rules

- INR uses the Indian comma system: `12,999` not `13,000`.
- USD uses the Western comma system: `1,000` not `999.99`.
- The headline `litePriceSummary()` always starts with the Business Leak Audit Lite and lists all five in OFFERED_NOW order.

## Stale-data spot-checks

The following classes of string are NEVER to be reused if the corresponding canonical price changes:
- The `₹ / $` Lite string in homepage hero and `/pricing` header (consumers: `lib/pricing.mjs::litePriceSummary`).
- The `Lite` price in each `/services/<slug>` capability card (consumers: `app/services/ServicesCatalog.js` and `app/services/page.js`).
- The FAQ JSON-LD on `/pricing` (consumers: `app/pricing/page.js` FAQ entries that mention `auditLitePrice`).
- The `auditLitePrice` reference in `app/audit/page.js` metadata description.

Any drift across these surfaces is a §89 violation. The `lib/pricing.test.mjs` assertion set is the canonical regression gate.

## Verification

Run the canonical-pricing regression suite with:
```
node --test lib/pricing.test.mjs app/pricing/PricingPage.test.js app/pricing/PricingPage.test.mjs scripts/canonical-brand-contract.test.mjs
```

A green gate is required before any pricing-affecting change is merged.