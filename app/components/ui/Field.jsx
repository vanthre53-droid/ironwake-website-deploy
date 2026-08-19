/**
 * Field — single source of truth for ALL form inputs on IronWake.
 *
 * Renders a label + control + error + help region with consistent
 * accessibility wiring (aria-invalid, aria-describedby, id binding)
 * so every form on the site uses the same DOM shape and the same
 * visual language defined in .iw-field* in globals.css.
 *
 * Usage:
 *   <Field id="email" name="email" label="Work email" type="email" required
 *          value={email} onChange={(e) => setEmail(e.target.value)}
 *          error={touched.email && errors.email}
 *          help="We never share this address." />
 *
 * Slots:
 *   - label: string OR ReactNode — string is rendered as <span>
 *   - type: text|email|tel|url|password|number|search (default "text")
 *   - inputMode / autoComplete / minLength / maxLength / required forwarded to <input>
 *   - error: string|ReactNode|null — when truthy, control gets aria-invalid="true"
 *           and the error is wired to aria-describedby
 *   - help: string|ReactNode|null — rendered with id={`${id}-help`} when no error
 *   - leadingIcon / trailingIcon: optional ReactNode rendered inside the control
 *   - multiline: when true, renders <textarea> instead of <input>
 *   - as="input"|"textarea"|"select": overrides the element (advanced)
 */

import { useId } from 'react';

export default function Field({
  id,
  name,
  label,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  readOnly,
  autoComplete,
  inputMode,
  minLength,
  maxLength,
  min,
  max,
  step,
  pattern,
  help,
  error,
  leadingIcon,
  trailingIcon,
  multiline = false,
  as,
  rows,
  children,
  className = '',
  controlClassName = '',
  labelClassName = '',
  ...rest
}) {
  // useId() guarantees a stable id even when the caller forgets to pass one.
  // We prefer an explicit id for SSR-friendly layout stability.
  const reactId = useId();
  const inputId = id || `field-${reactId}`;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);
  const describedBy = hasError ? errorId : help ? helpId : undefined;

  const wrapperClass = [
    'iw-field',
    hasError ? 'iw-field--invalid' : '',
    disabled ? 'iw-field--disabled' : '',
    multiline ? 'iw-field--multiline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const controlClass = [
    'iw-field__control',
    hasError ? 'iw-field__control--invalid' : '',
    controlClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const labelClass = ['iw-field__label', labelClassName]
    .filter(Boolean)
    .join(' ');

  const commonProps = {
    id: inputId,
    name,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    required,
    disabled,
    readOnly,
    'aria-invalid': hasError ? 'true' : undefined,
    'aria-describedby': describedBy,
    className: controlClass,
    ...rest,
  };

  let Control;
  if (as === 'textarea' || multiline) {
    Control = (
      <textarea
        {...commonProps}
        rows={rows || 4}
        maxLength={maxLength}
        minLength={minLength}
      />
    );
  } else if (as === 'select') {
    Control = (
      <select {...commonProps} value={value}>
        {children}
      </select>
    );
  } else {
    Control = (
      <input
        {...commonProps}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
      />
    );
  }

  return (
    <div className={wrapperClass}>
      <label htmlFor={inputId} className={labelClass}>
        {typeof label === 'string' ? <span>{label}</span> : label}
        {required ? (
          <span aria-hidden="true" className="iw-field__required">
            *
          </span>
        ) : null}
      </label>
      <div className="iw-field__shell">
        {leadingIcon ? (
          <span className="iw-field__icon iw-field__icon--leading" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        {Control}
        {trailingIcon ? (
          <span className="iw-field__icon iw-field__icon--trailing" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </div>
      {hasError ? (
        <div id={errorId} className="iw-field__error" role="alert">
          {error}
        </div>
      ) : help ? (
        <div id={helpId} className="iw-field__help">
          {help}
        </div>
      ) : null}
    </div>
  );
}
