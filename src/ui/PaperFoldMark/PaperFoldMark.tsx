import type { ReactNode } from 'react';

export type PaperFoldMarkProps = {
  size?: number;
  /** Set when the mark carries meaning; otherwise it is decorative. */
  title?: string;
  className?: string;
};

export function PaperFoldMark({ size = 36, title, className }: PaperFoldMarkProps): ReactNode {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <polygon points="6,66 54,4 54,50" fill="var(--color-navy-mid)" />
      <polygon points="6,66 54,50 32,94" fill="var(--color-navy-soft)" />
      <polygon points="58,4 94,52 36,92" fill="var(--color-crimson)" />
      <polygon points="58,4 36,92 58,56" fill="var(--color-crimson-dark)" />
    </svg>
  );
}
