# Asset Ledger

- Audited: 2026-07-26T15:28:59Z
- Scope: Stitch export assets and external references found by `scripts/audit-stitch-export.sh`.
- Status: no production asset is approved from the Stitch archive.

| Asset ID | Source/path | Role | Ownership/license | Allowed channels | Status | Required action |
|---|---|---|---|---|---|---|
| AS-001 | 30 `screen.png` files inside verified Stitch archive | Visual comparison reference | Export provenance only; no production license evidence | Internal audit only | Quarantined | Do not deploy screenshots as page content; use only for documented visual comparison. |
| AS-002 | 38 `lh3.googleusercontent.com/aida-public` image references | Prototype decorative/project imagery | Unknown | None | Quarantined | Replace with approved owned/licensed local assets or truthful non-documentary abstract visuals. |
| AS-003 | Google Fonts URL references | Prototype typography | Hosting/license decision unverified | None | Pending | Verify licensing and choose self-hosted/subset or approved delivery during architecture. |
| AS-004 | Tailwind CDN references | Prototype runtime dependency | Not an owned production asset | None | Rejected for production | Implement a reviewed local build pipeline; do not ship CDN prototype configuration. |
| AS-005 | Material Symbols URL references | Prototype icon source | Delivery/license choice unverified | None | Pending | Use a reviewed icon strategy with accessibility labels and local/runtime controls. |
| AS-006 | Prototype external Vercel project URLs | Claimed demonstration links | Ownership and live state unverified | None | Quarantined | Verify project source, owner permission, public URL, and proof label before any link is published. |
| AS-007 | Canvas/WebGL shader code in prototype screens | Decorative visual treatment | Generated prototype code; no production performance review | Internal reference only | Quarantined | Rebuild only as a budgeted progressive enhancement with static and reduced-motion fallback. |

## Rules Applied

1. The audit found 169 external URL occurrences. No external URL is considered an approved asset, contact route, social profile, provider, or deployment endpoint from this evidence alone.
2. The 38 Google-hosted image occurrences are not copied, downloaded, or deployed. Their presence is an asset-risk finding, not a license grant.
3. No logo, founder portrait, customer photo, testimonial media, or documentary project media is present with verified ownership in the real-data intake.
4. Future production assets require asset ID, local path or approved URL, creator/source, ownership/license, permission evidence, allowed channels, expiry/attribution, alt-text decision, and optimized variants.

## Release Condition

No asset in this ledger may appear in public production rendering until it has a verified, named replacement or a documented approval record.
