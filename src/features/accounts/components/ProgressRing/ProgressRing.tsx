import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/ui';
import styles from './ProgressRing.module.css';

export type ProgressRingProps = {
  /** Whole number, 0 to 100. */
  percent: number;
  tone: 'crimson' | 'strong';
  /** Accessible name, for example "Northbridge University audit 70 percent complete". */
  ariaLabel: string;
  size?: number;
};

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Completion of an audit. It is progress, not a score, so it has no band. The number is real text. */
export function ProgressRing({
  percent,
  tone,
  ariaLabel,
  size = 92,
}: ProgressRingProps): ReactNode {
  const fraction = Math.min(1, Math.max(0, percent / 100));
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cx(styles.ring, styles[tone])}
      style={{ ['--ring-size' as string]: `${size}px` } as CSSProperties}
    >
      <svg viewBox="0 0 100 100" className={styles.svg} aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r={RADIUS} className={styles.track} />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className={cx(styles.arc, 'anim-ring')}
          strokeDasharray={`${(fraction * CIRCUMFERENCE).toFixed(1)} 600`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className={styles.value} aria-hidden="true">
        {percent}%
      </span>
    </div>
  );
}
