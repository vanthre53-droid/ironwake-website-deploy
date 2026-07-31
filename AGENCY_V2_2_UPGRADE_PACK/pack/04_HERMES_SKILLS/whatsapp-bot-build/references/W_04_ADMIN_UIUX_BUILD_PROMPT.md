# W_04 — WHATSAPP ADMIN UI/UX BUILD SUB-PROMPT
**A separate, runnable build prompt for the WhatsApp operator surface.**
Paste into Claude Code after W_02 phases P1–P4 exist. Reads REAL rows from your v2.0/v2.1/v2.2 tables — never mock (Master §2 rule 2).

---

## 0. WHAT THIS SURFACE IS
- **Subject:** an operator console for a WhatsApp business line — an inbox + a health station. Not a WhatsApp clone, not a marketing dashboard.
- **Audience:** agency operator (all tenants via switcher) + client admin (own tenant, RLS-scoped).
- **Single job:** answer "is my number healthy, and does any conversation need me?" fast — then let the human handle the few that do and approve promotional sends.

---

## 1. DESIGN DIRECTION (deliberate, not a WhatsApp knock-off)
Do NOT recreate WhatsApp's green. Reject the three AI defaults. This is a *console*, so the thesis is **health-first: the number's quality rating is the loudest thing on the screen, because a throttled number is lost revenue.**

**Palette (quiet chrome, health carries the only saturated color):**
- `--bg: #0F1419` / `--panel: #171D26` / `--line: #262E3A` / `--text: #E8ECF1` / `--muted: #7E8899`
- Health states (reserved): `--green: #22C55E` · `--yellow: #F59E0B` · `--red: #EF4444`
- One brand accent for interactive affordances only: `--accent: #6366F1` (indigo — deliberately NOT WhatsApp green, so nobody confuses the console with the app).

**Type:** grotesque for headers (restraint), Inter for UI, **monospace for numbers** (message counts, costs, reply rates, template IDs — they must align in columns).

**Signature element:** the **Health Bar** — a persistent top strip showing quality rating (green/yellow/red), messaging tier, warm-up ramp progress, and window/cost pressure. It's the first thing the eye lands on and it's always visible. Spend boldness here; keep the inbox calm.

**Restraint:** no chat-bubble skeuomorphism, no gradients. Motion only on a real state change (a conversation moving to "needs you," a quality downgrade). Reduced-motion + visible focus + tablet-responsive.

---

## 2. SCREEN INVENTORY (build in order)
1. **Health Bar + Overview** (`/admin/whatsapp`) — the signature strip + counts (open conversations, needs-human, today's cost, avoidable templates). One glance = "healthy?"
2. **Conversation Inbox** (`/admin/whatsapp/inbox`) — live list of conversations (Supabase Realtime), filterable by status/intent; "needs human" pinned. Open one → full thread with grounding evidence per bot answer + a "take over" action.
3. **Template Manager** (`/admin/whatsapp/templates`) — per template: status (approved/rejected/pending), category, **per-language variants (W4)**, and performance (sent/delivered/read/replied, reply rate, conversion). Low-reply templates flagged. Submit / re-categorize actions.
4. **Quality & Warm-up** (`/admin/whatsapp/health`) — quality-rating history chart, current tier, warm-up ramp state, and the §23C root-cause checklist inline when YELLOW/RED. Freeze-sends control.
5. **CTWA Attribution** (`/admin/whatsapp/ctwa`, if ads) — cost per click/lead/booking, ROAS by campaign, top ads.
6. **Cost** (`/admin/whatsapp/cost`) — free vs paid (utility/marketing/auth) volume, avoidable-template list surfaced for action.

---

## 3. DATA CONTRACT (real rows)
- Inbox ← `conversations` + `messages` (Realtime), tenant-scoped. Take-over writes a handoff flag.
- Templates ← `templates` + template performance from analytics. Per-language ← W4 structure.
- Health ← `quality_rating_history` + `tenants.number_warmup`. Freeze writes a send-freeze flag.
- CTWA ← `ctwa_conversions`. Cost ← `tenant_billing` + the avoidable-template computation (§31C).
- **RLS:** this is a JWT-authenticated read surface → JWT-based RLS from §24B is correct here (distinct from the webhook write path, which uses W1/§33).

---

## 4. COPY RULES
- "Needs you," not "handoff status." "Send template," and the toast says "Sent." Health states in plain words: "Healthy / Watch / At risk," with the technical GREEN/YELLOW/RED as a secondary cue.
- Empty inbox: "All conversations handled." A YELLOW state explains what to do, in the console's voice, not an apology.

---

## 5. VERIFICATION GATE (Gate-C evidence)
- [ ] Health Bar renders live from `quality_rating_history`; a simulated downgrade turns it yellow in real time
- [ ] Inbox updates live from `messages`; "take over" writes the handoff flag (paste row)
- [ ] Template manager shows real approval statuses + per-language variants
- [ ] Freeze-sends control actually blocks a marketing send (paste the blocked attempt)
- [ ] RLS proven: client admin can't see another tenant's conversations
- [ ] Focus visible, reduced-motion honored, tablet layout intact, zero mock data (grep clean)

Commit: `feat: whatsapp admin console`.

## 6. WHAT NOT TO BUILD
No engagement metrics for their own sake, no vanity charts. Every panel drives one operator decision: handle a conversation, fix a template, protect the number, or approve a send. If a panel doesn't, cut it.
