import { Metadata } from 'next';
import { AiReceptionistSystem } from './AiReceptionistSystem';
import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';

export const metadata = {
  // ponytail: site assistant may be live; client AI Receptionist still requires separately scoped provider deployment.
  title: 'AI Receptionist Planning',
  description:
    'AI Receptionist system planning — what it would do, what is currently live on this site, and why the client receptionist is not yet a deployed provider.',
  alternates: { canonical: '/systems/ai-receptionist' },
  openGraph: {
    title: 'AI Receptionist Planning — IronWake',
    description:
      'Plan view of an AI receptionist system: capability vs status, live site assistant, and the separately-scoped provider work.',
    url: '/systems/ai-receptionist',
  },
};

export default function AiReceptionistPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Systems', url: '/systems' }, { name: 'AI Receptionist Planning', url: '/systems/ai-receptionist' }])) }} />
      <AiReceptionistSystem />
    </>
  );
}