import { TrustLeadCaptureSystem } from './TrustLeadCaptureSystem';

export const metadata = {
  title: 'Trust and Lead Capture — IronWake',
  description: 'The validation, consent, and credential-handling steps behind every IronWake lead-capture form, from server-side schema validation to a hidden spam trap.'
};

export default function TrustLeadCapturePage() {
  return <TrustLeadCaptureSystem />;
}
