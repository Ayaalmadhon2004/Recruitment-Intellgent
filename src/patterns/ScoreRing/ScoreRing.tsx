import type { CSSProperties, ReactNode } from 'react';
import type { Scored, ScoredGauge } from '@/domain/types';
import { bandTone } from '../internal/tone';
import { AnimatedNumber, cx } from '@/ui';
import styles from './ScoreRing.module.css';

export type ScoreRingProps = {
  /** Only a real result can be drawn. A NotScorable has no type that fits here. */
  result: Scored | ScoredGauge;
  /** Accessible name, for example "Readiness score 68 out of 100". */
  ariaLabel: string;
  /** Small text under the number, for example "out of 100". */
  caption: string;
  size?: number;
};

const CIRCUMFERENCE = 2 * Math.PI * 70;

/** The ring is SVG. The number is real HTML text over it, never SVG text. */
export function ScoreRing({ result, ariaLabel, caption, size = 160 }: ScoreRingProps): ReactNode {
  const max = result.kind === 'scored' ? 100 : 10;
  const fraction = Math.min(1, Math.max(0, result.value / max));
  const formatValue = (n: number): string =>
    result.kind === 'scored' ? String(Math.round(n)) : n.toFixed(1);
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
          style={{ strokeDasharray: `${(fraction * CIRCUMFERENCE).toFixed(1)} 600` }}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className={styles.center} aria-hidden="true">
        <span className={styles.value}>
          <AnimatedNumber value={result.value} format={formatValue} />
        </span>
        <span className={styles.caption}>{caption}</span>
      </div>
    </div>
  );
}
