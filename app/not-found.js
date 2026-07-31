import { SiteHeader } from './components/SiteHeader';

export const metadata = {
  title: 'Path unowned — IronWake',
  description: 'This route does not exist yet.'
};

export default function NotFound() {
  return <main className="shell"><SiteHeader /><section className="hero compact"><span className="eyebrow">IronWake / 404</span><h1>Path unowned.</h1><p>This route does not exist yet.</p><a className="button" href="/">Return home</a></section></main>;
}
