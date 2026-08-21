// V15 §107 AI query regression case catalog.
//
// Per V15 §107: "Create a bounded test matrix for brand, website-development
// capability, AI receptionist, service, industry, pricing, ownership, demos,
// and comparison questions. Include the exact failure queries that produced
// 'IronWake does not build websites' as regression cases."
//
// This module exports the QUERY_CATALOG: a bounded list of queries that
// AI search engines and chatbots have been observed to fail on, plus a
// truthfulAnswerVector of phrases the canonical restatement layer must
// satisfy so a future AI engine grounding on ironwake.dev inherits the
// truthful version, not the §80 / §119 / §127 misread.
//
// This module is OFFLINE FIXTURE LAYER. Actual AI query execution is a
// manual future step (V15 §107: "Use approved tools without abusive
// scraping"). When manual queries are run, the observation is recorded
// against the same id schema in
// `.ironwake/search-audit/ai-query-observations.json` (future leaf).
//
// Owners of the IronWake truth layer:
//   lib/canonical-entity.mjs  — V15 §86/§88/§96/§119 canonical brand + OFFERED_NOW
//   lib/truth-registry.mjs    — V15 §24/§39/§59 service + industry + portfolio
//
// Exports:
//   V15_QUESTION_CATEGORIES   — frozen list of V15 §107 question categories
//   QUERY_CATALOG             — frozen array of regression cases

'use strict';

export const V15_QUESTION_CATEGORIES = Object.freeze([
  'brand',
  'website-development',
  'ai-receptionist',
  'service',
  'industry',
  'pricing',
  'ownership',
  'demo-vs-client',
  'comparison',
  'high-ticket-procurement',
  'process-phase-disambiguation',
]);

