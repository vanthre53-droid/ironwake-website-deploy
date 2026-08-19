/**
 * Button — single source of truth for ALL buttons on IronWake.
 *
 * Wraps the shared .button / .iw-button primitives defined in globals.css.
 * Adds loading state (aria-busy + spinner), keyboard Enter/Space semantics,
 * focus management, and an icon slot. Suppresses native button click
 * while busy to prevent double-submits.
 *
 * Variants (copper-first brand — no black-dominant CTAs):
 *   - "primary"     (default) — copper fill, white text, lift on hover
 *   - "secondary"   — warm-light surface + copper border (premium outline)
 *   - "ghost"       — copper text, paper-warm hover wash
 *   - "destructive" — error red fill, white text
 *
 * Sizes:
 *   - "md" (default) — 48px min-height, 14px 22px padding
 *   - "sm"           — 36px min-height, 10px 16px padding
 *   - "lg"           — 56px min-height, 18px 26px padding
 *
 * Usage:
 *   <Button type="submit" loading={submitting} onClick={handleSubmit}>
 *     Send the audit request
 *   </Button>
 *   <Button variant="ghost" size="sm" leadingIcon={<ArrowIcon />}>Cancel</Button>
 *   <Button as="a" href="/pricing">See pricing</Button>
 */

import { useCallback } from 'react';

const VARIANTS = new Set(['primary', 'secondary', 'ghost', 'destructive']);
const SIZES = new Set(['sm', 'md', 'lg']);

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  block = false,
  leadingIcon,
  trailingIcon,
  className = '',
  onClick,
  as,
  href,
  ...rest
}) {
  const safeVariant = VARIANTS.has(variant) ? variant : 'primary';
  const safeSize = SIZES.has(size) ? size : 'md';

  const isInactive = disabled || loading;

  const handleClick = useCallback(
    (event) => {
      if (isInactive) {
        event.preventDefault();
        return;
      }
      if (onClick) onClick(event);
    },
    [isInactive, onClick]
  );

  // Primary maps to base .button (copper fill). Other variants layer both
  // the legacy .button.{variant} class and the explicit BEM modifier so
  // CSS can rely on either contract.
  const composedClass = [
    'button',
    safeVariant !== 'primary' ? safeVariant : '',
    `iw-button--${safeVariant}`,
    `iw-button--${safeSize}`,
    block ? 'iw-button--block' : '',
    leadingIcon ? 'iw-button--has-leading' : '',
    trailingIcon ? 'iw-button--has-trailing' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaProps = {
    'aria-busy': loading ? 'true' : undefined,
    'aria-disabled': isInactive ? 'true' : undefined,
    disabled: isInactive ? true : undefined,
  };

  const inner = (
    <>
      {loading ? (
        <span className="iw-button__spinner" aria-hidden="true" />
      ) : leadingIcon ? (
        <span className="iw-button__icon iw-button__icon--leading" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className="iw-button__label">{children}</span>
      {!loading && trailingIcon ? (
        <span className="iw-button__icon iw-button__icon--trailing" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </>
  );

  // Allow rendering as <a> for href-driven primary CTAs (e.g. /pricing).
  if (as === 'a' || href) {
    return (
      <a
        className={composedClass}
        href={isInactive ? undefined : href}
        onClick={handleClick}
        aria-disabled={ariaProps['aria-disabled']}
        aria-busy={ariaProps['aria-busy']}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      className={composedClass}
      type={type}
      onClick={handleClick}
      aria-busy={ariaProps['aria-busy']}
      aria-disabled={ariaProps['aria-disabled']}
      disabled={ariaProps['disabled']}
      {...rest}
    >
      {inner}
    </button>
  );
}
