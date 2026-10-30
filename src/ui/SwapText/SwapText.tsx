'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { duration } from '@/design/motion';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../motion';
import styles from './SwapText.module.css';

export type SwapTextProps = {
  /** The text (or number). When it changes, the old one fades out and the new one in, with a 6px slide. */
  children: string | number;
  className?: string;
};

/**
 * Inline text that cross-fades when it changes (base duration, 6px vertical slide). Old and new share
 * one grid cell, so the width never jumps. Only the current text is read by assistive tech.
 * With reduced motion the text just changes.
 */
export function SwapText({ children, className }: SwapTextProps): ReactNode {
  const reduced = useReducedMotion();
  const last = useRef(children);
  const [leaving, setLeaving] = useState<string | number | null>(null);
  const [changed, setChanged] = useState(false);

  useLayoutEffect(() => {
    if (last.current !== children && !reduced) {
      setLeaving(last.current);
      setChanged(true);
    }
    last.current = children;
  }, [children, reduced]);

  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), duration.base);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  return (
    <span className={cx(styles.slot, className)}>
      {leaving !== null ? (
        <span
          key={`out-${leaving}`}
          className={cx(styles.item, 'anim-text-out')}
          aria-hidden="true"
        >
          {leaving}
        </span>
      ) : null}
      <span key={children} className={cx(styles.item, changed && 'anim-text-in')}>
        {children}
      </span>
    </span>
  );
}
