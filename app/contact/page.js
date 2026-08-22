import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';
import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';

export const metadata = {
  title: 'Contact — IronWake',
  description: 'Describe one operational gap — a missed enquiry, a booking handoff, or a follow-up that loses ownership — and IronWake replies within one business day.',
  alternates: { canonical: canonicalUrl('/contact') },
};

export default function ContactPage() {
  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ])) }} />

      <SiteHeader />

      <section className="hero compact">
        <span className="eyebrow">Contact</span>
        <h1>Tell us where one enquiry or booking slips.</h1>
        <p className="reading-width">
          Describe one operational gap — a missed enquiry, a booking that never confirms, or a follow-up that loses ownership. A real reply within one business day, not a chatbot tunnel.
        </p>
      </section>

      <MotionReveal>
        <section className="section contact-grid">
          <form className="contact-form" action="/api/contact" method="POST" noValidate>
            <div className="field">
              <label htmlFor="contact-name">Your name</label>
              <input id="contact-name" name="name" type="text" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="contact-business">Business name (optional)</label>
              <input id="contact-business" name="business" type="text" autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="contact-message">The operational gap</label>
              <textarea id="contact-message" name="message" rows={5} required placeholder="One enquiry, booking, or follow-up that lost visibility." />
            </div>
            <button type="submit" className="button">Send the gap</button>
            <p className="micro">One email reaches the inbox. Nothing is queued, nothing is automated beyond that single reply.</p>
          </form>

          <aside className="contact-aside">
            <h2>What happens next</h2>
            <ol className="contact-steps">
              <li><strong>You submit one operational gap.</strong> A single concrete moment where an enquiry, booking, or follow-up lost visibility. No diagnostic required yet.</li>
              <li><strong>We read it and reply within one business day.</strong> Either with a short list of likely causes and one audit option, or with a direct answer if the gap is already clear.</li>
              <li><strong>If we are the right fit, we run a Leak Audit.</strong> A scoped review of one handoff — not a sales deck. If we are not, we name two practitioners who fit your situation better.</li>
            </ol>
            <h3>Direct channels</h3>
            <ul className="contact-channels">
              <li><strong>Email:</strong> ironwakee@gmail.com</li>
              <li><strong>WhatsApp:</strong> the round WhatsApp icon, bottom-left. Prefills a short message.</li>
              <li><strong>Owner-assistant:</strong> the round chat icon, bottom-left. A documented model-backed assistant that hands off to a human when the question is concrete.</li>
            </ul>
            <p className="micro">Every claim on this site is labelled with its proof class. Submitting a contact request does not enrol you in any list or trigger any automation beyond a single email to the inbox above.</p>
          </aside>
        </section>
      </MotionReveal>
    </main>
  );
}
