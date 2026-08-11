import { AiReceptionistSystem } from './AiReceptionistSystem';

export const metadata = {
  title: 'AI Receptionist Planning',
  description: 'Requirements for a disclosed, human-supervised AI receptionist build. The IronWake site assistant is live and model-backed; client AI Receptionist deployments require a separately scoped provider build per client.'
};

export default function AiReceptionistPage() {
  return <AiReceptionistSystem />;
}
