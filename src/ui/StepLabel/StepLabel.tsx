'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { duration } from '@/design/motion';
import { uiCopy } from '@/design/ui-copy';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../motion';
import styles from './StepLabel.module.css';

export type StepLabelProps = {
  /** Current number, starting at 1. */
  current: number;
  /** Optional total, shown as "Step 2 of 5". */
  total?: number;
  /** The word before the number. Defaults to "Step"; pass "Question" for question flows. */
  word?: string;
  className?: string;
};

/**
 * The one shared "Step N" / "Question N" label. When the number changes the old one fades out with a
 * 6px slide while the new one fades in (static under prefers-reduced-motion), and the label is a
 * polite live region.
 */
export function StepLabel({
  current,
  total,
  word = uiCopy.step.step,
  className,
}: StepLabelProps): ReactNode {
  const reduced = useReducedMotion();
  const last = useRef(current);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [changed, setChanged] = useState(false);

  useLayoutEffect(() => {
    if (last.current !== current && !reduced) {
      setLeaving(last.current);
      setChanged(true);
    }
    last.current = current;
  }, [current, reduced]);

  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), duration.base);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  return (
    <p
      className={[styles.label, className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <span>{word}</span>{' '}
      <span className={styles.slot}>
        {leaving !== null ? (
          <span
            key={`out-${leaving}`}
            className={cx(styles.number, 'anim-text-out')}
            aria-hidden="true"
          >
            {leaving}
          </span>
        ) : null}
        <span key={current} className={cx(styles.number, changed && 'anim-text-in')}>
          {current}
        </span>
      </span>
      {total !== undefined ? (
        <>
          {' '}
          <span>{uiCopy.step.of}</span> <span>{total}</span>
        </>
      ) : null}
    </p>
  );
}
