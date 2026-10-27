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
};

const filled: Record<Confidence | 'none', number> = { high: 3, medium: 2, low: 1, none: 0 };

export function ConfidenceMeter({ level, label, levelLabel }: ConfidenceMeterProps): ReactNode {
  return (
    <span className={styles.meter} data-confidence={level}>
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
