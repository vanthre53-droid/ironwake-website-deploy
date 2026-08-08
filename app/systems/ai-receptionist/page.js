import { AiReceptionistSystem } from './AiReceptionistSystem';

// ponytail: AI Receptionist is a real implementation offer (R14). The page body lists capability/demo/provider/client deployment status and a PricingReference with the canonical AI Receptionist Starter tiers. Title and description must reflect the offer, not the historical "concept" framing.
export const metadata = {
  title: 'AI Receptionist Starter — IronWake',
  description: 'A disclosed, human-supervised first-response implementation for phone, chat, and DM. Provider status is transparent; the AI Receptionist Starter offer is one of IronWake’s five canonical public systems.'
};

export default function AiReceptionistPage() {
  return <AiReceptionistSystem />;
}
