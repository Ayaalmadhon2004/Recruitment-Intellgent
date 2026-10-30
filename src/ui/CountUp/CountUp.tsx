'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { countDuration, easeOutCubic } from '@/design/motion';
import { useInView, useReducedMotion } from '../motion';
import styles from './CountUp.module.css';

export type CountUpProps = {
  value: number;
  /** Turns the in-between numbers into text, for example as dollars. Defaults to a rounded integer. */
  format?: (value: number) => string;
  /** Fixed decimals when no `format` is given. Serialisable, so it works from a server component. */
  decimals?: number;
  /** Milliseconds. Default is the score count (500ms). */
  duration?: number;
  /**
   * Count up from this number the first time the element is on screen (once). Without it the number
   * only moves when `value` changes, and the first render shows the value as is.
   */
  from?: number;
};

const defaultFormat = (n: number): string => String(Math.round(n));
const subscribeNever = (): (() => void) => () => undefined;

/**
 * A number that counts to its value. The server (and no-JS) markup always holds the final value; the
 * width of the final text is reserved so counting never shifts the layout. With reduced motion the
 * number is simply the value. Screen readers should get the real value from a label on the parent.
 */
export function CountUp({
  value,
  format,
  decimals,
  duration = countDuration.score,
  from,
}: CountUpProps): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const ready = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const inView = useInView(ref);
  const armed = from !== undefined;
  const [shown, setShown] = useState(value);
  const latest = useRef(value);
  const started = useRef(false);

  const text = (n: number): string => {
    if (format) return format(n);
    return decimals === undefined ? defaultFormat(n) : n.toFixed(decimals);
  };

  useLayoutEffect(() => {
    // Armed counters wait at `from` until they are seen; set it before the first paint.
    if (!armed || reduced || started.current) return;
    latest.current = from;
    setShown(from);
  }, [armed, reduced, from]);

  useEffect(() => {
    if (reduced || typeof requestAnimationFrame === 'undefined') return;
    if (armed && !started.current) {
      if (!inView) return;
      started.current = true;
    }
    const begin = latest.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      latest.current = t === 1 ? value : begin + (value - begin) * easeOutCubic(t);
      setShown(latest.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduced, armed, inView]);

  const waiting = ready && !reduced && armed && !inView;
  const current = reduced || !ready ? value : waiting ? from : shown;
  return (
    <span ref={ref} className={styles.root} data-final={text(value)}>
      {text(current)}
    </span>
  );
}
