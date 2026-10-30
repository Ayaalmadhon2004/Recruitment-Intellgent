'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { useActive, useReducedMotion } from '../motion';
import styles from './Breathe.module.css';

export type BreatheProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A slow glow around its child (a pill button): opacity only, a 3s loop. It stops on hover and focus,
 * while off screen or in a hidden tab, and under reduced motion.
 */
export function Breathe({ children, className }: BreatheProps): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const active = useActive(ref);
  const reduced = useReducedMotion();
  return (
    <span ref={ref} className={cx(styles.root, !reduced && active && styles.on, className)}>
      {children}
    </span>
  );
}
