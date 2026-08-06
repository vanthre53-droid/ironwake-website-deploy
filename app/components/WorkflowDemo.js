'use client';

import { useEffect, useRef, useState } from 'react';

// ponytail: lightweight workflow demo animation using CSS transforms/opacity only.
// Demonstrates the IronWake operating model visually: enquiry → owner → next action.
export function WorkflowDemo({ className = '' }) {
  const ref = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(3);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      // Stagger the steps
      const timers = [
        setTimeout(() => setStep(1), 400),
        setTimeout(() => setStep(2), 1200),
        setTimeout(() => setStep(3), 2000)
      ];
      return () => timers.forEach(clearTimeout);
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`workflow-demo ${className}`} role="img" aria-label="Animated workflow: enquiry arrives, owner is assigned, next action becomes visible">
      <div className={`workflow-step ${step >= 1 ? 'active' : ''}`}>
        <div className="workflow-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="workflow-content">
          <span className="workflow-label">Enquiry arrives</span>
          <span className="workflow-detail">Written to durable record</span>
        </div>
      </div>

      <div className={`workflow-connector ${step >= 2 ? 'active' : ''}`}>
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 12h32M26 6l6 6-6 6" />
        </svg>
      </div>

      <div className={`workflow-step ${step >= 2 ? 'active' : ''}`}>
        <div className="workflow-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <div className="workflow-content">
          <span className="workflow-label">Owner assigned</span>
          <span className="workflow-detail">Named person, real due date</span>
        </div>
      </div>

      <div className={`workflow-connector ${step >= 3 ? 'active' : ''}`}>
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 12h32M26 6l6 6-6 6" />
        </svg>
      </div>

      <div className={`workflow-step ${step >= 3 ? 'active' : ''}`}>
        <div className="workflow-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <div className="workflow-content">
          <span className="workflow-label">Next action visible</span>
          <span className="workflow-detail">Owner knows exactly what to do</span>
        </div>
      </div>
    </div>
  );
}
