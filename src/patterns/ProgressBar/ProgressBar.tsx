import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/ui';
import styles from './ProgressBar.module.css';

export type ProgressBarProps = {
  value: number;
  max?: number;
  label: string;
  /** Text shown and spoken for the value, for example "18 of 24". */
  valueText: string;
  tone?: 'navy' | 'strong' | 'inverse';
  size?: 'md' | 'lg';
};

export function ProgressBar({
  value,
  max = 100,
  label,
  valueText,
  tone = 'navy',
  size = 'md',
}: ProgressBarProps): ReactNode {
  const id = useId();
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cx(styles.wrap, styles[tone])}>
      <div className={styles.head}>
        <span id={id}>{label}</span>
        <span>{valueText}</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        className={cx(styles.track, styles[size])}
      >
        <div className={cx(styles.fill, 'anim-grow')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
