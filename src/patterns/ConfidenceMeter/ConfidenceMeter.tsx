import type { ReactNode } from 'react';
import type { Confidence } from '@/domain/types';
import { cx } from '@/ui';
import styles from './ConfidenceMeter.module.css';

export type ConfidenceMeterProps = {
  /** "none" is for an answer marked Unknown: no confidence to show yet. */
  level: Confidence | 'none';
  /** For example "Confidence". */
  label: string;
  /** The word for the level, for example "High". */
  levelLabel: string;
  /** Plain-English meaning, shown as a tooltip. The same text is also written out on the page. */
  hint?: string;
};

const filled: Record<Confidence | 'none', number> = { high: 3, medium: 2, low: 1, none: 0 };

export function ConfidenceMeter({
  level,
  label,
  levelLabel,
  hint,
}: ConfidenceMeterProps): ReactNode {
  return (
    <span className={styles.meter} data-confidence={level} title={hint}>
      <span className={styles.bars} aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            data-filled={n <= filled[level]}
            className={cx(styles.bar, n <= filled[level] && styles.on)}
          />
        ))}
      </span>
      <span>
        {label}: {levelLabel}
      </span>
    </span>
  );
}
