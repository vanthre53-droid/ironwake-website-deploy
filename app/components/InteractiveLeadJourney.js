'use client';

import { useEffect, useRef, useState } from 'react';

// ponytail: interactive lead-journey demo. Visitor picks a channel, the path through the system visibly animates.
const CHANNELS = [
  { id: 'web', label: 'Website form', icon: 'web' },
  { id: 'call', label: 'Phone call', icon: 'call' },
  { id: 'message', label: 'WhatsApp / DM', icon: 'message' },
];

const ROUTES = {
  web: ['Landing page', 'Form submit', 'Validation + spam trap', 'Inquiry record saved', 'Email notification queued', 'Owner assigned', 'Acknowledged'],
  call: ['Phone rings', 'Missed-call detection', 'Auto SMS callback link', 'Inquiry record saved', 'Owner notified via SMS + email', 'Owner returns call', 'Callback logged'],
  message: ['WhatsApp arrives', 'Disclosure: automated', 'Capture intent + contact', 'Inquiry record saved', 'Owner inbox + email', 'Human handoff available', 'Conversation archived'],
};

function ChannelIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'web') return <svg {...common}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18" /><circle cx="6.5" cy="6" r=".5" fill="currentColor" /></svg>;
  if (name === 'call') return <svg {...common}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" /></svg>;
  return <svg {...common}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
}

export function InteractiveLeadJourney() {
  const [channel, setChannel] = useState('web');
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef(null);
  const route = ROUTES[channel];

  useEffect(() => {
    setActiveStep(0);
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveStep(route.length);
      return;
    }
    const timers = [];
    for (let i = 1; i <= route.length; i++) {
      timers.push(setTimeout(() => setActiveStep(i), 200 * i + 400));
    }
    return () => timers.forEach(clearTimeout);
  }, [channel, route.length]);

  return (
    <section className="section interactive-journey" aria-label="Interactive lead journey">
      <span className="eyebrow">Interactive lead journey</span>
      <h2>Pick how a customer reaches you.</h2>
      <p>The system route is the same. The path adapts to the channel.</p>

      <div ref={ref} className="channel-picker" role="radiogroup" aria-label="Lead channel">
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={channel === c.id}
            className={`channel-button${channel === c.id ? ' active' : ''}`}
            onClick={() => setChannel(c.id)}
          >
            <ChannelIcon name={c.icon} />
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <ol className="journey-route" aria-live="polite">
        {route.map((node, i) => (
          <li key={`${channel}-${i}`} className={`journey-node${i < activeStep ? ' done' : ''}${i === activeStep - 1 ? ' active' : ''}`}>
            <span className="journey-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="journey-label">{node}</span>
          </li>
        ))}
      </ol>

      <p className="journey-note">Every step is logged. The owner dashboard shows where the lead is in this path and who owns the next action.</p>
    </section>
  );
}
