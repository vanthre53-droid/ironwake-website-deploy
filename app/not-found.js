import { SiteHeader } from './components/SiteHeader';

export const metadata = {
  title: 'Page not found — IronWake',
  description: 'The requested IronWake page could not be found.'
};

export default function NotFound() {
  return <main className="shell"><SiteHeader /><section className="hero compact"><span className="eyebrow">IronWake / 404</span><h1>We could not find that page.</h1><p>The link may be outdated or the address may be incorrect.</p><a className="button" href="/">Return home</a></section></main>;
}
