'use client';

// ponytail: dental-practice ROI/usage calculator.
// Inputs are operator-typed defaults, not fabricated market stats.
// All math is local; the only injected data is the price of the AI Receptionist
// system (pulled from /lib/pricing.mjs to keep parity with the /pricing page).
// No third-party requests, no fabricated conversion rates — see RESULTS
// label that clearly describes how the figure is computed.

import { useId, useMemo, useState } from 'react';
import { PRICING_BY_ID } from '../../../lib/pricing.mjs';

const PRICE_OFFER = PRICING_BY_ID['ai-receptionist'];
const PRICE_BY_REGION = Object.freeze({
  india: PRICE_OFFER.india,
  intl: PRICE_OFFER.intl,
});

const REGION_LABELS = Object.freeze({
  india: 'India (₹)',
  intl: 'International ($)',
});

const DEFAULTS = Object.freeze({
  region: 'india',
  weeklyInboundCalls: 120,
  missedCallRatePct: 32,
  newPatientShowRatePct: 70,
  averagePatientLifetimeValue: 1500,
});

function formatCurrency(value, region) {
  if (!Number.isFinite(value)) return '—';
  if (region === 'india') {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
    return `₹${Math.round(value)}`;
  }
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '—';
  return Math.round(value).toLocaleString('en-IN');
}

