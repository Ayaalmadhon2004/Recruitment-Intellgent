'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Kite } from '../Kite';
import { cx } from '../internal/cx';
import { useActive, useReducedMotion } from '../motion';
import styles from './KiteBob.module.css';

export type KiteBobProps = {
  /** Announces the loading state to assistive tech. Leave out when the surrounding text already says it. */
  label?: string;
  className?: string;
};

/**
 * A tiny kite that bobs: the loading indicator, in place of spinners. The bob only runs while the
 * kite is on screen and the tab is visible, and never under reduced motion (a still kite stays).
 */
export function KiteBob({ label, className }: KiteBobProps): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const active = useActive(ref);
  const reduced = useReducedMotion();
  return (
    <span
      ref={ref}
      className={cx(styles.root, !reduced && active && styles.bob, className)}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      <Kite size="sm" wings="open" />
      {label ? <span className="visually-hidden">{label}</span> : null}
    </span>
  );
}
