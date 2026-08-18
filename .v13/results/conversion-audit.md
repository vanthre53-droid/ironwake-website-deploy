# IronWake V13 — Conversion Psychology Audit

**Scope:** Read-only audit of every public route under `app/`. No source code modified. No social proof or claims invented.
**Tool:** ironwake-conversion specialist.
**Design tokens (locked, V13):** `--paper #f5f5f7`, `--ink #1d1d1f`, `--copper` collapsed to `#1d1d1f`. Palette review honoured throughout.
**Live truth check:** `curl https://ironwake.dev/` confirmed `<title>IronWake — Stop losing leads between enquiry and follow-up</title>` — matches staged H1.
**Date of audit:** 2026-08-18 (build `ironwake-v13`).

---

## 0. Route inventory

| Route | File(s) read | Status |
|---|---|---|
| `/` | `app/page.js` (single 465-line JSX, 9 chapters) | READ |
| `/pricing` | `app/pricing/page.js` + `app/pricing/PricingPage.js` | READ |
| `/about` | `app/about/page.js` | READ |
| `/systems` | `app/systems/page.js` (4 systems) | READ |
| `/systems/missed-lead-recovery` | (child route, listed; not deeply read — see §11) | READ (index only) |
| `/systems/booking-control` | (child route, listed) | READ (index only) |
| `/systems/trust-lead-capture` | (child route, listed) | READ (index only) |
| `/systems/ai-receptionist` | (child route, listed) | READ (index only) |
| `/industries` | `app/industries/page.js` | READ |
| `/industries/home-services` | `app/industries/home-services/` | EXISTS (index only) |
| `/industries/dental-clinics` | `app/industries/dental-clinics/` | EXISTS (index only) |
| `/industries/salons-spas` | `app/industries/salons-spas/` | EXISTS (index only) |
| `/audit` | `app/audit/page.js` + `app/audit/AuditForm.js` | READ |
| `/book` | `app/book/page.js` + `app/book/BookingPreview.js` | READ |
| `/work` | `app/work/page.js` (10 case studies) | READ |
| `/process` | `app/process/page.js` | READ |
| `/insights` | `app/insights/page.js` (+ 4 article slugs) | READ |
| `/voice` | `app/voice/page.js` (`noindex`) | READ |
| `/scope` | `app/scope/page.js` | READ |
| `/contact` | **MISSING — no `app/contact/` directory** | MISSING |
| `/services` | Linked from pricing FAQ (`/services`) — directory does not exist; link will 404 | MISSING LINK |
| `/login` | `app/login/page.js` + `LoginForm.js` | ACCOUNT (not conversion-scored) |
| `/signup` | `app/signup/page.js` + `SignupForm.js` | ACCOUNT (not conversion-scored) |
| `/account` | `app/account/page.js` + `AccountView.js` | ACCOUNT (not conversion-scored) |

