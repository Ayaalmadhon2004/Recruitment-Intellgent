import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './PaperPlane.module.css';

export type PaperPlaneProps = {
  className?: string;
};

/**
 * A folded paper plane, nose to the right: a wide flat wing in blue, the folded wing and keel in red
 * with a darker crease. Drawn like the real thing, not as two triangles.
 */
export function PaperPlane({ className }: PaperPlaneProps): ReactNode {
  return (
    <svg
      viewBox="0 0 160 90"
      className={cx(styles.plane, className)}
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.blue} d="M158 46 L6 4 L62 44 Z" />
      <path className={styles.blueEdge} d="M6 4 L62 44 L40 36 Z" />
      <path className={styles.red} d="M158 46 L62 44 L22 84 Z" />
      <path className={styles.redDeep} d="M158 46 L62 44 L104 62 Z" />
      <path className={styles.crease} d="M158 46 L62 44" />
    </svg>
  );
}
