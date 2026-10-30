import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Icon } from '../Icon';
import styles from './SaveDot.module.css';

export type SaveDotProps = {
  status: 'idle' | 'saving' | 'saved';
  /** What the status says in words. Read by assistive tech only; the dot itself carries no text. */
  label: string;
  className?: string;
};

/**
 * A small dot in the corner for autosave. Pastel while idle or saving; after each save it lights
 * navy with a tiny check for 1.5s, then settles back. No visible text. With reduced motion the
 * navy check simply stays while the status is "saved".
 */
export function SaveDot({ status, label, className }: SaveDotProps): ReactNode {
  return (
    <div
      className={cx(styles.root, status === 'saved' && styles.saved, className)}
      data-print="hide"
    >
      <span className={styles.dot} aria-hidden="true">
        <span className={styles.lit}>
          <Icon name="check" size={12} strokeWidth={3} />
        </span>
      </span>
      <p role="status" aria-live="polite" className="visually-hidden">
        {label}
      </p>
    </div>
  );
}
