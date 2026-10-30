'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { useReducedMotion } from '../motion';
import styles from './Reveal.module.css';

export type RevealProps = {
  children: ReactNode;
  /** Position among siblings (0-based). Items stagger by the stagger token; beyond the cap they arrive together. */
  index?: number;
  className?: string;
};

type Phase = 'visible' | 'pending' | 'shown';

/**
 * Fade-rise entrance, once, when the content scrolls into view. Content is never hidden without JS,
 * and with reduced motion it is simply there. Only opacity and transform move, so nothing shifts.
 */
export function Reveal({ children, index = 0, className }: RevealProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('visible');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setPhase('shown');
      return;
    }
    setPhase('pending');
    // Trigger slightly inside the viewport so the entrance is seen, not missed at the edge.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const shown = !reduced && phase === 'shown';
  return (
    <div
      ref={ref}
      data-reveal={reduced ? 'visible' : phase}
      style={{ '--i': index } as CSSProperties}
      className={cx(
        !reduced && phase === 'pending' && styles.pending,
        shown && 'anim-up',
        shown && 'anim-stagger',
        className,
      )}
    >
      {children}
    </div>
  );
}
