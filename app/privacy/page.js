import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Privacy — IronWake',
  description: 'This application requires a reviewed retention policy, real entity, and processor list before public collection is enabled.'
};

export default function PrivacyPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">IronWake / Privacy</span>
      <h1>Privacy is a draft gate.</h1>
      <p>This application requires a reviewed retention policy, real entity, and processor list before public collection is enabled.</p>
      <a className="button" href="/">Back home</a>
    </section>
    <SiteFooter />
  </main>;
}
