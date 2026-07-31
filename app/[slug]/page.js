import { notFound } from 'next/navigation';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

const pages = {
  privacy: ['Privacy is a draft gate.', 'This application requires a reviewed retention policy, real entity, and processor list before public collection is enabled.'],
  terms: ['Terms are a review gate.', 'Commercial, tax, refund, and contracting terms are not active until reviewed and approved.']
};

export function generateStaticParams() { return Object.keys(pages).map(slug => ({ slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return {};
  return { title: `${page[0]} — IronWake`, description: page[1] };
}

export default async function InformationalPage({ params }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return <main className="shell"><SiteHeader /><section className="hero compact"><span className="eyebrow">IronWake / {slug}</span><h1>{page[0]}</h1><p>{page[1]}</p><a className="button" href="/">Back home</a></section><SiteFooter /></main>;
}
