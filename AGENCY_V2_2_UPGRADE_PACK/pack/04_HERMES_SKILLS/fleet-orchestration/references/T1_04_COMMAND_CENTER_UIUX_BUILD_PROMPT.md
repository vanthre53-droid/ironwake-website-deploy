# T1_04 — COMMAND CENTER UI/UX BUILD SUB-PROMPT
**A separate, runnable build prompt for the `/admin/agents` surface.**
Paste into Claude Code after the fleet backend (T1_02 phases F1–F5) exists. This builds the human-facing surface where the operator watches the fleet and owns every consequential decision. It reads REAL rows from the T1_01 tables — never mock data (Master §2 rule 2 applies).

---

## 0. WHAT THIS SURFACE IS (pin the subject before designing)
- **Subject:** an operations control room for a fleet of AI employees. Not a SaaS dashboard, not a marketing page — a *working surface* an operator scans for 5 minutes a day and returns to when a decision needs them.
- **Audience:** two roles, RLS-scoped. Agency operator (sees all tenants via a switcher). Client admin (sees only their tenant).
- **The page's single job:** answer "is the fleet fine, and what needs me?" in under five seconds, then let the human decide the handful of things only a human should.

---

## 1. DESIGN DIRECTION (deliberate — not a templated default)

Reject the three AI-default looks (cream+serif+terracotta / near-black+acid-green / broadsheet hairlines). This is an ops tool, so the design thesis is: **color is information, never decoration.** Every hue on the screen must mean a state. Neutral chrome everywhere else so the meaningful color pops.

**Palette (semantic — hues reserved for state):**
- `--ink: #12151C` (base surface, calm under load)
- `--panel: #1A1F29` (raised panels)
- `--line: #2A3140` (hairline dividers)
- `--text: #E6E9EF` / `--muted: #8A93A6`
- State (the ONLY saturated colors on screen): `--running: #3B82F6` (blue, in-motion) · `--ok: #22C55E` (green, done) · `--wait: #F59E0B` (amber, needs human) · `--fail: #EF4444` (red, action now) · `--idle: #4B5563` (grey, queued)

**Type:**
- Display/section: a confident grotesque (e.g. *Space Grotesk* or *General Sans*) — used sparingly, for board and section headers only.
- Body/UI: a neutral, legible sans (e.g. *Inter*).
- **Data/IDs/metrics: a monospace** (e.g. *JetBrains Mono*) — task IDs, correlation IDs, costs, latencies. In a control room, monospace numerals that align in columns *are* the design; they let the eye scan a moving board.

**Signature element:** the **Fleet Board** — a horizontal set of agent lanes where task cards flow left→right through their states (queued → running → review → needs-human → done), each card colored by state. It reads like a live mission-control board. Spend your boldness here; keep everything else quiet.

**Restraint:** no gradients, no glow, no decorative motion. The only motion is a task card moving lanes when its status actually changes (motion = a real state transition, nothing else). Reduced-motion respected. Keyboard focus visible. Responsive down to a tablet (operators use tablets); mobile shows the approval queue + board summary, not the full board.

---

## 2. SCREEN INVENTORY (build in this order)

1. **Fleet Board** (`/admin/agents`) — the signature. Lanes per agent; cards per task colored by `status`. At-a-glance counts per state. Tenant switcher top-bar (operator only). One glance answers "is it fine?"
2. **Approval Queue** (`/admin/agents/approvals`) — the `needs_human` tasks, oldest first. Each item: **what** the agent wants to do (plain language) · **why** (reasoning + acceptance criteria + critic notes) · **evidence** (grounding facts used, tool returns). Actions: **Approve** · **Edit & approve** · **Reject** (reason required).
3. **Task Detail** (`/admin/agents/tasks/[id]`) — full envelope: goal, inputs, acceptance, artifacts, critic score + notes, state history, cost, correlation ID. Link to the parent objective's graph.
4. **Objective View** (`/admin/agents/objectives/[id]`) — the task graph for one objective, rendered as a small DAG so the operator sees the plan and where it stalled.
5. **Cost & Grounding Panel** (`/admin/agents/health`) — fleet spend vs cap (with the kill-switch control), stale-grounding facts, prompt-version pointers with one-click rollback.

---

## 3. DATA CONTRACT (real rows, never mock)
- Board lanes ← `agent_config` (agents) · cards ← `agent_tasks` filtered by tenant, grouped by `status`. Live updates via Supabase Realtime subscription on `agent_tasks`.
- Approval queue ← `agent_tasks WHERE status='needs_human'` ordered by `created_at`.
- Approve → transition `needs_human → running`, write `audit_logs`. Edit&approve → patch `artifacts`, then approve. Reject → `needs_human → cancelled`, run compensation (T1_01 §33.1), log reason.
- Cost panel ← `fleet_budget`; kill-switch writes `fleet_budget.kill_switch`. Grounding ← `entities`/`knowledge_chunks` where stale. Prompt pointers ← `agent_config.active_version`.
- **RLS:** client admin queries are JWT-scoped to their `tenant_id`; the operator switcher is gated to the operator role. (Note: this UI reads under a user JWT, so JWT-based RLS is correct *here* — unlike the webhook write path. Keep them separate.)

---

## 4. COPY RULES (from the design brief)
- Name things by what the operator controls: "Needs your approval," not "needs_human status." "Send" not "Submit." An action keeps its name through the flow: the button that says **Approve** produces a toast that says **Approved**.
- Empty states are directions, not mood: an empty approval queue says **"Nothing needs you right now."** not a shrug illustration.
- Errors state what happened and how to fix it, in the interface's voice. No apologies.

---

## 5. VERIFICATION GATE (evidence required — this is a Gate-C surface)
Paste as evidence:
- [ ] Board renders live from real `agent_tasks` rows; a status change in the DB moves the card lane in real time (screenshot before/after)
- [ ] Approve / Edit&approve / Reject each write the correct transition + `audit_logs` row (paste the rows)
- [ ] Reject runs the task's compensation (paste the reversed side-effect)
- [ ] RLS proven: client-admin session cannot see another tenant's tasks (cross-tenant query returns empty)
- [ ] Keyboard focus visible on every interactive element; reduced-motion honored; tablet layout intact
- [ ] Zero mock data in committed code (grep clean)

Commit: `feat: command center UI + approval flow`.

---

## 6. WHAT NOT TO BUILD
No settings sprawl, no charts that don't drive a decision, no dark-pattern engagement. This is a tool an operator wants to *leave* — success is them closing it after 5 minutes because nothing needs them. Design for absence, not time-on-page.
