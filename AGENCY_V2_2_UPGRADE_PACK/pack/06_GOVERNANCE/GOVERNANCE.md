# REPOSITORY GOVERNANCE & SINGLE SOURCE OF TRUTH
**Applies to the whole pack. Added by the production-hardening audit (2026-07-10). Additive — no original content changed.**

## G1. CANONICAL SOURCE + PROPAGATION (fixes the repo's #1 structural risk)
The three consolidated modules exist in THREE physical copies: `01_UPGRADED_MODULES/` (canonical), inside each kit zip under `modules/`, and inside Hermes skill `references/`. Un-governed, these WILL drift.
**Rules:**
1. `01_UPGRADED_MODULES/*.md` is the ONLY editable copy. Kit zips and skill `references/` are **build artifacts**.
2. Any module edit runs the propagation checklist, in order: edit canonical → append `CHANGELOG.md` entry → re-copy into `kits/*/modules/` and every skill `references/` that carries it → re-zip the three kits → regenerate `CHECKSUMS.sha256` → regenerate the pack zip.
3. `CHECKSUMS.sha256` is the drift detector: `sha256sum -c CHECKSUMS.sha256` — any FAILED line means a copy was edited out-of-band; resolve by re-propagating from canonical, never by editing the copy.
4. Same rule for portfolio prompts (canonical: `03_PORTFOLIO_BUILD_PROMPTS/`; copies in `portfolio-demo-factory/references/`).

## G2. VERSIONING & DEPRECATION
- Module versions are semantic per track: **U** (universal/File-39 line): v7.2 · **V** (voice/File-40): v2.2 · **W** (whatsapp/File-42): v2.2. Hardening sections added inside a version bump the PATCH conceptually (v7.2.1 / v2.2.1) — recorded in `CHANGELOG.md`; file names keep the major.minor.
- Deprecation table (single authority):

| Deprecated | Superseded by | Status |
|---|---|---|
| 39b-V7_1_UPGRADE_MODULE.md (standalone use) | 39c (contains it verbatim) | reference-only, keep in 05_ |
| V_01 / W_01 (standalone appends) | 40c / 42c (contain them verbatim) | reference-only |
| old Hermes `demo generation` skill | voice-agent-build + demo-personalization-pipeline | retire after first P5 run |
| Standalone "LeadFlow" concept | P2 Phase E CRM drip | dead (per portfolio doc) |

## G3. CITATION NAMESPACE (fixes cross-track §-collisions)
Three tracks each use §22–§40-range numbers (e.g. §27 = agentic module in U, call-QA in V, CTWA in W). **From now on every cross-file citation is prefixed:** `U§33.5` (universal), `V§33` (voice), `W§34` (whatsapp). Existing un-prefixed citations inside a single file resolve to that file's own track — do not rewrite them; new writing uses prefixes.

## G4. REFERENCE RESOLUTION MAP (broken/ambiguous refs, resolved without rewriting originals)
| Reference found in files | Resolves to |
|---|---|
| "T1_01 §33.x" (in T1_02/03/04/05) | **39c U§33.x** — the uploaded T1_01 file contains the portfolio plan, not the fleet spec; U§33 is its reconstruction |
| "Voice v2.1 §23–§32" / "40b" | **40c reconstructed spine** — original 40b never uploaded; spine flagged in-file; replace with original prose if recovered |
| "File 39 / File 40 / File 42" (base v7.0/v2.0 generators) | NOT in this repo — the consolidated modules are appends to them; keep the base files with the kits on your machine |
| Voice `suppression_list(phone, reason, added_at)` vs W_01 insert using `added_by` | **Canonical schema:** `suppression_list(phone TEXT PRIMARY KEY, channel TEXT, reason TEXT, added_by TEXT, added_at TIMESTAMPTZ DEFAULT now())` — superset; both originals remain valid readers/writers |
| Flows key rotation: W§37 says 180 days; WA kit rule §W3 says 12 months | **180 days is authoritative** (strictest wins; W§37 is the newer artifact). Kit rule remains as written; this line governs |

## G5. UNIFIED SECRET-ROTATION CADENCE (consolidates four scattered statements — consolidation, not new policy)
WABA tokens **60d** (§W1) · Vapi/Retell keys **90d** (§V8) · Infisical-held API keys **90d** (U§30) · Flows private key **180d or on suspicion** (W§37, per G4) · demo assistants/numbers auto-archive **14d** (V§39C). Calendarized in Infisical; rotation is an `audit_logs` event.

## G6. DUAL-RUNTIME MODEL POLICY (documents an intentional split the audit initially flagged as inconsistency)
- **Kit sessions (Claude Code):** Haiku 4.5 / Sonnet 4.6 / Opus 4.8 routing per kit CLAUDE.md — governs how the *builder* works.
- **Hermes/OpenCode sessions + product runtimes:** GLM-5.2 primary coder, Kimi K2.6 escalation, DeepSeek per your v1.1 router; voice runtime uses fast/cheap models (Haiku/4o-mini/Flash) per latency budget.
Both are correct simultaneously; a P-file naming GLM and a kit naming Sonnet is not a contradiction. Cost-tier intent is identical: cheapest model that clears the phase's quality bar.

## G7. ADR DISCIPLINE (repo level)
Project-level ADRs already exist (`.claude/memory/decisions.template.md`). Repo-level decisions (like everything in this file) get one CHANGELOG entry + a line here if they constrain future edits. No parallel ADR system — one log.
