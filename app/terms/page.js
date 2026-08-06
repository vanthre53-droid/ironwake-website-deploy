import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Terms — IronWake',
  description: 'Commercial, tax, refund, and contracting terms are not active until reviewed and approved.'
};

export default function TermsPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">IronWake / Terms</span>
      <h1>Terms are a review gate.</h1>
      <p>Commercial, tax, refund, and contracting terms are not active until reviewed and approved.</p>
      <a className="button" href="/">Back home</a>
    </section>
    <SiteFooter />
  </main>;
}
