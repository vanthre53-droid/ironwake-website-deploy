# 01 — PHASE 0: INVENTORY, TRUTH, SKILL DISCOVERY
Role: C1. Mutation: READ-ONLY except reports/.

Produce, from what actually exists on disk (never from assumption):

1. reports/SOURCE_INVENTORY.md — every archive, export, kit, skills folder, and design
   source found. Path, type, date, what it authoritatively provides.
2. reports/STITCH_AUDIT.md — per screen: usable as-is / needs rework / unusable. Flag
   every CDN dependency, duplicated markup, hotlinked image, hardcoded price/metric.
3. reports/CLAIM_QUARANTINE.md — EVERY factual claim found in any source (price, metric,
   testimonial, client, guarantee, integration, uptime). Mark each: VERIFIED (with source)
   | UNVERIFIED | FABRICATED. Unverified and fabricated claims may not reach production.
4. reports/ASSET_LEDGER.md — every image/font/icon: source, license, owned?, replaceable?
5. reports/SKILL_INVENTORY.md — per AGENTS.md §6: name, path, purpose, freshness, inputs,
   side effects, phase.
6. reports/SCREEN_ROUTE_MATRIX.md — Stitch screen → intended route → disposition.

Then set next_exact_action to P1 and checkpoint. Do not write any application code.
