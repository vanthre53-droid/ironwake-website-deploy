# Current Mess Recovery — 2026-08-08

## Git
- HEAD: `6a9c74c` (deploy: add @netlify/plugin-nextjs)
- Branch: master
- Worktree: 11 untracked files (evidence/reports/.netlify cache), 0 modified tracked

## Netlify deployment truth
- Token: `nfp_RBTFCod2rbo1Ae8S8itxSFpRqGCrGNsBbfb6` (provided by owner)
- Site ID: `dbc60402-b4ac-42d1-b8aa-9d331cf01cfa` (the new account — different from original 4643d967)
- Production URL: **https://lucent-sunflower-966982.netlify.app** (this is where the current repo deploys)
- Original URL `https://ironwake-app.netlify.app` is on a separate account with token the owner does not currently have
- Last deploy: 6a9c74c succeeded with @netlify/plugin-nextjs (2m24s build)

## Live route smoke (just now)
| Route | Status |
|---|---|
| / | 200 |
| /work | 200 |
| /pricing | 200 |
| /owner | 200 |
| /admin | 200 |
| /audit | 200 |
| /insights | 200 |
| /sitemap.xml | 200 |

All public + private routes serve.

## Deployed visual baseline (just now from browser vision)
- Background: light cream/ivory ✓ (correct visual family)
- Headlines: editorial serif (Newsreader) ✓
- Nav: sticky glass with 8 links + CTA
- Hero: 3-step animated workflow (Enquiry → Owner → Next action)
- Dashboard demo: 4 synthetic records with interactive list (ASSIGN OWNER / MARK COMPLETE buttons)
- All sections rendered with proper hierarchy
- No console errors visible

## Gates per goal §1 — current honest status
| Gate | Status |
|---|---|
| DEPLOYMENT_GATE | PASS (routes 200, plugin works) |
| DESIGN_GATE | PARTIAL (light + editorial yes; lacks 2D/2.5D operating system visualization) |
| READABILITY_GATE | NEEDS VERIFICATION (hero serif good; need to confirm mobile body >=16px) |
| NAVIGATION_GATE | PARTIAL (8 links + CTA visible; mobile menu unverified) |
| COPY_GATE | PARTIAL (mostly buyer-language; some defensive wording remains) |
| PSYCHOLOGY_GATE | NOT_VERIFIED |
| MOTION_GATE | FAILED (MotionReveal + small WorkflowDemo only; needs 3 substantial motion systems) |
| PRICING_GATE | NEEDS DEEP CHECK (5 offers present per snapshot, must verify values match spec) |
| CHATBOT_GATE | FAILED_UNTIL_PROVEN (button present, behavior not verified) |
| SUPABASE_GATE | CONNECTED_BUT_MUST_BE_VERIFIED |
| OWNER_AUTH_GATE | FAILED_UNTIL_PROVEN |
| CRM_GATE | FAILED_UNTIL_PROVEN |
| BOOKING_GATE | FAILED_UNTIL_PROVEN |
| PORTFOLIO_GATE | PARTIAL (9 case study pages, but no screenshots/diagrams) |
| SEO_GATE | PARTIAL (sitemap works, schema present) |
| RESEARCH_GATE | OPEN |
| COMPETITOR_GATE | OPEN |
| OWNER_APPROVAL_GATE | OPEN |

## Highest-value P0 issues to attack
1. Substantial deployed motion (goal §18) — hero Wake, interactive journey, owner ops demo
2. Verify pricing matches exact spec values across homepage, /pricing, systems, chatbot, FAQ
3. Verify Supabase connection works on deployed site (POST /api/audit actually inserts)
4. Verify anonymous /owner is denied
5. Test chatbot end-to-end with pricing questions
6. Verify mobile rendering at 390px and 360px

## Programme state
PROGRAMME_STATUS = RUNNING
OWNER_ACCEPTANCE = REJECTED (new goal)
FALSE_COMPLETION_HISTORY = TRUE
