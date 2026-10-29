'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type AnimatedNumberProps = {
  value: number;
  /** Turns the in-between numbers into text, for example as dollars. Defaults to a rounded integer. */
  format?: (value: number) => string;
  /** Fixed decimals when no `format` is given. Serialisable, so it works from a server component. */
  decimals?: number;
  /** Milliseconds. Keep it under the data duration token (600ms) so inputs still feel immediate. */
  duration?: number;
};

const DEFAULT_DURATION_MS = 450;
const CUBIC = 3;

const easeOut = (t: number): number => 1 - Math.pow(1 - t, CUBIC);
const defaultFormat = (n: number): string => String(Math.round(n));

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Counts to the new value when it changes. The first render shows the value as is (no count-up on
 * load, and server and client markup match). With reduced motion the number jumps straight there.
 * Screen readers should get the real value from a label on the parent, not from this text.
 */
export function AnimatedNumber({
  value,
  format,
  decimals,
  duration = DEFAULT_DURATION_MS,
}: AnimatedNumberProps): ReactNode {
  const [shown, setShown] = useState(value);
  const latest = useRef(value);

  useEffect(() => {
    if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') return;
    const from = latest.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      latest.current = t === 1 ? value : from + (value - from) * easeOut(t);
      setShown(latest.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  // Reduced motion (or no rAF): `shown` never moves, so show the target directly.
  const reduced = typeof window !== 'undefined' && prefersReducedMotion();
  const current = reduced ? value : shown;
  if (format) return format(current);
  return decimals === undefined ? defaultFormat(current) : current.toFixed(decimals);
}
