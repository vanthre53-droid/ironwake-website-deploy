import Link from 'next/link.js';
import { SiteHeader } from '../components/SiteHeader';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Insights — IronWake',
  description: 'Operational insights for service businesses: lead recovery, booking control, follow-up automation, and workflow improvement.',
  alternates: { canonical: canonicalUrl("/insights") },
};

const articles = [
  {
    slug: 'missed-lead-recovery-service-businesses',
    title: 'Where service businesses typically lose enquiries before follow-up',
    excerpt: 'Operational gaps between the first enquiry and the first response are the usual suspect. Here are the most common patterns and how to identify which one applies to your business.',
    category: 'Lead Recovery',
    date: '2026-08-01',
  },
  {
    slug: 'booking-confirmation-vs-booking-request',
    title: 'The difference between a booking request and a confirmed appointment',
    excerpt: 'When your system treats every booking request as a confirmed appointment, you create false expectations. Here is how to separate requests from commitments.',
    category: 'Booking Control',
    date: '2026-07-25',
  },
  {
    slug: 'follow-up-ownership-service-businesses',
    title: 'Why shared inboxes kill follow-up discipline',
    excerpt: 'When everyone owns the follow-up, nobody owns it. Named ownership with visible next actions is the simplest fix for follow-up failure.',
    category: 'Follow-up',
    date: '2026-07-18',
  },
  {
    slug: 'ai-receptionist-honest-assessment',
    title: 'AI receptionist: an honest assessment of what works and what does not',
    excerpt: 'AI receptionists can handle routine intake and qualification. They cannot replace human judgment for complex, sensitive, or high-value situations. Here is the current state.',
    category: 'AI Systems',
    date: '2026-07-10',
  },
];

export default function InsightsPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Insights</span>
      <h1>Operational thinking for service businesses.</h1>
      <p className="reading-width">Practical insights on lead recovery, booking control, follow-up automation, and workflow improvement. No hype, no vague promises — just what works and what does not.</p>
    </section>

    <section className="section intro">
      <div className="grid-3 insights-grid">
        {articles.map(a => <article key={a.slug} className="insight-card">
          <span className="micro">{a.category}</span>
          <h2>{a.title}</h2>
          <p>{a.excerpt}</p>
          <Link className="card-link" href={`/insights/${a.slug}`}>Read more →</Link>
        </article>)}
      </div>
    </section>

    <section className="section">
      <span className="eyebrow">Next step</span>
      <h2>Want to see how these ideas apply to your business?</h2>
      <div className="hero-actions">
        <a className="button" href="/audit">Request a Business Leak Audit</a>
        <a className="button secondary" href="/pricing">See pricing</a>
      </div>
    </section>
  </main>;
}
