import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './PaperPlane.module.css';

export type PaperPlaneProps = {
  className?: string;
};

/** A folded paper plane seen from the side, nose to the right: one half blue, one half red. */
export function PaperPlane({ className }: PaperPlaneProps): ReactNode {
  return (
    <svg
      viewBox="0 0 120 70"
      className={cx(styles.plane, className)}
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.blue} d="M118 30 L2 2 L38 36 Z" />
      <path className={styles.red} d="M118 30 L38 36 L62 68 Z" />
      <path className={styles.redDeep} d="M38 36 L62 68 L22 56 Z" />
    </svg>
  );
}
