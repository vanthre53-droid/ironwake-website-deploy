// ponytail: shared loading primitives for IronWake.
// Skeletons represent REAL asynchronous waiting — never artificial delays.
// Content-shaped geometry so the loaded state does not jump.
// All classes prefixed `iw-skel-` so they cannot collide with production styles.

function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}

// Single rounded bar — base building block.
export function Skeleton({
  width = '100%',
  height = 12,
  radius = 6,
  inline = false,
  ariaLabel = 'Loading',
  className,
  style
}) {
  const Tag = inline ? 'span' : 'div';
  const merged = { width, height, borderRadius: radius, ...style };
  return (
    <Tag
      role="status"
      aria-label={ariaLabel}
      className={classNames('iw-skel', className)}
      style={merged}
    />
  );
}

// Multi-line paragraph placeholder with natural line variation.
export function SkeletonText({ lines = 3, lastLineWidth = '60%', gap = 8, ariaLabel = 'Loading text' }) {
  const items = Array.from({ length: lines }, (_, i) => i);
  return (
    <div role="status" aria-label={ariaLabel} className="iw-skel-text" style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {items.map((i) => (
        <Skeleton
          key={i}
          height={10}
          radius={5}
          width={i === lines - 1 ? lastLineWidth : i % 3 === 1 ? '92%' : '100%'}
          ariaLabel={null}
          className="iw-skel-text-line"
        />
      ))}
    </div>
  );
}

// Round placeholder for avatars, brand marks.
export function SkeletonAvatar({ size = 36, ariaLabel = 'Loading avatar' }) {
  return (
    <Skeleton
      width={size}
      height={size}
      radius="50%"
      ariaLabel={ariaLabel}
      className="iw-skel-avatar"
    />
  );
}

// Generic card placeholder with header + lines.
export function SkeletonCard({ ariaLabel = 'Loading card', className }) {
  return (
    <div role="status" aria-label={ariaLabel} className={classNames('iw-skel-card', className)}>
      <Skeleton width={70} height={10} radius={5} ariaLabel={null} className="iw-skel-card-eyebrow" />
      <Skeleton width="55%" height={22} radius={8} ariaLabel={null} className="iw-skel-card-title" />
      <div className="iw-skel-card-body">
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

// List of N rows with optional leading shape (avatar/icon).
export function SkeletonList({ rows = 3, ariaLabel = 'Loading list', withLeading = false }) {
  const items = Array.from({ length: rows }, (_, i) => i);
  return (
    <ul role="status" aria-label={ariaLabel} className="iw-skel-list">
      {items.map((i) => (
        <li key={i} className="iw-skel-list-row">
          {withLeading && <Skeleton width={32} height={32} radius="50%" ariaLabel={null} />}
          <div className="iw-skel-list-row-body">
            <Skeleton width={i % 2 === 0 ? '72%' : '58%'} height={12} radius={5} ariaLabel={null} />
            <Skeleton width={i % 2 === 0 ? '40%' : '52%'} height={9} radius={4} ariaLabel={null} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Conversation-shaped skeleton (chat messages).
export function SkeletonConversation({ messages = 3, ariaLabel = 'Loading conversation' }) {
  const items = Array.from({ length: messages }, (_, i) => i);
  return (
    <div role="status" aria-label={ariaLabel} className="iw-skel-conversation">
      {items.map((i) => {
        const fromUser = i % 2 === 1;
        return (
          <div
            key={i}
            className={classNames(
              'iw-skel-bubble-row',
              fromUser ? 'iw-skel-bubble-row-user' : 'iw-skel-bubble-row-assistant'
            )}
          >
            <Skeleton
              width={fromUser ? '60%' : i === 0 ? '85%' : '70%'}
              height={48}
              radius={14}
              ariaLabel={null}
              className="iw-skel-bubble"
            />
          </div>
        );
      })}
    </div>
  );
}

// Account-section skeleton block — matches .account-card geometry.
export function SkeletonAccountSection({ ariaLabel = 'Loading account section' }) {
  return (
    <div role="status" aria-label={ariaLabel} className="iw-skel-account-section">
      <Skeleton width={70} height={10} radius={5} ariaLabel={null} />
      <Skeleton width="55%" height={20} radius={7} ariaLabel={null} className="iw-skel-account-section-title" />
      <div className="iw-skel-account-section-rows">
        <Skeleton width="100%" height={14} radius={5} ariaLabel={null} />
        <Skeleton width="100%" height={14} radius={5} ariaLabel={null} />
        <Skeleton width="80%" height={14} radius={5} ariaLabel={null} />
      </div>
      <Skeleton width={120} height={36} radius={10} ariaLabel={null} className="iw-skel-account-section-action" />
    </div>
  );
}

// Nav-auth placeholder — stable geometry during auth hydration so the header
// does not flash between Sign in / Create account and My account / Sign out.
export function SkeletonNavAuth({ width = 120, ariaLabel = 'Loading account controls' }) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className="iw-skel-nav-auth"
      style={{ width, height: 32, display: 'inline-block' }}
    />
  );
}