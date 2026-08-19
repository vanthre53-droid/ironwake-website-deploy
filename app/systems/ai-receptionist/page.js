import { Metadata } from 'next';
import { AiReceptionistSystem } from './AiReceptionistSystem';

export const metadata = {
  title: 'AI Receptionist Planning — IronWake Systems',
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
  return <AiReceptionistSystem />;
}