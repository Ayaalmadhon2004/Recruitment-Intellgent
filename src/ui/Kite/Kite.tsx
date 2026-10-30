import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Kite.module.css';

export type KiteWings = 'closed' | 'left' | 'right' | 'open';
export type KiteSize = 'sm' | 'md' | 'lg';
/** How much of the kite is drawn: 1 = left wing + spine, 2 = plus right wing, 3 = plus tail and bows. */
export type KiteProgress = 1 | 2 | 3;

export type KiteProps = {
  /** Which wings are spread: none (folded paper), one side, or both. */
  wings?: KiteWings;
  /** Draws the kite in three parts; parts not yet reached stay as a faint outline. Takes precedence over `wings`. */
  progress?: KiteProgress;
  size?: KiteSize;
  /** Accessible name. Leave out when the kite is decoration (the default): it is then hidden from assistive tech. */
  title?: string;
  className?: string;
};

const LEFT_WING = 'M50 6 L14 52 L50 110 Z';
const RIGHT_WING = 'M50 6 L86 52 L50 110 Z';
const TAIL = 'M50 110 C 40 122, 62 130, 50 142 S 42 152, 50 156';
const BOWS = 'M44 128 L56 128 M44 142 L56 142';
/** Spars stop short of the silhouette so no line pokes out of the paper. */
const SPINE = 'M50 12 V104';
const CROSSBAR_LEFT = 'M20 52 H50';
const CROSSBAR_RIGHT = 'M50 52 H80';

/** The brand paper kite: a diamond with cross-spars and a little tail. */
export function Kite({
  wings = 'open',
  progress,
  size = 'md',
  title,
  className,
}: KiteProps): ReactNode {
  if (progress) {
    const reached = (part: KiteProgress): boolean => progress >= part;
    const part = (n: KiteProgress): string =>
      cx(styles.part, reached(n) ? styles.drawn : styles.outline);
    return (
      <svg
        viewBox="0 0 100 160"
        className={cx(styles.kite, styles[size], className)}
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        focusable="false"
        data-progress={progress}
      >
        <g className={part(1)} style={{ '--part': 0 } as CSSProperties}>
          <path className={styles.leftPaper} d={LEFT_WING} />
          {reached(1) ? <path className={styles.spar} d={`${SPINE} ${CROSSBAR_LEFT}`} /> : null}
        </g>
        <g className={part(2)} style={{ '--part': 1 } as CSSProperties}>
          <path className={styles.rightPaper} d={RIGHT_WING} />
          {reached(2) ? <path className={styles.spar} d={CROSSBAR_RIGHT} /> : null}
        </g>
        <g className={part(3)} style={{ '--part': 2 } as CSSProperties}>
          <path className={styles.tail} d={TAIL} />
          <path className={styles.bow} d={BOWS} />
        </g>
      </svg>
    );
  }
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
        <path className={styles.leftPaper} d={LEFT_WING} />
      </g>
      <g className={cx(styles.wing, styles.right, !right && styles.folded)}>
        <path className={styles.rightPaper} d={RIGHT_WING} />
      </g>
      <path className={styles.spar} d={`${SPINE} ${CROSSBAR_LEFT} ${CROSSBAR_RIGHT}`} />
      <path className={styles.tail} d={TAIL} />
      <path className={styles.bow} d={BOWS} />
    </svg>
  );
}
