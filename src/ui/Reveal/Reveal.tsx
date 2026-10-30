'use client';

import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { useRevealPhase } from '../motion';
import styles from './Reveal.module.css';

export type RevealProps = {
  children: ReactNode;
  /** Position among siblings (0-based). Items stagger by the stagger token; beyond the cap they arrive together. */
  index?: number;
  className?: string;
};

/**
 * Fade-rise entrance, once, when the content scrolls into view. Content is never hidden without JS,
 * and with reduced motion it is simply there. Only opacity and transform move, so nothing shifts.
 */
export function Reveal({ children, index = 0, className }: RevealProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref);
  return (
    <div
      ref={ref}
      data-reveal={phase}
      style={{ '--i': index } as CSSProperties}
      className={cx(
        phase === 'pending' && styles.pending,
        phase === 'shown' && 'anim-up anim-stagger',
        className,
      )}
    >
      {children}
    </div>
  );
}