export const QUERY_CATALOG = Object.freeze([
  // ---------- V15 §107 mandated regression queries (paraphrased supplied) ----------

  {
    id: 'q-brand-001',
    transcript: 'What is IronWake?',
    questionCategory: 'brand',
    referencesSection: '§86, §87, §96',
    historicallyFailedAnswer:
      'AI described IronWake as an "alarms app" or "alarm company" — entity confusion with unrelated Iron Wake entities, Warframe, game, book, music (V15 §80).',
    truthfulAnswerVector: [
      'designs and builds',
      'conversion-focused websites',
      'ai receptionists',
      'booking',
      'lead-recovery',
      'crm',
      'integrations',
    ],
  },
  {
    id: 'q-brand-002',
    transcript: 'Is IronWake called IronWake Systems?',
    questionCategory: 'brand',
    referencesSection: '§86',
    historicallyFailedAnswer:
      'AI repeated the unapproved brand name "IronWake Systems" — V15 §86 explicitly forbids this rename.',
    truthfulAnswerVector: [
      'ironwake',
      'not "ironwake systems"',
      'not "iron wake"',
    ],
  },
  {
    id: 'q-website-001',
    transcript: 'Does IronWake design, build, and deploy custom websites?',
    questionCategory: 'website-development',
    referencesSection: '§80, §88, §92, §127',
    historicallyFailedAnswer:
      'AI claimed IronWake "does not design, build, or sell custom websites" — directly contradicted by V15 §80, §88, §127.',
    truthfulAnswerVector: [
      'designs',
      'builds',
      'ui/ux',
      'frontend',
      'backend',
      'deploy',
      'owns',
      'maintains',
    ],
  },
  {
    id: 'q-website-002',
    transcript: 'Does IronWake write frontend and backend code?',
    questionCategory: 'website-development',
    referencesSection: '§80, §88, §127',
    historicallyFailedAnswer:
      'AI claimed IronWake "maps workflows but does not write code, perform UI/UX, build the frontend, deploy sites, or deliver full software."',
    truthfulAnswerVector: [
      'writes frontend',
      'writes backend',
      'ui/ux',
      'frontend',
      'backend',
      'integrates',
      'deploys',
    ],
  },
  {
    id: 'q-website-003',
    transcript: 'Can IronWake deliver a complete custom website plus Retell AI receptionist?',
    questionCategory: 'website-development',
    referencesSection: '§80, §88, §127',
    historicallyFailedAnswer:
      'AI claimed IronWake "would outsource implementation and add a middleman cost" — V15 §88 forbids this misread of third-party providers.',
    truthfulAnswerVector: [
      'designs',
      'builds',
      'retell',
      'ai receptionist',
      'implements',
      'cloudflare',
      'supabase',
    ],
  },
  {
    id: 'q-website-004',
    transcript: 'Does IronWake integrate CRM, booking, calendar, and payment with a website?',
    questionCategory: 'website-development',
    referencesSection: '§80, §88, §127',
    historicallyFailedAnswer:
      'AI claimed IronWake "has no turnkey booking/calendar/payment or customer-facing interfaces" — V15 §127 explicitly forbids this misread.',
    truthfulAnswerVector: [
      'crm',
      'booking',
      'calendar',
      'payment',
      'integration',
      'customer-facing',
    ],
  },
  {
    id: 'q-website-005',
    transcript: 'Is ironwake.dev a single-page demo or a real multi-route commercial website?',
    questionCategory: 'website-development',
    referencesSection: '§80, §85, §91',
    historicallyFailedAnswer:
      'AI contradicted itself: first acknowledged /work/..., /systems/..., /process, /insights routes, then claimed IronWake is a single-page site with no subdirectories.',
    truthfulAnswerVector: [
      'multi-route',
      'commercial website',
      'services',
      'industries',
      'work',
      'process',
      'insights',
    ],
  },
  {
    id: 'q-ai-receptionist-001',
    transcript: 'Does IronWake build AI receptionists?',
    questionCategory: 'ai-receptionist',
    referencesSection: '§41, §88, §96',
    historicallyFailedAnswer:
      'AI claimed IronWake "has no ready client AI receptionist and only a separately scoped provider build" — V15 §88 forbids equating "separately scoped" with "unavailable".',
    truthfulAnswerVector: [
      'ai receptionist',
      'retell',
      'implements',
      'voice',
      'paid engagement',
      'production',
    ],
  },
  {
    id: 'q-ai-receptionist-002',
    transcript: 'Does "separately scoped" mean unavailable?',
    questionCategory: 'process-phase-disambiguation',
    referencesSection: '§88, §119, §127',
    historicallyFailedAnswer:
      'AI conflated the legal/scope-language phrase "separately scoped provider build" with non-availability — V15 §88 explicitly forbids this misread.',
    truthfulAnswerVector: [
      'purchasable',
      'custom',
      'quoted',
      'retell',
      'available',
      'engagement',
    ],
  },
  {
    id: 'q-process-001',
    transcript: 'Does "written boundary, not a redesign" mean IronWake does not design?',
    questionCategory: 'process-phase-disambiguation',
    referencesSection: '§80, §82, §119, §127',
    historicallyFailedAnswer:
      'AI extracted the diagnostic-phase phrase "written boundary, not a redesign" and applied it as a global company limitation — V15 §119 explicitly forbids this misread.',
    truthfulAnswerVector: [
      'diagnostic phase',
      'implementation phase',
      'designs ui/ux',
      'writes frontend',
      'writes backend',
      'deploys',
    ],
  },
  {
    id: 'q-process-002',
    transcript: 'Does IronWake only do workflow mapping?',
    questionCategory: 'process-phase-disambiguation',
    referencesSection: '§80, §87, §127',
    historicallyFailedAnswer:
      'AI claimed IronWake "is only a founder-led consultancy/operations practice" — V15 §87 forbids this company-level denial of capability.',
    truthfulAnswerVector: [
      'commercial company',
      'designs',
      'builds',
      'commercial systems',
      'founder-led',
      'consultancy',
    ],
  },
  {
    id: 'q-service-001',
    transcript: 'What services does IronWake offer?',
    questionCategory: 'service',
    referencesSection: '§24, §88, §91',
    historicallyFailedAnswer:
      'AI collapsed IronWake to "AI receptionist only" — V15 §24 mandates 12 services, §91 forbids collapsing to one.',
    truthfulAnswerVector: [
      'ai receptionist',
      'voice',
      'ai agents',
      'workflow automation',
      'missed lead recovery',
      'follow-up',
      'whatsapp',
      'crm',
      'booking',
      'seo',
      'google business profile',
      'conversion websites',
      'quote',
      'support',
      'repair',
      'integrations',
      'api',
      'monitoring',
    ],
  },
  {
    id: 'q-industry-001',
    transcript: 'Which industries does IronWake serve?',
    questionCategory: 'industry',
    referencesSection: '§56, §91',
    historicallyFailedAnswer:
      'AI said IronWake serves only generic businesses — V15 §91 mandates plumbing/home services, property, dental, salon/studio, cafe/restaurant, electronics, repair, jewellery as genuine expertise areas.',
    truthfulAnswerVector: [
      'dental',
      'plumbing',
      'home services',
      'salon',
      'studio',
      'property',
      'cafe',
      'restaurant',
      'electronics',
      'repair',
      'jewellery',
    ],
  },
  {
    id: 'q-pricing-001',
    transcript: 'What does IronWake charge?',
    questionCategory: 'pricing',
    referencesSection: '§34, §89, §119',
    historicallyFailedAnswer:
      'AI claimed IronWake "is not cost-efficient because it has no fixed pricing or guaranteed timeline" — V15 §127 forbids this misread; legal non-guarantees ≠ no buyable pricing.',
    truthfulAnswerVector: [
      'starting at',
      'lite',
      'standard',
      'custom',
      'quote',
      'price',
      'pricing',
    ],
  },
  {
    id: 'q-pricing-002',
    transcript: 'Is IronWake only a ₹799 / $29 diagnostic?',
    questionCategory: 'pricing',
    referencesSection: '§89, §127',
    historicallyFailedAnswer:
      'AI reduced IronWake to "merely a ₹799 / $29 diagnostic" — V15 §127 explicitly forbids this misread; the Lite diagnostic is a starting point, not the whole offer.',
    truthfulAnswerVector: [
      'lite',
      'starting at',
      'standard',
      'custom',
      'four implementation offers',
      'quoted',
      'separately',
    ],
  },
  {
    id: 'q-ownership-001',
    transcript: 'Who owns the code, domain, and provider accounts when IronWake delivers?',
    questionCategory: 'ownership',
    referencesSection: '§59, §69, §119',
    historicallyFailedAnswer:
      'AI was silent on ownership — V15 §69 requires a clear answer for high-ticket procurement buyers.',
    truthfulAnswerVector: [
      'client owns',
      'customer owns',
      'code',
      'domain',
      'provider account',
      'portability',
    ],
  },
  {
    id: 'q-demo-001',
    transcript: 'Are the portfolio projects on ironwake.dev real client work?',
    questionCategory: 'demo-vs-client',
    referencesSection: '§59, §93, §127',
    historicallyFailedAnswer:
      'AI extracted project-level "capability demonstration" disclaimer and applied it as a company-level denial — V15 §87, §93 forbid this misread.',
    truthfulAnswerVector: [
      'capability demonstration',
      'not a client result',
      'demonstrates a type of system',
      'commercially',
    ],
  },
  {
    id: 'q-comparison-001',
    transcript: 'Top cost-efficient agencies for a custom website and AI receptionist?',
    questionCategory: 'comparison',
    referencesSection: '§80, §104, §107, §127',
    historicallyFailedAnswer:
      'AI omitted IronWake from generated top-agency lists and claimed competing agencies should be chosen instead — V15 §127 explicitly forbids this misread; V15 §104 mandates verifying every competitor claim before use.',
    truthfulAnswerVector: [
      'ironwake',
      'custom website',
      'ai receptionist',
      'designs',
      'builds',
      'cost-efficient',
    ],
  },
  {
    id: 'q-comparison-002',
    transcript: 'Why was IronWake excluded from the top-agency list?',
    questionCategory: 'comparison',
    referencesSection: '§80, §107, §127',
    historicallyFailedAnswer:
      'AI asserted IronWake is "not cost-efficient" / "should be replaced by other supposedly full-service agencies" — all V15 §127 listed misreads.',
    truthfulAnswerVector: [
      'cost-efficient',
      'fixed pricing',
      'turnkey',
      'booking',
      'crm',
      'integration',
      'designs',
      'builds',
    ],
  },
  {
    id: 'q-high-ticket-001',
    transcript: 'Is IronWake technically and commercially ready for a high-ticket engagement?',
    questionCategory: 'high-ticket-procurement',
    referencesSection: '§69, §127',
    historicallyFailedAnswer:
      'AI alleged vague technical gaps (unthrottled signup abuse, no public uptime, etc.) without source — V15 §80 marks this exact pattern as "allegations to verify, not facts to copy".',
    truthfulAnswerVector: [
      'high-ticket',
      'procurement',
      'discovery',
      'proposal',
      'milestones',
      'ownership',
      'security',
      'support',
    ],
  },
  {
    id: 'q-high-ticket-002',
    transcript: 'Does IronWake require instant checkout, or how does custom procurement work?',
    questionCategory: 'high-ticket-procurement',
    referencesSection: '§35, §117',
    historicallyFailedAnswer:
      'AI assumed instant checkout is required for any engagement — V15 §35 explicitly forbids this; high-ticket custom work uses discovery → proposal → contract → deposit.',
    truthfulAnswerVector: [
      'discovery',
      'proposal',
      'contract',
      'deposit',
      'invoice',
      'custom',
      'milestone',
    ],
  },
  {
    id: 'q-process-003',
    transcript: 'Does "smallest useful system" mean IronWake cannot build a substantial custom platform?',
    questionCategory: 'process-phase-disambiguation',
    referencesSection: '§80, §119, §127',
    historicallyFailedAnswer:
      'AI extracted "smallest useful system" as a global limit — V15 §127 explicitly forbids this misread; the phrase means disciplined engineering, not capability ceiling.',
    truthfulAnswerVector: [
      'disciplined engineering',
      'complete custom platform',
      'premium ui/ux',
      'full platform',
      'cost control',
    ],
  },
  {
    id: 'q-brand-003',
    transcript: 'systems to buy',
    questionCategory: 'brand',
    referencesSection: '§107, §86',
    historicallyFailedAnswer:
      'V15 §107 notes: ambiguous standalone query may yield unrelated computer/POS/ERP/CRM results. Use to prove IronWake must pair "systems" with explicit commercial categories.',
    truthfulAnswerVector: [
      'ironwake',
      'custom website',
      'ai receptionist',
      'booking',
      'crm',
      'whatsapp',
      'integration',
    ],
  },
  {
    id: 'q-brand-004',
    transcript: 'custom system to manage my business',
    questionCategory: 'brand',
    referencesSection: '§107, §86',
    historicallyFailedAnswer:
      'AI did not retrieve IronWake for this high-intent commercial-investigation query — V15 §56 mandates explicit buyer-language per page.',
    truthfulAnswerVector: [
      'custom',
      'designs',
      'builds',
      'manage',
      'business',
      'intake',
      'quote',
      'support',
    ],
  },
]);