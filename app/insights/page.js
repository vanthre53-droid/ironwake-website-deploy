import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Insights — IronWake',
  description: 'Working notes from the operator side of the workflow: how the gap between first enquiry and first response is closed, what is verified, and what stays pending.',
  alternates: { canonical: canonicalUrl("/insights") },
};

// ponytail: every article is a real, verifiable working note.
// Status is labelled explicitly so the reader knows what is documented
// versus what is still being measured. No inventing coverage.
const articles = [
  {
    slug: 'seven-seconds',
    eyebrow: 'Working note',
    title: 'Seven seconds is not a benchmark. It is a question.',
    dek: 'The fix-speed number is the easy part to measure. The harder question is what the operator does in the next incident.',
    readTime: '6 min read',
    date: 'Updated quarterly',
    status: 'VERIFIED',
    statusNote: 'A reproducible observation across three dental and two home-services audits.'
  },
  {
    slug: 'verification-ladder',
    eyebrow: 'Working note',
    title: 'The verification ladder — DEMONSTRATION, PROVIDER PROOF PENDING, VERIFIED.',
    dek: 'Why IronWake labels every claim, and what each label commits the next record to do before it is allowed to read "VERIFIED".',
    readTime: '9 min read',
    date: 'Updated quarterly',
    status: 'PROVIDER PROOF PENDING',
    statusNote: 'Provider-specific claims are labelled until the third-party record is on file.'
  }
];

const statusTone = {
  'VERIFIED': 'status-verified',
  'PROVIDER PROOF PENDING': 'status-pending',
  'AWAITING VERIFICATION': 'status-awaiting',
  'DEMONSTRATION': 'status-demo'
};

export default function InsightsPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Insights</span><h1>Working notes from the operator side of the workflow.</h1><p className="reading-width">Each note is a documented observation — what was measured, what was verified, and what remains pending. Nothing here is implied as a guarantee.</p></section>

    <MotionReveal>
      <section className="section insights-grid-section">
        <div className="reading-width insights-grid-header">
          <span className="eyebrow">Latest notes</span>
          <h2>Two articles. Both are working notes, not thought leadership.</h2>
          <p className="section-lede">Each card carries the same status label the audit document uses. Reader is never asked to assume what is verified.</p>
        </div>
        <div className="insights-grid">
          {articles.map((article) => (
            <a key={article.slug} className="insight-card" href={`/insights/${article.slug}`}>
              <span className="insight-card-eyebrow">{article.eyebrow}</span>
              <h3>{article.title}</h3>
              <p className="insight-card-dek">{article.dek}</p>
              <dl className="insight-card-meta">
                <div><dt>Read</dt><dd>{article.readTime}</dd></div>
                <div><dt>Updated</dt><dd>{article.date}</dd></div>
              </dl>
              <div className="insight-card-status">
                <span className={`insight-status-pill ${statusTone[article.status] || 'status-demo'}`}>{article.status}</span>
                <p>{article.statusNote}</p>
              </div>
              <span className="insight-card-link">Read the working note →</span>
            </a>
          ))}
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section disclosure">
        <div>
          <span className="eyebrow">Status labels</span>
          <h3>What each label means on a working note.</h3>
          <p>Labels are not editorial — they are the same labels the audit document uses. A reader can check the audit and find the same label on the same record.</p>
        </div>
        <div className="disclosure-box">
          <ul className="insight-status-list">
            <li><span className="insight-status-pill status-demo">DEMONSTRATION</span> A working example. Visible to the reader but not used as a proof of provider state.</li>
            <li><span className="insight-status-pill status-pending">PROVIDER PROOF PENDING</span> A claim that depends on a third-party record. Stays labelled until the record is on file.</li>
            <li><span className="insight-status-pill status-verified">VERIFIED</span> A claim supported by a reproducible observation or a third-party record on file.</li>
          </ul>
        </div>
      </section>
    </MotionReveal>
  </main>;
}