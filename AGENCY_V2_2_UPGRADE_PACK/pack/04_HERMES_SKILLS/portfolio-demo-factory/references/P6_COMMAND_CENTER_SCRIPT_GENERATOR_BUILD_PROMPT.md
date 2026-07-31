# P6 — ADDED PROJECT: Agency Command Center + Script Generator (internal)
**Runnable build prompt. NOT in the 13-day calendar — dead-time/post-Day-14 only.** Why it's the one missing project: T1_02 §0 names the agency's own Command Center as the single defensible pre-revenue build, and X_01 §7 names the Script Generator "the revenue piece." Together they're your leverage tool: watch every demo/agent from one board, and generate the scripts that convert demos into signatures. This is ALSO the first real consumer of 39c §33 — your own agency is fleet tenant #1.

## SCOPE DECISION (progress.md line 1)
*"P6 internal. Build order: Script Generator FIRST (it pays today), fleet board second. Client work and outreach always preempt this."*

## PART 1 — SCRIPT GENERATOR APP (the X_01 engine as an interactive tool) [GLM; Opus for the analysis-engine prompt]
Implements **X_01 §6** exactly:
1. **Input form:** niche · market · channel (voice/whatsapp/web-widget/cold-DM/email/cold-call) · business + differentiators · offer · grounded-source link · audience (agent | human).
2. **Engine:** the X_01 §0 REFUSE RULE enforced in code — no grounded source or missing inputs → the UI asks, it never generates. §2's seven analysis findings are produced FIRST and rendered in an **Analysis panel** (show the work — this is what makes output trustworthy and what a client would pay for).
3. **Channel adapters:** route per X_01 §3 physics; voice output enforces ≤200 tokens/turn; WhatsApp output emits templates as separate per-language artifacts (W_05 §4); agent outputs carry disclosure + escalation + confirm blocks by construction.
4. **Output tabs:** Agent script · Human script · Artifacts. Human (Output B) always includes: pain-first open, the preview-first demo line, owner-objection responses, close with outcome framing + price + parent as signing entity.
5. **Library + versioning:** every script saved keyed by niche+market+channel; edit = new version (39c §33.8 prompt-registry pattern); a reusable improving script bank, never regenerate-from-zero.
6. **Grounding link:** generator reads the linked source into `entities` first (39c §33.5) so scripts are never stale.
**Gate P6-1 (paste):** a generation with all 7 findings rendered pre-script · a refusal on missing grounded source · a saved v1→v2 version pair · a voice script failing the 200-token check gets rejected by the app.
**Use it the same day:** run Output B against one REAL prospect from the live list. That's the shortest line in the whole system between built and signed.

## PART 2 — COMMAND CENTER / FLEET BOARD [T1_04 verbatim is the build prompt]
Build **only after** ≥1 paying client or when your own demos justify a board. Backend = 39c §33 (F1→F5 per T1_02, single-tenant-you first). Frontend = **T1_04** as written: Fleet Board lanes, Approval Queue (WHAT/WHY/EVIDENCE + approve/edit/reject), Task Detail, Objective DAG, Cost & Grounding panel with kill-switch. Design system, copy rules, and the Gate-C evidence list in T1_04 apply unchanged. Wire the Script Generator in as a tab — one app, two weapons.
**Gate P6-2:** T1_04 §5 checklist, every box, pasted evidence.

## COST (approx)
$0 infra (Supabase + Vercel free tiers; inference pennies). The real cost is calendar — which is why the preemption rule at the top is part of the spec.
