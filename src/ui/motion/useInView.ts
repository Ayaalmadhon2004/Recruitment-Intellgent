'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';

type Options = {
  /** Stay true after the first sighting (entrances run once). Default true. */
  once?: boolean;
  rootMargin?: string;
};

const subscribeNever = (): (() => void) => () => undefined;

/**
 * True while (or once, by default) the element is on screen. Without IntersectionObserver it turns
 * true right after mount, so nothing waits for an event that never comes. The first render is
 * always false, on the server and the client, so hydration markup matches.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = true, rootMargin = '0px 0px -8% 0px' }: Options = {},
): boolean {
  const noObserver = useSyncExternalStore(
    subscribeNever,
    () => typeof IntersectionObserver === 'undefined',
    () => false,
  );
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || noObserver) return;
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
  }, [ref, once, rootMargin, noObserver]);

  return seen || noObserver;
}
