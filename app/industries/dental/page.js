import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
import { RoiCalculator } from './RoiCalculator';

// ponytail: per-vertical landing page for dental practices.
// - Server component (no client work; the calculator is the only client island).
// - Uses existing portfolio proof (DentaCare Pro) as a capability demonstration,
//   not as a real client result. The page itself does not claim to be a
//   clinical, diagnostic, or compliance service, and does not name a specific
//   regulator (e.g. HIPAA, NHS, AHPRA).
// - Hero and supporting copy use directionally truthful framing ("a working
//   front desk cannot answer two calls at once") instead of fabricated
//   per-cent call-loss statistics.

export const metadata = {
  title: 'AI Receptionist for Dental Practices — IronWake',
  description:
    'Front-desk call recovery for dental and private-clinic practices. Plan a 24/7 AI receptionist that answers, captures, and routes inbound enquiries — paired with an intake-style demonstration.',
  openGraph: {
    title: 'AI Receptionist for Dental Practices — IronWake',
    description:
      'Front-desk call recovery, intake-style first-touch ownership, and an interactive recovery calculator. Not a clinical, diagnostic, or compliance service.',
    type: 'website',
    url: './',
    images: [
      {
        url: '/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'IronWake — AI receptionist planning for dental practices',
      },
    ],
  },
  alternates: { canonical: canonicalUrl('/industries/dental') },
};

const leaks = [
  [
    '01 / during procedures',
    'Calls during an active procedure',
    'A dentist or hygienist in the operatory cannot answer the phone. The front desk is checking out one patient while another is mid-treatment. The call rings out, the caller books the next practice down the road, and the original practice finds out only when the diary is quiet.',
  ],
  [
    '02 / lunch + late afternoons',
    'Calls when the desk is closed',
    'Lunch cover, late-afternoon admin, and after-hours voicemails are where new-patient enquiries silently disappear. A recorded greeting that says "leave a message" returns a callback rate below single digits.',
  ],
  [
    '03 / overflow + multi-line',
    'Simultaneous inbound lines',
    'A working front desk can answer one call at a time. Two lines ringing at once means a second caller is silently dropped, with no record of who they were or what they wanted.',
  ],
];

const receptionistFeatures = [
  [
    '24/7 inbound call coverage',
    'After-hours, weekends, and during procedures — the receptionist picks up every line, identifies the call type, and either takes a structured message or transfers to the on-call owner.',
  ],
  [
    'Symptom-banded intake',
    'The caller hears the same short triage a front desk would ask — reason for visit, urgency band, preferred slot — and is routed to the correct follow-up channel without a long form on the website.',
  ],
  [
    'Named first-touch ownership',
    'Every recovered enquiry is logged with the front-desk owner of the day and a first-response clock. Stale enquiries surface before the caller has booked elsewhere.',
  ],
  [
    'WhatsApp + email handoff',
    'When the caller prefers text, the receptionist hands off to WhatsApp or email with the same context intact. Nothing is retyped at the desk.',
  ],
  [
    'Truthful requested vs confirmed',
    'A recovered call becomes a booking request, not a confirmed appointment, until a named human confirms the slot. The diary never shows a "yes" that has not actually happened.',
  ],
  [
    'Plan only — no live clinical connection',
    'IronWake plans and integrates the receptionist alongside your existing phone, calendar, and CRM. The build itself is non-clinical; patient records and clinical decisions remain your responsibility.',
  ],
];

const capabilities = [
  [
    'Phone triage scripts',
    'Tone, terminology, and routing rules written for a dental front desk — new-patient, emergency, recall, insurance, billing.',
  ],
  [
    'Recall and reactivation flows',
    'After-hours recall prompts sent to lapsed patients with a booking link, scoped to the practice\'s consent rules.',
  ],
  [
    'Multi-line overflow handling',
    'When two callers hit the desk at once, the second caller is captured by the receptionist instead of dropped silently.',
  ],
  [
    'Owner notification',
    'The named front-desk owner is notified per call, with the transcript, the call type, and the next action.',
  ],
];

