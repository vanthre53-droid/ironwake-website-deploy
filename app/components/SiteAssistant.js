'use client';

import { useState, useRef, useEffect } from 'react';

// ponytail: deterministic decision-tree assistant with pricing knowledge; no AI provider required.
// Upgrade path: wire to /api/chat when a provider is configured.
const FLOWS = {
  start: {
    message: "I can help you find where your business might be losing enquiries, or show you our pricing. What would you like?",
    options: [
      { label: 'Find my workflow leak', next: 'service_type' },
      { label: 'Show me pricing', next: 'pricing_overview' },
      { label: 'How does IronWake work?', next: 'how_it_works' },
      { label: 'Show me your portfolio', action: 'link', href: '/work' },
      { label: 'Book a diagnostic', action: 'link', href: '/audit' }
    ]
  },
  service_type: {
    message: "What best describes your business?",
    options: [
      { label: 'Service business (plumbing, HVAC, electrical)', next: 'service_diagnosis' },
      { label: 'Clinic or dental practice', next: 'clinic_diagnosis' },
      { label: 'Salon, spa, or wellness studio', next: 'salon_diagnosis' },
      { label: 'Other service business', next: 'other_diagnosis' }
    ]
  },
  service_diagnosis: {
    message: "Service businesses often miss enquiries that come in after hours or when the team is on-site. Which sounds most like your situation?",
    options: [
      { label: 'We miss calls and don\'t call back in time', next: 'missed_calls' },
      { label: 'Enquiries come in but nobody follows up', next: 'no_followup' },
      { label: 'We book jobs but lose track of confirmations', next: 'booking_confusion' },
      { label: 'Not sure — we just know leads disappear', next: 'not_sure' }
    ]
  },
  clinic_diagnosis: {
    message: "Clinics often lose enquiries between the first call and the actual appointment. Which matches your experience?",
    options: [
      { label: 'Patients call but we can\'t always answer', next: 'missed_calls' },
      { label: 'We take details but follow-up is inconsistent', next: 'no_followup' },
      { label: 'Appointments get double-booked or missed', next: 'booking_confusion' },
      { label: 'We want to see what IronWake recommends', next: 'recommendation' }
    ]
  },
  salon_diagnosis: {
    message: "Salons and spas often lose consultation interest when it isn't followed up within a day. What's your biggest challenge?",
    options: [
      { label: 'DMs and enquiries go unanswered too long', next: 'missed_calls' },
      { label: 'We book but clients forget or don\'t show', next: 'booking_confusion' },
      { label: 'We want more repeat bookings', next: 'no_followup' },
      { label: 'Show me what IronWake can do', next: 'recommendation' }
    ]
  },
  other_diagnosis: {
    message: "IronWake works with any service business that takes enquiries and turns them into bookings or jobs. What would you most like to fix?",
    options: [
      { label: 'Capture every enquiry reliably', next: 'missed_calls' },
      { label: 'Make follow-up automatic and visible', next: 'no_followup' },
      { label: 'Stop losing track of bookings', next: 'booking_confusion' },
      { label: 'Just show me the demo', next: 'recommendation' }
    ]
  },
  missed_calls: {
    message: "That's exactly what Missed Lead Recovery fixes. It ensures every enquiry is written to a durable record before any notification runs — so a dropped call or unanswered DM can't erase the lead. Setup starts at ₹2,200 / $99.",
    options: [
      { label: 'Show me how it works', action: 'link', href: '/systems/missed-lead-recovery' },
      { label: 'Book a diagnostic (₹799 / $29)', action: 'link', href: '/audit' },
      { label: 'See all pricing', next: 'pricing_overview' },
      { label: 'Start over', next: 'start' }
    ]
  },
  no_followup: {
    message: "That's a follow-up ownership problem. IronWake assigns every enquiry to a named person with a visible next action — so you can see exactly who owns what and what's overdue. This is part of Booking Certainty, starting at ₹12,999 / $199.",
    options: [
      { label: 'Show me the system', action: 'link', href: '/systems/missed-lead-recovery' },
      { label: 'See a real demonstration', action: 'link', href: '/work/rapidpulse' },
      { label: 'Book a diagnostic', action: 'link', href: '/audit' },
      { label: 'Start over', next: 'start' }
    ]
  },
  booking_confusion: {
    message: "That's a booking certainty problem. IronWake separates booking requests from confirmed appointments so nobody assumes the wrong state. Every booking stays a reviewed request until verified. Starts at ₹12,999 / $199.",
    options: [
      { label: 'Show me Booking Certainty', action: 'link', href: '/systems/booking-control' },
      { label: 'See a demonstration', action: 'link', href: '/work/dentacare-pro' },
      { label: 'Book a diagnostic', action: 'link', href: '/audit' },
      { label: 'Start over', next: 'start' }
    ]
  },
  not_sure: {
    message: "That's common — most businesses know leads are slipping but can't pinpoint where. A Business Leak Audit maps exactly where your process loses momentum. It costs ₹799 / $29 and you get a written review.",
    options: [
      { label: 'Book a diagnostic', action: 'link', href: '/audit' },
      { label: 'See how IronWake works first', next: 'how_it_works' },
      { label: 'See pricing', next: 'pricing_overview' },
      { label: 'Start over', next: 'start' }
    ]
  },
  recommendation: {
    message: "Based on what you've described, I'd recommend starting with a Business Leak Audit (₹799 / $29). It identifies the exact point where your process loses momentum, and gives you a written review with the smallest next step to fix it.",
    options: [
      { label: 'Book a diagnostic', action: 'link', href: '/audit' },
      { label: 'See our case studies', action: 'link', href: '/work' },
      { label: 'See all pricing', next: 'pricing_overview' },
      { label: 'Start over', next: 'start' }
    ]
  },
  pricing_overview: {
    message: "IronWake has five systems, each with Lite / Standard / Pro tiers:\n\n• Business Leak Audit — from ₹799 / $29\n• Missed Lead Recovery — from ₹2,200 / $99\n• Booking Certainty — from ₹12,999 / $199\n• Trust + Lead Capture — from ₹12,999 / $499\n• AI Receptionist — from ₹29,999 / $1,000\n\nEvery engagement starts with the diagnostic.",
    options: [
      { label: 'See full pricing page', action: 'link', href: '/pricing' },
      { label: 'Book a diagnostic', action: 'link', href: '/audit' },
      { label: 'Find my workflow leak', next: 'service_type' },
      { label: 'Start over', next: 'start' }
    ]
  },
  how_it_works: {
    message: "IronWake maps where your enquiry, booking, or follow-up process loses momentum, then implements the smallest system that makes the next step visible and owned. We start with a Business Leak Audit (₹799 / $29), then scope a bounded solution. No vague promises — just inspectable operational improvements.",
    options: [
      { label: 'See our systems', action: 'link', href: '/systems' },
      { label: 'See case studies', action: 'link', href: '/work' },
      { label: 'Book a diagnostic', action: 'link', href: '/audit' },
      { label: 'Get an email follow-up', next: 'handoff_consent' },
      { label: 'See pricing', next: 'pricing_overview' }
    ]
  },
  // ponytail: explicit handoff node so consent-to-record is visible. No lead
  // is persisted unless the visitor submits the Audit form (which requires a
  // consent checkbox). The chatbot itself does not POST anywhere.
  handoff_consent: {
    message:
      "If you want IronWake to follow up by email, share your details on the Audit form — your information is only recorded after you tick the consent checkbox. Nothing is stored from this chat alone.",
    options: [
      { label: 'Open the Audit form', action: 'link', href: '/audit' },
      { label: 'See pricing first', next: 'pricing_overview' },
      { label: 'Start over', next: 'start' }
    ]
  }
};

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentFlow, setCurrentFlow] = useState('start');
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [open, history]);

  function handleOption(option) {
    if (option.action === 'link') {
      window.location.href = option.href;
      return;
    }
    setHistory(prev => [...prev, { flow: currentFlow, option: option.label }]);
    setCurrentFlow(option.next);
  }

  function restart() {
    setHistory([]);
    setCurrentFlow('start');
  }

  const flow = FLOWS[currentFlow];

  return <aside id="ironwake-assistant" className={`site-assistant${open ? ' is-open' : ''}`} aria-label="IronWake workflow assistant">
    {open && <section className="assistant-panel" ref={panelRef} aria-live="polite">
      <div className="assistant-heading">
        <div><span className="eyebrow">Workflow guide</span><h2>Find your leak</h2></div>
        <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
      </div>
      <div className="assistant-chat">
        {history.map((h, i) => <div key={i} className="chat-exchange">
          <p className="chat-user"><span className="sr-only">You said: </span>{h.option}</p>
        </div>)}
        <p className="chat-assistant">{flow.message}</p>
        <div className="chat-options" aria-label="Choose a response">
          {flow.options.map((opt, i) => <button key={i} type="button" className="chat-option" onClick={() => handleOption(opt)}>{opt.label}</button>)}
        </div>
      </div>
      {history.length > 0 && <button type="button" className="text-link" onClick={restart}>Start over →</button>}
      <p className="assistant-note">This is a guided decision tree, not a live AI. Responses are pre-written by IronWake.</p>
    </section>}
    <button className="assistant-trigger" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="ironwake-assistant">{open ? 'Close' : 'Need help?'}</button>
  </aside>;
}
