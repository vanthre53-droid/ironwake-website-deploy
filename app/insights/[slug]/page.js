import { notFound } from 'next/navigation.js';
import Link from 'next/link.js';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
// ponytail: insight articles live in a single source-of-truth array. The
// detail page is generated for every slug; unknown slugs return 404 so
// search engines never index dead links.
const ARTICLES = [
  {
    slug: 'missed-lead-recovery-service-businesses',
    title: 'Where service businesses typically lose enquiries before follow-up',
    excerpt: 'Operational gaps between the first enquiry and the first response are the usual suspect. Here are the most common patterns and how to identify which one applies to your business.',
    category: 'Lead Recovery',
    date: '2026-08-01',
    body: [
      'The most common place a service business loses an enquiry is between the moment it arrives and the moment someone takes named ownership of the next step. The enquiry is not lost in a technical sense — it sits in an inbox, a CRM, a phone voicemail — but no-one can prove who is responsible for what happens next.',
      'Three patterns cover most cases. Pattern one: the enquiry arrives but the team assumes someone else will follow up. Pattern two: a follow-up is started but never closed, so the customer waits and stops responding. Pattern three: the enquiry is logged but the team forgets the due time and the conversation cools.',
      'The fix is not a new tool. The fix is a single named owner per enquiry, a single visible next action, and a single due time. If your process has all three, the leak closes. If it is missing any one of them, the leak stays open.'
    ]
  },
  {
    slug: 'booking-confirmation-vs-booking-request',
    title: 'Booking certainty without presumption: separating a request from an appointment',
    excerpt: 'Most "no-show" and "I thought they confirmed" arguments are about presuming state. The fix is to make a request and a confirmed appointment visually and procedurally distinct.',
    category: 'Booking Control',
    date: '2026-08-05',
    body: [
      'A booking request is a request. A confirmed appointment is an explicit two-sided agreement with a named time, a named service, a named person on both sides, and a single shared reference. The two should never be conflated.',
      'When a system conflates them, the team assumes the calendar is the source of truth. When the customer assumes the request itself was the confirmation, both sides lose. The cure is one visible status field on the appointment record: REQUESTED, CONFIRMED, COMPLETED, or LOST. No other states.',
      'Once the status field is shared, the conversation changes. The team stops asking "did they confirm?" and the customer stops asking "is my slot held?" The shared reference becomes the place to look, not memory.'
    ]
  },
  {
    slug: 'follow-up-ownership-service-businesses',
    title: 'Follow-up discipline without burning out the team',
    excerpt: 'Disciplined follow-up is not "more messages". It is one named owner per enquiry, one due time per stage, and one visible next action per record.',
    category: 'Operations',
    date: '2026-08-10',
    body: [
      'The mistake most teams make is to add a follow-up cadence without changing ownership. The cadence fires, the messages go out, but no named human is responsible for what happens next. Burnout follows.',
      'The disciplined version has one named owner per enquiry, one due time per stage of the conversation, and one visible next action per record. The owner can be the same person for many enquiries, but they cannot be the same person for many enquiries where the next action is hidden from everyone else.',
      'In practice this means a single page — not a CRM, not a dashboard, not a calendar — that lists every enquiry, every owner, every stage, every due time, and every next action. That single page is the only thing that has to be true.'
    ]
  },
  {
    slug: 'ai-receptionist-honest-assessment',
    title: 'AI receptionist: an honest assessment for service businesses',
    excerpt: 'An AI receptionist is a disclosed automated first responder, not a person. It earns trust by what it commits to, not by what it pretends to be.',
    category: 'AI Receptionist',
    date: '2026-08-12',
    body: [
      'An AI receptionist is a software process. It speaks, it captures structured information, it books meetings where the team has decided it may, and it hands off to a named human when the request is outside its mandate. It does not feel emotions. It does not think. It is a deterministic script trained on the business\'s own intake questions.',
      'For a service business, the honest question is not whether an AI receptionist sounds human. The honest question is whether it answers the calls the team would otherwise miss, captures the information the team would otherwise forget, and hands off to the team without misrepresenting either side. If it does those three things, it earns its place.',
      'If it does not — if it hallucinates prices, books meetings without permission, or pretends to be a person — it erodes trust faster than a missed call would. The whole point of the system is that the customer knows who or what they are talking to at every step.'
    ]
  }
];

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Insight not found — IronWake', robots: { index: false, follow: false } };
  return {
    title: `${article.title} — IronWake`,
    description: article.excerpt,
    alternates: { canonical: canonicalUrl(`/insights/${params.slug}`) },
    openGraph: {
      title: `${article.title} — IronWake`,
      description: article.excerpt,
      type: 'article',
      url: canonicalUrl(`/insights/${params.slug}`),
      siteName: 'IronWake',
      images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: article.title }]
    }
  };
}

export default function InsightArticlePage({ params }) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/insights' },
        { name: 'Article', path: '/insights/[slug]' },
      ])) }} />
      <main className="shell">
        <SiteHeader />
        <section className="hero compact">
          <span className="eyebrow">{article.category} · {article.date}</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </section>
        <article className="section insight-article">
          {article.body.map((p, idx) => <p key={idx}>{p}</p>)}
        </article>
        <section className="section">
          <span className="eyebrow">Next step</span>
          <h2>Want this analysis applied to your business?</h2>
          <div className="hero-actions">
            <a className="button" href="/audit">Request a Business Leak Audit</a>
            <Link className="button secondary" href="/insights">All insights</Link>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}