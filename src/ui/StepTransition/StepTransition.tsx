'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { duration } from '@/design/motion';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../motion';
import styles from './StepTransition.module.css';

export type StepTransitionProps = {
  /** Changes when the step changes. */
  stepKey: string | number;
  /** Which way the person moved. Back reverses the motion. */
  direction?: 'forward' | 'back';
  children: ReactNode;
  className?: string;
};

type Exit = { key: string | number; node: ReactNode };

/**
 * Swaps one step for the next: the old one fades and moves up (12px) while the new one fades in
 * rising from below; back reverses. The old step stays only for the base duration, out of the flow
 * (no layout shift), inert and hidden from assistive tech. Do not put refs or focus targets inside.
 * With reduced motion the new step simply replaces the old one.
 */
export function StepTransition({
  stepKey,
  direction = 'forward',
  children,
  className,
}: StepTransitionProps): ReactNode {
  const reduced = useReducedMotion();
  const latest = useRef<Exit>({ key: stepKey, node: children });
  const [exit, setExit] = useState<Exit | null>(null);
  const [entering, setEntering] = useState(false);

  useLayoutEffect(() => {
    if (latest.current.key !== stepKey && !reduced) {
      setExit(latest.current);
      setEntering(true);
    }
    latest.current = { key: stepKey, node: children };
  }, [stepKey, children, reduced]);

  useEffect(() => {
    if (!exit) return;
    const timer = window.setTimeout(() => setExit(null), duration.base);
    return () => window.clearTimeout(timer);
  }, [exit]);

  const way = direction === 'forward' ? 'next' : 'back';
  return (
    <div className={cx(styles.root, className)}>
      {exit ? (
        <div
          key={`exit-${exit.key}`}
          className={cx(styles.exit, `anim-exit-${way}`)}
          aria-hidden="true"
          inert
        >
          {exit.node}
        </div>
      ) : null}
      <div key={stepKey} className={cx(entering && `anim-step-${way}`)}>
        {children}
      </div>
    </div>
  );
}
