import { AiReceptionistSystem } from './AiReceptionistSystem';

// ponytail: AI Receptionist is a real implementation offer (R14). The page body lists capability/demo/provider/client deployment status and a PricingReference with the canonical AI Receptionist Starter tiers. Title and description must reflect the offer, not the historical "concept" framing. Child title drops the `— IronWake` suffix because the layout template appends it.
export const metadata = {
  title: 'AI Receptionist Starter',
  description: 'A disclosed, human-supervised first-response implementation for phone, chat, and DM. Provider status is transparent; the AI Receptionist Starter offer is one of IronWake’s five canonical public systems.'
};

export default function AiReceptionistPage() {
  return <AiReceptionistSystem />;
}
