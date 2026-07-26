# Stitch Export Audit

- Audited: 2026-07-26T15:28:59Z
- Source: `stitch_ironwake_stitch_prompt_pack_v4 (2).zip`
- SHA-256: `0b4b617524385637fca115965d596eac7dac56a29a578b155a3a09cea1dbd16d`
- Method: extracted only to `/tmp/opencode/ironwake-stitch-audit`; ran `scripts/audit-stitch-export.sh` against the extracted export. The source archive was not modified.
- Status: prototype input only; not production-ready.

## Verified Structure

| Item | Count | Consequence |
|---|---:|---|
| `code.html` screens | 30 | Must be rebuilt as routed, responsive application surfaces. |
| `screen.png` images | 30 | Visual-reference inputs only; not production page assets. |
| `DESIGN.md` files | 1 | Design-token and visual-direction input, subject to accessibility and truth controls. |
| Screens with Tailwind CDN | 30 | CDN prototype setup cannot ship. |
| Screens with inline scripts | 30 | Scripts require review, extraction, or removal. |
| Screens with `<form>` | 2 | Prototype forms do not prove submission persistence or provider success. |
| Screens with form controls | 10 | Controls require real validation, error, recovery, and authorization states. |
| External URL occurrences | 169 | All must be removed, replaced, or approved individually. |
| Google Aida-hosted image occurrences | 38 | Quarantined pending owned/licensed replacement. |

## Production-Blocking Findings

1. Every screen is an isolated desktop prototype with duplicated Tailwind CDN configuration and inline JavaScript; it is not one application.
2. Prototype success, availability, and booking language cannot establish database, calendar, provider, or notification completion.
3. Public pricing, rates, cost estimates, conversion figures, benchmarks, accuracy figures, client/project outcomes, and provider claims are unverified. See `reports/CLAIM_QUARANTINE.md`.
4. Google-hosted generated imagery, external font/CDN resources, and outbound prototype links have no production asset/license approval. See `reports/ASSET_LEDGER.md`.
5. A full route, CTA, form, and state matrix remains required before P0 can pass. The existing `docs/02_STITCH_ROUTE_COMPONENT_MAP.md` is an initial proposal, not completed audit evidence.

## Representative Quarantined Examples

| Screen | Prototype content | Reason |
|---|---|---|
| Booking Certainty | INR tiers and a `98% booking-to-arrival rate across 14 locations` | Price and outcome evidence absent. |
| AI Receptionist | INR/USD pricing and `REAL-TIME LOGGING ENABLED` | Price/provider status unapproved. |
| RapidPulse | `Sub-60s Dispatch Benchmark` and `99.2% accuracy` | Portfolio/provider proof absent. |
| DentaCare | `42%` and real-time clinic-management availability sync | Outcome and integration proof absent. |
| Atelier | Google/Fresha polling, double-booking prevention, and triage percentages | Provider and performance proof absent. |
| Insight article | audits of 42 platforms and an 18% retention result | Research and experiment evidence absent. |

## Readback

```text
HTML screens: 30
PNG screens: 30
DESIGN.md files: 1
HTML files with Tailwind CDN: 30
HTML files with inline script: 30
HTML files with form element: 2
HTML files with inputs: 10
External URL occurrences: 169
Google aida-public asset occurrences: 38
```

## Conclusion

The archive is retained as a visual reference and source of migration requirements only. Its code, prices, copy, provider states, links, and images are not approved for production use.