export function RoiCalculator() {
  const [region, setRegion] = useState(DEFAULTS.region);
  const [weeklyInboundCalls, setWeeklyInboundCalls] = useState(DEFAULTS.weeklyInboundCalls);
  const [missedCallRatePct, setMissedCallRatePct] = useState(DEFAULTS.missedCallRatePct);
  const [newPatientShowRatePct, setNewPatientShowRatePct] = useState(DEFAULTS.newPatientShowRatePct);
  const [averagePatientLifetimeValue, setAveragePatientLifetimeValue] = useState(
    DEFAULTS.averagePatientLifetimeValue
  );

  const idBase = useId();

  // ponytail: calculation chain — every step is plain arithmetic and is shown
  // beside the headline so the operator can see how the figure is built. No
  // external rates are baked in; only inputs the operator adjusts.
  const math = useMemo(() => {
    const safeCalls = Math.max(0, Number(weeklyInboundCalls) || 0);
    const safeMissedPct = Math.min(100, Math.max(0, Number(missedCallRatePct) || 0));
    const safeShowPct = Math.min(100, Math.max(0, Number(newPatientShowRatePct) || 0));
    const safeLtv = Math.max(0, Number(averagePatientLifetimeValue) || 0);

    const callsMissedPerWeek = (safeCalls * safeMissedPct) / 100;
    const callsRecoveredPerWeek = callsMissedPerWeek; // ponytail: 100% recovery is the assumption the operator is testing, not a marketed conversion rate.
    const bookingsPerWeek = (callsRecoveredPerWeek * safeShowPct) / 100;
    const monthlyRecoveredPatients = bookingsPerWeek * 4 * (safeShowPct / 100 > 0 ? 1 : 0); // see label below
    const monthlyRecoveredValue = bookingsPerWeek * 4 * safeLtv;
    const annualRecoveredValue = monthlyRecoveredValue * 12;

    const regionPrices = PRICE_BY_REGION[region];
    const recommendedMonthly = regionPrices[2]; // Pro tier (most common in V14 plan)
    const paybackMonths = annualRecoveredValue > 0 ? (recommendedMonthly * 12) / annualRecoveredValue * 12 : Infinity;

    return {
      safeCalls,
      safeMissedPct,
      safeShowPct,
      safeLtv,
      callsMissedPerWeek,
      callsRecoveredPerWeek,
      bookingsPerWeek,
      monthlyRecoveredPatients,
      monthlyRecoveredValue,
      annualRecoveredValue,
      recommendedMonthly,
      paybackMonths,
    };
  }, [region, weeklyInboundCalls, missedCallRatePct, newPatientShowRatePct, averagePatientLifetimeValue]);

  const currencyLabel = REGION_LABELS[region];

  return (
    <div className="roi-shell" aria-label="Dental practice recovery calculator">
      <div className="roi-controls">
        <div className="roi-field roi-field--region" role="group" aria-label="Pricing region">
          <span className="roi-field__label">Pricing region</span>
          <div className="roi-region-pills">
            {Object.entries(REGION_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`roi-region-pill${region === key ? ' is-active' : ''}`}
                onClick={() => setRegion(key)}
                aria-pressed={region === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <NumberField
          id={`${idBase}-calls`}
          label="Inbound calls per week"
          help="Front-desk + after-hours routing combined."
          value={weeklyInboundCalls}
          min={0}
          max={2000}
          step={10}
          suffix="calls"
          onChange={setWeeklyInboundCalls}
        />
        <NumberField
          id={`${idBase}-missed`}
          label="Calls currently missed or unanswered"
          help="Voicemail, busy tone, or overflow during procedures."
          value={missedCallRatePct}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={setMissedCallRatePct}
        />
        <NumberField
          id={`${idBase}-show`}
          label="New-patient show rate"
          help="Patients who actually arrive for the booked appointment."
          value={newPatientShowRatePct}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={setNewPatientShowRatePct}
        />
        <NumberField
          id={`${idBase}-ltv`}
          label="Average patient lifetime value"
          help={region === 'india' ? 'In ₹. Conservative practice-wide estimate.' : 'In $. Conservative practice-wide estimate.'}
          value={averagePatientLifetimeValue}
          min={0}
          max={50000}
          step={50}
          suffix={region === 'india' ? '₹' : '$'}
          onChange={setAveragePatientLifetimeValue}
        />
      </div>

      <div className="roi-results" aria-live="polite">
        <div className="roi-result roi-result--headline">
          <span className="roi-result__label">Recovered new-patient value per year</span>
          <strong className="roi-result__value">{formatCurrency(math.annualRecoveredValue, region)}</strong>
          <span className="roi-result__help">
            Assumes the AI receptionist recovers every missed call and the operator's chosen show rate
            holds. Adjust inputs to model your practice.
          </span>
        </div>

        <div className="roi-result-grid">
          <div className="roi-result">
            <span className="roi-result__label">Calls missed / week</span>
            <strong className="roi-result__value">{formatNumber(math.callsMissedPerWeek)}</strong>
          </div>
          <div className="roi-result">
            <span className="roi-result__label">Recovered bookings / week</span>
            <strong className="roi-result__value">{formatNumber(math.bookingsPerWeek)}</strong>
          </div>
          <div className="roi-result">
            <span className="roi-result__label">Recovered patients / month</span>
            <strong className="roi-result__value">{formatNumber(math.bookingsPerWeek * 4)}</strong>
          </div>
          <div className="roi-result">
            <span className="roi-result__label">Monthly recovered value</span>
            <strong className="roi-result__value">{formatCurrency(math.monthlyRecoveredValue, region)}</strong>
          </div>
        </div>

        <div className="roi-cost">
          <span className="roi-result__label">IronWake AI Receptionist — Pro tier, {currencyLabel}</span>
          <strong className="roi-cost__value">
            {formatCurrency(math.recommendedMonthly * 12, region)} / year
          </strong>
          {Number.isFinite(math.paybackMonths) ? (
            <span className="roi-result__help">
              Implied payback ≈ {math.paybackMonths.toFixed(1)} months at this input mix
              (not a guarantee — your actual mix is what the calculator is asking you to model).
            </span>
          ) : (
            <span className="roi-result__help">
              Enter a non-zero show rate and lifetime value to model payback.
            </span>
          )}
        </div>

        <p className="roi-disclaimer">
          This is a planning calculator, not a forecast. Numbers shown depend entirely on the
          inputs above and the recovery assumption that every missed call is reached in time to
          book. IronWake does not collect outcome data from any live dental deployment.
        </p>
      </div>
    </div>
  );
}

function NumberField({ id, label, help, value, min, max, step, suffix, onChange }) {
  return (
    <label htmlFor={id} className="roi-field">
      <span className="roi-field__label">{label}</span>
      <span className="roi-field__control">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Number.isFinite(next) ? next : 0);
          }}
        />
        {suffix ? <span className="roi-field__suffix" aria-hidden="true">{suffix}</span> : null}
      </span>
      {help ? <span className="roi-field__help">{help}</span> : null}
    </label>
  );
}