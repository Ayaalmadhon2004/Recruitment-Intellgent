'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

type Options = {
  /** Stay true after the first sighting (entrances run once). Default true. */
  once?: boolean;
  rootMargin?: string;
};

/**
 * True while (or once, by default) the element is on screen. Without IntersectionObserver it is
 * true at once, so nothing waits for an event that never comes.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = true, rootMargin = '0px 0px -8% 0px' }: Options = {},
): boolean {
  const supported = typeof IntersectionObserver !== 'undefined';
  const [seen, setSeen] = useState(!supported);

  useEffect(() => {
    const el = ref.current;
    if (!el || !supported) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) {
          setSeen(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setSeen(false);
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, rootMargin, supported]);

  return seen;
}
