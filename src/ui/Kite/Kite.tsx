import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Kite.module.css';

export type KiteWings = 'closed' | 'left' | 'right' | 'open';
export type KiteSize = 'sm' | 'md' | 'lg';

export type KiteProps = {
  /** Which wings are spread: none (folded paper), one side, or both. */
  wings?: KiteWings;
  size?: KiteSize;
  /** Accessible name. Leave out when the kite is decoration (the default): it is then hidden from assistive tech. */
  title?: string;
  className?: string;
};

/** The brand paper kite: a diamond with cross-spars and a little tail. */
export function Kite({ wings = 'open', size = 'md', title, className }: KiteProps): ReactNode {
  const left = wings === 'left' || wings === 'open';
  const right = wings === 'right' || wings === 'open';
  return (
    <svg
      viewBox="0 0 100 160"
      className={cx(styles.kite, styles[size], className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-wings={wings}
    >
      <g className={cx(styles.wing, styles.left, !left && styles.folded)}>
        <path className={styles.leftPaper} d="M50 6 L14 52 L50 110 Z" />
      </g>
      <g className={cx(styles.wing, styles.right, !right && styles.folded)}>
        <path className={styles.rightPaper} d="M50 6 L86 52 L50 110 Z" />
      </g>
      <path className={styles.spar} d="M50 6 V110 M14 52 H86" />
      <path className={styles.tail} d="M50 110 C 40 122, 62 130, 50 142 S 42 152, 50 156" />
      <path className={styles.bow} d="M44 128 L56 128 M44 142 L56 142" />
    </svg>
  );
}