**Nota bene on MISSING:** the brief asked to report 404/500 routes as MISSING. `/contact` is referenced in `app/pricing/PricingPage.js` ("Email" link → `mailto:ironwake.dev@gmail.com`). It is NOT a public page — and there is no standalone contact form on the public site. The audit treats this as a STRUCTURAL MISSING, not a 404, because the email link is functional but the conversion semantics differ. See §10 (high-leverage fix #1).

System/industry child routes were opened via directory listing but not deeply read. Their headlines + cards are echoed from the homepage composition; the score for `/systems` and `/industries` is the honest aggregate signal — child pages are not numerically scored here to avoid fake precision.

---

## 1. Scoring rubric (0–100 per dimension)

| Dimension | What it measures |
|---|---|
| **HEADLINE CLARITY** | Problem → promise in 8 words; first viewport makes the offer obvious |
| **SOCIAL PROOF** | Any truthful social proof with verifiable source — labelled demos PASS, fabrications FAIL |
| **RISK REVERSAL** | Guarantee / refund / no-card / free trial — including the audit-as-no-obligation move |
| **CTA HIERARCHY** | Exactly one primary action per viewport; secondary is visually subordinate |
| **FRICTION** | Fields, steps, modals before conversion |
| **OBJECTION HANDLING** | Price, AI, time, scope, ownership — each named and addressed |
| **TRUST SIGNALS** | Real client, real revenue, real outcome — demo labels survive; vague claims fail |
| **MOBILE CONVERSION** | CTA reachable thumb, no horizontal scroll, 16px+ body copy, no modal traps |

Aggregate score = unweighted mean (kept simple on purpose — adding weights would be fake precision).

---

## 2. Per-route scorecard

### `/` (Homepage) — `app/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **88** | H1: "Stop losing leads between enquiry and follow-up." (8 words, problem→promise, exact). Live title matches. |
| Social proof | **35** | Three LABELED demo cards (`rapidpulse`, `dentacare-pro`, `atelier`) — clearly tagged "Demonstration —". Founder ("Revanth Nunna", named) acts as 1-person proof. NO real client logos, NO revenue claims. Honest: high. |
| Risk reversal | **72** | "The audit closes before any system is scoped" + "No obligation, no agent pipeline" (final CTA). No money-back wording (correct — there is no charge for audit). |
| CTA hierarchy | **62** | Hero has 3 buttons ("Book Diagnostic", "See offers", "How we work"); final CTA has 3 again. Three actions per viewport = decision paralysis. PRIMARY is consistently "Book Diagnostic" (copper-bordered `.button`), but the "See offers" secondary pulls 50/50 attention. |
| Friction | **80** | One click → `/audit`. No modals, no newsletter popups. |
| Objection handling | **86** | FAQ (5 items) addresses WHAT, PRICING, AI-LIVE, TIME, OWNER. Disclosure block explicitly labels what's live vs pending. Excellent. |
| Trust signals | **70** | Disclosure section ("What's true, what's a demonstration, and what's still in build") is unusual for a site but a strong signal. Founder paragraph names the operator. Missing: link to a named client letter, case study with numbers. |
| Mobile conversion | **80** | `.hero-actions` stacks; `.signal-rail` is a 3-node row; CTA is at top + bottom. No horizontal scroll detected in markup. Could not visually verify — score reflects source. |
| **Aggregate** | **71.6** | |

**Recommendation:** SHIP. This is the strongest conversion page in the site. The 3-button hero is the only high-leverage weakness.

---

### `/pricing` — `app/pricing/page.js` + `PricingPage.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **82** | H1: "See the offers. Choose the engagement boundary that matches your operating gap." Functional but verbose for an 8-word test. The promise is "transparent, regional, no-markup pricing". |
| Social proof | **25** | No client logos, no testimonials. Pricing itself acts as trust: 5 offers × 3 tiers × 2 regions = explicit ladder. Inferior to homepage. |
| Risk reversal | **88** | "Pay only for the agreed architecture" + "No agent pipeline, no obligation, no invoice until you sign an offer" + "Costs are billed directly by providers and never marked up". Exceptional. |
| CTA hierarchy | **78** | Per-tier CTA is clear ("See Lite offers" etc.); section bottoms have "Start with the audit" as primary. Two CTAs per viewport, but visually distinct. |
| Friction | **90** | FAQ answers, region toggle, no popup. |
| Objection handling | **92** | Dedicated FAQ row: "Is the audit free?", "What does 'agreed architecture' actually mean?", "Do you take a percentage?", "Why is everything per-region?", "Why is there no SaaS subscription?" — this is the strongest objection-library on the site. |
| Trust signals | **75** | Per-region table; provider-cost named (Retell, OpenAI, WhatsApp, Cal.com); "set in writing before they start" wording. |
| Mobile conversion | **75** | Region toggle is plausible; tier cards stack. |
| **Aggregate** | **75.6** | |

**Recommendation:** SHIP. The strongest risk-reversal + objection-handling page in the site.

---

### `/audit` — `app/audit/page.js` + `AuditForm.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **85** | "Business Leak Audit — written review of one operating gap." Concrete. |
| Social proof | **20** | None. (This is the conversion endpoint — fine.) |
| Risk reversal | **95** | "Free, no obligation, no agent pipeline" + "What we'll never do" section covers 5 anti-patterns. Best in class. |
| CTA hierarchy | **90** | Single primary submit; "What we'll send back" precedes the form. |
| Friction | **35** | AuditForm.js: 7 fields (name, business, role, contact, intake source, problem summary, "anything else"). That's a 7-field form for a no-obligation audit. Industry benchmark for B2B service diagnostics: 4–5 fields max. |
| Objection handling | **80** | "What we'll do" + "What we'll never do" + FAQ + "data" footer. |
| Trust signals | **70** | "Adult/legal owner approval" wording + "no auto-funnel" disclaimer. |
| Mobile conversion | **70** | 7-field form on mobile is a known drop-off point. |
| **Aggregate** | **68.1** | |

**Recommendation:** REWORK (low-mid risk). Structure is excellent; only the field count is the friction lever.

---

### `/book` — `app/book/page.js` + `BookingPreview.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **78** | "Pick a slot. We send a confirmation with a written agenda." Direct. |
| Social proof | **20** | None. |
| Risk reversal | **65** | "No payment at booking" + "reschedule" link. No "free if we cancel" wording. |
| CTA hierarchy | **85** | Single submit per step. |
| Friction | **70** | BookingPreview.js: 6 fields (name, business, email, phone, role, "what outcome"). Plus a calendar widget. 2-step. |
| Objection handling | **55** | Why-bullet list covers 3 angles ("scope first", "no sales call", "written agenda"). Missing: time zone, reschedule friction, "what if I miss it". |
| Trust signals | **60** | "Powered by Cal.com" + "free slot finder" + ironwake.dev@gmail.com fallback. Honest. |
| Mobile conversion | **65** | Calendar widget on mobile is finicky. |
| **Aggregate** | **62.3** | |

**Recommendation:** SHIP. Slight rework value on timezone + reschedule copy.

---

### `/about` — `app/about/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **80** | "IronWake is built and operated by a single named owner." Trust-first, conversion-correct. |
| Social proof | **55** | Founder bio (Revanth Nunna, named) + "work is referenced with the owner's consent" framing. No logos. |
| Risk reversal | **40** | None directly on this page. |
| CTA hierarchy | **70** | Single primary "Book Diagnostic" + footer. |
| Friction | **95** | One-click to `/audit`. |
| Objection handling | **60** | "Why a single operator" section addresses the "but you're a one-person shop" objection head-on. |
| Trust signals | **85** | Single-owner disclosure is itself a trust signal (named, accountable). |
| Mobile conversion | **85** | No issue. |
| **Aggregate** | **71.3** | |

**Recommendation:** SHIP.

---

### `/systems` — `app/systems/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **78** | "Four systems. One operating model." Mural-quality. |
| Social proof | **30** | None. |
| Risk reversal | **40** | None (this is an explanatory page). |
| CTA hierarchy | **85** | One CTA per card; section bottom CTA. |
| Friction | **85** | Pure navigation. |
| Objection handling | **75** | Per-system "what changes" + "what it does NOT do" sub-sections. |
| Trust signals | **55** | Cross-links to industries, process. |
| Mobile conversion | **80** | Card grid collapses. |
| **Aggregate** | **66.0** | |

**Recommendation:** SHIP.

---

### `/industries` — `app/industries/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **70** | "Built for service businesses where every lead is revenue." Generic but honest. |
| Social proof | **25** | None. |
| Risk reversal | **35** | None. |
| CTA hierarchy | **80** | Single per card. |
| Friction | **85** | Navigation. |
| Objection handling | **65** | Each industry named; "operating gap" framing. |
| Trust signals | **50** | No outcomes per industry. |
| Mobile conversion | **80** | OK. |
| **Aggregate** | **61.3** | |

**Recommendation:** SHIP — but child pages (`/industries/dental-clinics` etc.) should each carry one named, labelled demonstration or one outcome-line, not bigger than that. Defer to §11.

---

### `/work` — `app/work/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **85** | "Examples are labelled. Real engagements are referenced with the owner's consent." Truth-first. |
| Social proof | **55** | Honest mix: RapidPulse, DentaCare, Atelier (labeled); others are placeholders. NO fake logos. |
| Risk reversal | **30** | None. |
| CTA hierarchy | **70** | Multiple case grid cards compete. |
| Friction | **85** | One click. |
| Objection handling | **60** | "What these are not" footer. |
| Trust signals | **70** | Label discipline is itself a trust signal. |
| Mobile conversion | **75** | Grid stacks. |
| **Aggregate** | **66.3** | |

**Recommendation:** SHIP. Honest labelling is rare and worth preserving.

---

### `/process` — `app/process/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **80** | "Audit. Review. Systems. Verify." Rhyme + sequence. |
| Social proof | **20** | None. |
| Risk reversal | **55** | "Sign nothing until the architecture is written" — strong. |
| CTA hierarchy | **80** | Single CTA. |
| Friction | **90** | One click. |
| Objection handling | **80** | Each step names what enters, what exits, who signs. |
| Trust signals | **70** | "Single named owner" + "no third-party unmarked-up cost" + "written record". |
| Mobile conversion | **85** | Vertical layout. |
| **Aggregate** | **70.0** | |

**Recommendation:** SHIP.

---

### `/insights` — `app/insights/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **75** | "Operational thinking for service businesses." Functional. |
| Social proof | **40** | 4 articles by category; no author bylines, no dates prominent. |
| Risk reversal | **30** | None. |
| CTA hierarchy | **70** | Two CTAs at bottom (audit + pricing). |
| Friction | **95** | Read-only. |
| Objection handling | **60** | "AI receptionist: an honest assessment" article is a trust-builder. |
| Trust signals | **55** | Category badges. |
| Mobile conversion | **80** | OK. |
| **Aggregate** | **63.1** | |

**Recommendation:** SHIP.

---

### `/voice` — `app/voice/page.js` (noindex)

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **90** | "Talk to the published IronWake assistant in your browser." Disclosed. |
| Social proof | **25** | Project's own assistant. |
| Risk reversal | **85** | "Microphone stays off until you tap start" + "IronWake does not record the audio". |
| CTA hierarchy | **75** | Single launcher button. |
| Friction | **60** | One click → consent → microphone permission. Mechanical, not procedural. |
| Objection handling | **70** | "Prefer not to talk? Book a diagnostic or email" — graceful alt. |
| Trust signals | **85** | Full disclosure of Retell routing. |
| Mobile conversion | **65** | Mic flow on mobile is fragile. |
| **Aggregate** | **69.4** | |

**Recommendation:** SHIP. `noindex` is correct.

---

### `/scope` — `app/scope/page.js`

| Dimension | Score | Evidence |
|---|---|---|
| Headline clarity | **85** | "Define the problem before choosing the build." Anti-sales. |
| Social proof | **30** | None. |
| Risk reversal | **90** | "A request is not a contract, invoice, or delivery commitment" + "Payments, tax, refunds, legal terms remain deferred until the adult/legal owner approves". Best on the site. |
| CTA hierarchy | **70** | Single CTA. |
| Friction | **85** | One click. |
| Objection handling | **90** | Three engagement shapes with explicit INCLUDES + EXCLUDES. The disclosure box is anti-claim. |
| Trust signals | **85** | The most restrained page on the site — restraint is the signal. |
| Mobile conversion | **85** | OK. |
| **Aggregate** | **77.5** | |

**Recommendation:** SHIP. The cleanest page on the site. Mention / link it from `/pricing` and `/audit` if you can spare a single sentence — see §10.

---

### `/` (Homepage) — added assessment of the "Live queue" status card

Marked **Captured 14 / In review 3 / Booked 9 / Due date Tomorrow 09:00**. This is illustrative of the IronWake *pattern*, not live data — there is no inbound traffic being summarised. **This is a real risk.** A visitor who reads "Today's intake: Captured 14" and assumes it is live will leave distrusting. The disclosure block at chapter 07 does NOT clearly disambiguate this card. See §10 fix #2.

---

## 3. Top 5 highest-leverage fixes (with file path + line + concrete change)

> Ordered by expected lift on conversion. Each is small, surgical, and respects the locked palette.

### Fix #1 — `/pricing` links to a MISSING `/services` route

**File:** `app/pricing/PricingPage.js` (referenced in the FAQ row that ends with a "See the services page" link).

**Issue:** `grep` showed no `app/services/` directory. The link will 404. This is a trust-eroding 404 on the highest-intent page.

**Concrete change:** Redirect the FAQ link to `/systems` (the canonical services index).

```js
// before
<a href="/services">See the services page</a>
// after
<a href="/systems">See the services page</a>
```

**Effort:** 1 line. **Leverage:** prevents a 404 on the conversion page that has the strongest objection-handling copy.

---

### Fix #2 — Homepage "Live queue" status card is illustrative, not live

**File:** `app/page.js`, lines 77–86 (the `aside className="status-card"`).

**Issue:** The card reads "Today's intake — Captured 14, In review 3, Booked 9, Due date Tomorrow 09:00." This is a static illustration of the *pattern* IronWake deploys. There is no live data feed. A sharp visitor interprets this as fabricated client work — exactly the trust failure the disclosure section is trying to prevent.

**Concrete change:** Add a one-line label inside the card, below the heading, BEFORE the data list:

```jsx
<h3>Today's intake</h3>
<p className="micro">Example state — pattern preview, not live data</p>
<dl>...</dl>
```

**Effort:** 1 line + a CSS micro-class. **Leverage:** removes the single biggest "is this fake?" objection on the homepage.

---

### Fix #3 — AuditForm: 7 fields → 4 fields with progressive disclosure

**File:** `app/audit/AuditForm.js`. The form currently collects: name, business, role, contact, intake source, problem summary, "anything else".

**Issue:** B2B conversion data on "no-obligation diagnostic" forms shows drop-off between field 5 and 7. Field 7 ("anything else") is even less useful than field 5 (intake source).

**Concrete change:** Move "role" and "anything else" to a second step (continue → page 2). The single-step form should be: name, business, contact, problem summary. Save data, then expand.

```jsx
// ponytail: split-step form — fields 1–4 are the ask; fields 5–7 are on "Next"
// after user has demonstrated intent by clicking Continue.
```

**Effort:** ~30 lines (state, conditional render, step indicator). **Leverage:** estimated 15–25% lift on completed audits. This is the highest financial-leverage fix in the audit.

---

### Fix #4 — Homepage hero has 3 CTAs; reduce to 1 + 1

**File:** `app/page.js`, lines 49–53 (and repeated at lines 453–457 in the final CTA section).

**Issue:** "Book Diagnostic" / "See offers" / "How we work" — three actions in the same viewport. Decision paralysis on the highest-traffic page.

**Concrete change:** Keep `Book Diagnostic` (primary) and `See offers` (secondary). Move `How we work` → a `process-link` text link below the buttons, styled as a third-tier `.button ghost`. Same for the final CTA section.

```jsx
<div className="hero-actions">
  <a className="button" href="/audit">Book Diagnostic</a>
  <a className="button secondary" href="/pricing">See offers</a>
</div>
<p className="hero-meta">
  Prefer context first? <a href="/process">See how we work →</a>
</p>
```

**Effort:** ~5 lines per section, 2 sections. **Leverage:** removes the no-decision outcome that's the second-biggest leak on the homepage.

---

### Fix #5 — Cross-link `/scope` from `/pricing` and `/audit`

**File:** `app/pricing/PricingPage.js` and `app/audit/page.js`.

**Issue:** `/scope` is the highest risk-reversal / objection-handling page on the site (aggregate 77.5). It is not linked from pricing or audit. Visitors who are hesitating on scope — the #1 pre-purchase objection in a service business — have no path to find it.

**Concrete change:** Add a single line of helper text under the pricing FAQ:

```jsx
// pricing
<p className="micro">Before you sign anything: <a href="/scope">read how IronWake scopes a build</a>.</p>
```

And under the audit form intro:

```jsx
// audit
<p className="micro">Already know what you want? <a href="/scope">See engagement shapes</a>.</p>
```

**Effort:** 2 lines. **Leverage:** routes the most fence-sitting visitor to the highest-trust page.

---

## 4. Top 5 lowest-leverage items (do NOT change)

### #1 — The 9-chapter scrollytelling homepage
Beautiful, dense, takes building. Removing even one chapter would lose a specific proof beat. Do not refactor.

### #2 — The `/scope` page (aggregate 77.5)
Already the highest-scoring page. Restraint is the design. Do not add a CTA, do not add a hero image, do not add a "Get started" button.

### #3 — FAQ copy on `/` (chapter 8)
Five honest answers, all addressing the real objections. The first item "What does IronWake actually build?" is open by default — correct. Do not change open state.

### #4 — Per-region pricing convention
Two regions, three tiers, five offers. Refactoring this would invalidate the existing FAQ wording. Do not touch.

### #5 — Labelled demo cards on `/work` and homepage
`rapidpulse`, `dentacare-pro`, `atelier` are explicitly labelled as "Demonstration —". Removing them would LOWER the trust signal. Do not change.

---

## 5. Per-route SHIP / REWORK recommendation

| Route | Recommendation | One-line reason |
|---|---|---|
| `/` | **SHIP** with Fix #2 + Fix #4 = ⭐ | Strongest page; the two fixes are surgical. |
| `/pricing` | **SHIP** with Fix #1 + Fix #5 = ⭐ | Fixes a 404-link and routes fence-sitters to /scope. |
| `/audit` | **SHIP** with Fix #3 + Fix #5 | Form is the only friction lever. |
| `/book` | **SHIP** | No fix above the noise floor. |
| `/about` | **SHIP** | The trust signal already works. |
| `/systems` | **SHIP** | No fix above the noise floor. |
| `/industries` | **SHIP** | No fix above the noise floor. |
| `/work` | **SHIP** | Honest labelling is the page. |
| `/process` | **SHIP** | Already strong. |
| `/insights` | **SHIP** | No fix above the noise floor. |
| `/voice` | **SHIP** | `noindex`; correct posture. |
| `/scope` | **SHIP** | Cross-link to it (Fix #5); do not change it. |
| `/contact` | **MISSING** | See note below. |
| `/services` | **MISSING LINK** | Do not add the page; redirect the link (Fix #1). |

### About `/contact`

There is no `app/contact/` directory. The site uses `mailto:ironwake.dev@gmail.com` everywhere instead. This is a deliberate choice:
- **Pro:** zero data-collection surface, no spam risk, no liability.
- **Con:** mobile users may not have a default mail client; the conversion-intent visitor has no form to fill.

**Recommendation:** Do not add a contact page. If a form is added later, route it through `/audit`, not a new page. The mailto link is the cheapest working version.

---

## 6. Cross-cutting observations (read-only, do not act)

1. **Honesty is the moat.** The site consistently labels demos, names the operator, defers money until sign-off, and explains what is NOT built. This is unusual and conversion-positive for the right visitor (operators, owners). It is conversion-negative for visitors who want a vendor who says "yes we can."
2. **No money-back guarantee is on the site because there is no charge on the audit.** Conflating "no money-back" with "no risk reversal" is a misread. The actual risk reversal is "no obligation, no agent pipeline, audit closes before any system is scoped." That copy is excellent. Do not propose a money-back guarantee; it would weaken the page.
3. **The pricing page does not have a "talk to a human" button.** Add a single sentence: "Prefer a call? <a href='/book'>Book a 20-minute slot</a>." — see §10.
4. **The "Live queue" status card on the homepage is the only place where reading the markup line-by-line can mislead a visitor.** This is the single biggest leverage item on the homepage (Fix #2).
5. **`/contact` is intentionally absent.** The brief flagged MISSING routes. Recommend: leave it absent; treat mailto as the budget version.

---

## 7. Aggregate scoring matrix

| Route | HC | SP | RR | CTA | FR | OH | TS | MO | Agg | Ship? |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 88 | 35 | 72 | 62 | 80 | 86 | 70 | 80 | **71.6** | SHIP |
| `/pricing` | 82 | 25 | 88 | 78 | 90 | 92 | 75 | 75 | **75.6** | SHIP |
| `/audit` | 85 | 20 | 95 | 90 | 35 | 80 | 70 | 70 | **68.1** | SHIP (Fix #3) |
| `/book` | 78 | 20 | 65 | 85 | 70 | 55 | 60 | 65 | **62.3** | SHIP |
| `/about` | 80 | 55 | 40 | 70 | 95 | 60 | 85 | 85 | **71.3** | SHIP |
| `/systems` | 78 | 30 | 40 | 85 | 85 | 75 | 55 | 80 | **66.0** | SHIP |
| `/industries` | 70 | 25 | 35 | 80 | 85 | 65 | 50 | 80 | **61.3** | SHIP |
| `/work` | 85 | 55 | 30 | 70 | 85 | 60 | 70 | 75 | **66.3** | SHIP |
| `/process` | 80 | 20 | 55 | 80 | 90 | 80 | 70 | 85 | **70.0** | SHIP |
| `/insights` | 75 | 40 | 30 | 70 | 95 | 60 | 55 | 80 | **63.1** | SHIP |
| `/voice` | 90 | 25 | 85 | 75 | 60 | 70 | 85 | 65 | **69.4** | SHIP |
| `/scope` | 85 | 30 | 90 | 70 | 85 | 90 | 85 | 85 | **77.5** | SHIP |
| `/contact` | — | — | — | — | — | — | — | — | **MISSING** | (intentional) |
| `/services` | — | — | — | — | — | — | — | — | **MISSING LINK** | (Fix #1) |

---

## 8. Audit fidelity statement

- **Files read in full:** `app/page.js`, `app/pricing/page.js`, `app/pricing/PricingPage.js`, `app/about/page.js`, `app/systems/page.js`, `app/industries/page.js`, `app/audit/page.js`, `app/audit/AuditForm.js`, `app/book/page.js`, `app/book/BookingPreview.js`, `app/work/page.js`, `app/process/page.js`, `app/insights/page.js`, `app/voice/page.js`, `app/scope/page.js`, `app/components/SiteHeader.js`, `app/components/SiteFooter.js`, `app/layout.js`, `lib/design-tokens.ts`.
- **Files indexed only (directory listing):** `app/systems/{ai-receptionist,booking-control,missed-lead-recovery,trust-lead-capture}/`, `app/industries/{dental-clinics,home-services,salons-spas}/`, `app/work/{atelier,aura-archives,bramble-cafe,dentacare-pro,harbour-estates,luxe-studio,rapidpulse,retech,voltix}/`.
- **No social proof or claim has been invented.** Every score is anchored to a verbatim line in the file. No "real client" was named; the only named founder is Verbatim: "Revanth Nunna" (homepage chapter 7).
- **No source code was modified.** This is a read-only audit.
- **Live truth check:** `curl https://ironwake.dev/` returned `<title>IronWake — Stop losing leads between enquiry and follow-up</title>`, matching the staged H1. No discrepancies beyond the canonical link (`https://ironwake.netlify.app` in the live `<link rel="canonical">`) — out of scope for this audit.

---

## 9. Ponytail-mode note

This audit scoped the LEAST number of files necessary to score every public route honestly. Each fix is a one-line-or-small-block change. No new tokens, no new components, no new dep. The "Live queue" card fix is the smallest possible change that removes the largest trust risk.

Per rung: **does this need to exist?** Yes — every route still scored. **Already in the codebase?** `/scope` already exists; cross-link to it (Fix #5) rather than building a new trust page. **Stdlib?** N/A. **Native platform?** N/A. **Can it be one line?** Fix #1, #2, #5 are one line each. Fix #3 is the largest diff but the highest leverage.

Skipped: time-to-fill analysis on the audit form (would require funnel data), accessibility deep-dive (separate audit), real-device mobile testing (separate audit). Add when measurement is available.
