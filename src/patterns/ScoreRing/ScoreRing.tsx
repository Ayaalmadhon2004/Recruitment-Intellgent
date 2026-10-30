import type { CSSProperties, ReactNode } from 'react';
import type { Scored, ScoredGauge } from '@/domain/types';
import { bandTone } from '../internal/tone';
import { CountUp, cx } from '@/ui';
import styles from './ScoreRing.module.css';

export type ScoreRingProps = {
  /** Only a real result can be drawn. A NotScorable has no type that fits here. */
  result: Scored | ScoredGauge;
  /** Accessible name, for example "Readiness score 68 out of 100". */
  ariaLabel: string;
  /** Small text under the number, for example "out of 100". */
  caption: string;
  size?: number;
  /** Count the number up from 0 over this many ms, once, when it first scrolls into view. */
  reveal?: number;
};

/** The ring is SVG. The number is real HTML text over it, never SVG text. */
export function ScoreRing({
  result,
  ariaLabel,
  caption,
  size = 160,
  reveal,
}: ScoreRingProps): ReactNode {
  const max = result.kind === 'scored' ? 100 : 10;
  const fraction = Math.min(1, Math.max(0, result.value / max));
  const tone = result.kind === 'scored' ? bandTone(result.band) : 'neutral';
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cx(styles.ring, styles[tone])}
      style={{ ['--ring-size' as string]: `${size}px` } as CSSProperties}
    >
      <svg viewBox="0 0 180 180" className={styles.svg} aria-hidden="true" focusable="false">
        <circle cx="90" cy="90" r="70" className={styles.track} />
        <circle
          cx="90"
          cy="90"
          r="70"
          className={cx(styles.arc, 'anim-ring')}
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={(100 - fraction * 100).toFixed(1)}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className={styles.center} aria-hidden="true">
        <span className={styles.value}>
          <CountUp
            value={result.value}
            decimals={result.kind === 'scored' ? 0 : 1}
            from={reveal === undefined ? undefined : 0}
            duration={reveal}
          />
        </span>
        <span className={styles.caption}>{caption}</span>
      </div>
    </div>
  );
}
