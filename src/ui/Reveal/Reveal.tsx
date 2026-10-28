'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Reveal.module.css';

export type RevealProps = {
  children: ReactNode;
  /** 0 to 3, maps to the shared animation delays. */
  delay?: 0 | 1 | 2 | 3;
  className?: string;
};

type Phase = 'visible' | 'pending' | 'shown';

/** Plays the entrance animation once, when the content scrolls into view. Content is never hidden without JS. */
export function Reveal({ children, delay = 0, className }: RevealProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('visible');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
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
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={phase}
      className={cx(
        phase === 'pending' && styles.pending,
        phase === 'shown' && 'anim-up',
        phase === 'shown' && delay > 0 && `anim-delay-${delay}`,
        className,
      )}
    >
      {children}
    </div>
  );
}
