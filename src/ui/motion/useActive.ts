'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { useInView } from './useInView';

/**
 * For continuous animations: true only while the element is on screen and the tab is visible, so
 * loops are paused (class removed) the rest of the time.
 */
export function useActive(ref: RefObject<Element | null>): boolean {
  const onScreen = useInView(ref, { once: false, rootMargin: '0px' });
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const sync = (): void => setTabVisible(document.visibilityState !== 'hidden');
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  return onScreen && tabVisible;
}
