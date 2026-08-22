import { Metadata } from 'next';
import { AiReceptionistSystem } from './AiReceptionistSystem';
import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';

export const metadata = {
  // ponytail: live receptionist demo on this domain against verified production Retell agent; per-tenant client receptionist remains separately scoped.
  title: 'AI Receptionist — Live Demo on This Site',
  description:
    'AI Receptionist system plan and live demo — a real Retell-backed web-call you can start from this page, plus the per-tenant scope required for a client deployment.',
  alternates: { canonical: '/systems/ai-receptionist' },
  openGraph: {
    title: 'AI Receptionist — Live Demo — IronWake',
    description:
      'Live Retell-backed voice receptionist demo on ironwake.dev, plus the per-tenant scope for a client deployment.',
    url: '/systems/ai-receptionist',
  },
};

export default function AiReceptionistPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Systems', url: '/systems' }, { name: 'AI Receptionist', url: '/systems/ai-receptionist' }])) }} />
      <AiReceptionistSystem />
    </>
  );
}