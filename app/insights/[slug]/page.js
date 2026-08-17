import Link from 'next/link.js';
import { notFound } from 'next/navigation.js';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
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
    title: 'The difference between a booking request and a confirmed appointment',
    excerpt: 'When your system treats every booking request as a confirmed appointment, you create false expectations. Here is how to separate requests from commitments.',
    category: 'Booking Control',
    date: '2026-07-25',
    body: [
      'A booking request is an intent. A confirmed appointment is a commitment that both sides have agreed to. Treating them as the same thing is the most expensive mistake a service business can make, because it costs you no-shows, double-bookings, and customer trust.',
      'The clean separation is: a request becomes a confirmed appointment only after the provider accepts the time and the customer receives a written acknowledgement. Until then, the slot is held in a tentative state and no other booking may claim it.',
      'Build the system so the request state and the confirmed state are visibly different on the calendar, in the CRM, and in the customer confirmation. If your team has to remember to make the distinction, the distinction is not real.'
    ]
  },
  {
    slug: 'follow-up-ownership-service-businesses',
    title: 'Why shared inboxes kill follow-up discipline',
    excerpt: 'When everyone owns the follow-up, nobody owns it. Named ownership with visible next actions is the simplest fix for follow-up failure.',
    category: 'Follow-up',
    date: '2026-07-18',
    body: [
      'A shared inbox is the most common way a service business destroys its own follow-up. The logic sounds reasonable: anyone in the team can see what is waiting and pick it up. In practice, everyone waits for someone else to pick it up.',
      'The fix is named ownership per enquiry, not per inbox. Every incoming request is assigned to one human (or one named role) for the next step. The next step has a due time. If the due time passes, the request escalates to a backup owner automatically.',
      'This sounds like overhead. It is not. The time saved by never chasing the same enquiry twice is larger than the time spent on the initial assignment.'
    ]
  },
  {
    slug: 'ai-receptionist-honest-assessment',
    title: 'AI receptionist: an honest assessment of what works and what does not',
    excerpt: 'AI receptionists can handle routine intake and qualification. They cannot replace human judgment for complex, sensitive, or high-value situations. Here is the current state.',
    category: 'AI Systems',
    date: '2026-07-10',
    body: [
      'An AI receptionist is a first-response system, not a sales closer. It can take a message, capture a name, qualify a basic request, and route the conversation to a human. What it cannot do is make a judgment call on an angry customer, a complex service question, or a high-value negotiation.',
      'The honest assessment: deploy an AI receptionist for intake and triage, never as the only responder. Build it so it always offers a human handoff. Record every conversation for review. Disclose that it is automated at the start, not after the customer asks.',
      'Any vendor that promises an AI receptionist will close deals for you is selling a fiction. Use the AI for what it is good at: capturing the next step and routing it to the right human quickly.'
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
    openGraph: {
      title: `${article.title} — IronWake`,
      description: article.excerpt,
      type: 'article',
      url: './',
      siteName: 'IronWake',
      images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: article.title }]
    }
  };
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Insight not found" };
  return {
    title: article.title + " — IronWake",
    description: article.excerpt,
    alternates: { canonical: canonicalUrl("/insights/" + slug) },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: canonicalUrl("/insights/" + slug),
      publishedTime: article.date,
    },
  };
}

export default function InsightArticlePage({ params }) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
              { name: "Article", path: "/insights/[slug]" },
        ])) }} />

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
  </main>;
}