const faqs = [
  {
    question: 'Is this a clinical service or a clinical decision support tool?',
    answer:
      'No. IronWake plans and integrates an AI receptionist for the administrative front desk only. Clinical advice, triage decisions, treatment planning, and patient-record management remain the practice\'s responsibility and are explicitly out of scope.',
  },
  {
    question: 'Will the receptionist be HIPAA / NHS / AHPRA compliant on day one?',
    answer:
      'Not by default. Compliance with the regulator relevant to your jurisdiction is a separately scoped engagement that we review alongside your existing privacy, consent, and data-residency posture. The planning page lists the questions we ask before any deployment.',
  },
  {
    question: 'How is the receptionist different from a generic AI phone bot?',
    answer:
      'The receptionist is scoped to a single practice: the phone tree, the symptom bands, the booking handoff, and the named owner are all configured for that practice. It is not a shared agent answering for hundreds of unrelated businesses.',
  },
  {
    question: 'What happens when the receptionist cannot answer?',
    answer:
      'It logs the call, captures the intent, notifies the named owner, and hands off via WhatsApp or email. There is no silent drop and no fabricated confirmation.',
  },
  {
    question: 'Can I see what the intake looks like before committing?',
    answer:
      'Yes. The DentaCare Intake demonstration models the same intake flow the receptionist would generate, against a private-clinic context, with no clinical claim implied.',
  },
];

export default function DentalIndustryPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <main className="shell dental-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
        { name: 'Dental', path: '/industries/dental' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SiteHeader />

      <section className="hero compact dental-hero">
        <span className="eyebrow">Industries / Dental &amp; Private Clinics</span>
        <h1>An AI receptionist for the dental front desk that is already in the operatory.</h1>
        <p>
          Dental practices lose new-patient enquiries every day — during procedures, on lunch cover, and
          when a second line rings while the desk is already on a call. IronWake plans a 24/7 receptionist
          that answers every line, captures the call type, and hands it to a named front-desk owner with a
          first-response clock running. Pair it with an interactive recovery calculator and a portfolio
          demonstration of the underlying intake flow.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#roi">Run the recovery calculator</a>
          <a className="button ghost" href="/systems/ai-receptionist">Read the AI receptionist system</a>
        </div>
        <p className="dental-hero__caveat">
          Front-desk and intake operations only. Not a clinical, diagnostic, or compliance service.
        </p>
      </section>

      <MotionReveal>
        <section className="section intro">
          <span className="eyebrow">Where the leak usually is</span>
          <h2>Three moments a new-patient enquiry disappears.</h2>
          <p className="dental-section-lede">
            None of these are about the dentist being slow or the marketing being weak. They are about
            the shape of a working front desk — which can only be in one place at a time.
          </p>
          <div className="industry-grid">
            {leaks.map(([label, title, text]) => (
              <article className="industry-card" key={title}>
                <span className="micro">{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">What the receptionist actually does</span>
          <h2>Six behaviours a dental front desk can hand off without losing ownership.</h2>
          <div className="dental-feature-grid">
            {receptionistFeatures.map(([title, text]) => (
              <article className="dental-feature" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" id="roi">
          <span className="eyebrow">Plan, do not promise</span>
          <h2>Model the recovered value with your own numbers.</h2>
          <p className="dental-section-lede">
            The calculator below is a planning tool, not a forecast. Adjust the inputs to match how
            your practice actually runs today. Every output is built from the inputs you typed — there
            are no external "industry benchmark" rates hidden in the math.
          </p>
          <RoiCalculator />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">Build scope</span>
          <h2>What gets configured when the receptionist goes live.</h2>
          <div className="industry-grid">
            {capabilities.map(([title, text]) => (
              <article className="industry-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section disclosure">
          <div>
            <span className="eyebrow">Existing portfolio demonstration</span>
            <h3>DentaCare Intake — the receptionist flow, in portfolio form.</h3>
            <p>
              The DentaCare Intake case study is a designed scenario of a private-clinic front-desk
              intake. It is what the AI receptionist produces when a caller reaches a dental practice
              through the system — a symptom band, a contact detail, and a named front-desk owner with
              a first-response clock. It is not a real client, a real result, or a clinical record.
            </p>
          </div>
          <div className="disclosure-box">
            Demonstration only. No live clinical or patient-record integration. No compliance claim.
            <br />
            <br />
            <a href="/work/dentacare-pro">View the DentaCare Intake demonstration →</a>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">Dental practices — frequently asked</span>
          <h2>Five questions we answer before a build starts.</h2>
          <div className="faq-grid">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">Next step</span>
          <h2>Have your own front-desk pattern reviewed.</h2>
          <p className="dental-section-lede">
            A Business Leak Audit is a written review of your enquiry, booking, and follow-up flow.
            For a dental practice it covers the phone tree, the after-hours pattern, the WhatsApp and
            email intake, and the named ownership on the desk. It does not touch the clinical record.
          </p>
          <div className="hero-actions">
            <a className="button" href="/audit">Request a Business Leak Audit</a>
            <a className="button ghost" href="/systems/ai-receptionist">AI receptionist system</a>
            <a className="button ghost" href="/pricing">View pricing</a>
          </div>
        </section>
      </MotionReveal>
    </main>
  );
}