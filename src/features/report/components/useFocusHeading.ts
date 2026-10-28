'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** Moves focus to the first h1 inside the returned ref whenever `key` changes to a settled state. */
export function useFocusHeading(key: string, active: boolean): RefObject<HTMLDivElement | null> {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    const heading = root.current?.querySelector('h1');
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [key, active]);
  return root;
}
