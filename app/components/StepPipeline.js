'use client';

import { useEffect, useRef, useState } from 'react';

// ponytail: case-study step pipeline animation — sequential reveal with copper connectors that fill as each step activates.
export function StepPipeline({ steps, ariaLabel }) {
  const [active, setActive] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(steps.length - 1);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const timers = [];
      for (let i = 0; i < steps.length; i++) {
        timers.push(setTimeout(() => setActive(i), 220 * i + 200));
      }
      return () => timers.forEach(clearTimeout);
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <div ref={ref} className="step-pipeline" role="group" aria-label={ariaLabel}>
      {steps.map((step, i) => (
        <div key={step.label} className={`step-pipeline-node${i <= active ? ' active' : ''}`}>
          <span className="step-pipeline-icon" aria-hidden="true">{step.icon}</span>
          <span className="step-pipeline-label">{step.label}</span>
          <span className="step-pipeline-desc">{step.desc}</span>
          {i < steps.length - 1 && <span className="step-pipeline-arrow" aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}
