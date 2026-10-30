'use client';

import { useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from '@/design/motion';

function subscribe(onChange: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => undefined;
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener?.('change', onChange);
  return () => query.removeEventListener?.('change', onChange);
}

/** Read once, outside React (event handlers, timers). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/**
 * True when the visitor asked for no movement. On the server this is false, so markup matches; the
 * client corrects it on hydration. Every motion primitive reads this one hook.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
