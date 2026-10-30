'use client';

import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type RevealPhase = 'visible' | 'pending' | 'shown';

/**
 * The scroll-entrance state machine behind <Reveal>, for places that cannot wrap a div (table rows).
 * 'visible' = no motion (server, reduced motion, no IntersectionObserver); 'pending' = below the
 * fold, hold at opacity 0; 'shown' = play the entrance, once. Never goes back to pending.
 */
export function useRevealPhase(ref: RefObject<Element | null>): RevealPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<RevealPhase>('visible');

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
  }, [ref, reduced]);

  return reduced ? 'visible' : phase;
}
