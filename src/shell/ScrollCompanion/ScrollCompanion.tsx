'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Kite } from '@/ui';
import styles from './ScrollCompanion.module.css';

export type ScrollCompanionProps = {
  /** Extra class for positioning overrides. */
  className?: string;
};

type Size = { width: number; height: number };

/** A wavy vertical path, in the pixel space of the container. */
export function buildPath({ width, height }: Size): string {
  const mid = width / 2;
  const swing = width * 0.32;
  const steps = Math.max(2, Math.round(height / 220));
  const stepH = height / steps;
  let d = `M${mid} 0`;
  for (let i = 0; i < steps; i += 1) {
    const dir = i % 2 === 0 ? 1 : -1;
    const y0 = i * stepH;
    d += ` C ${mid + swing * dir} ${y0 + stepH * 0.33}, ${mid + swing * dir} ${y0 + stepH * 0.66}, ${mid} ${y0 + stepH}`;
  }
  return d;
}

/**
 * A small paper kite that follows the page scroll along a dashed path. On narrow screens the path and
 * kite are smaller; under prefers-reduced-motion the kite stays still at the top of the path.
 */
export function ScrollCompanion({ className }: ScrollCompanionProps): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const kiteRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = (): void => setSize({ width: root.clientWidth, height: root.clientHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const kite = kiteRef.current;
    if (!size || !path || !kite || typeof path.getTotalLength !== 'function') return;
    const total = path.getTotalLength();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    let frame = 0;
    const place = (): void => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        reduce?.matches || scrollable <= 0
          ? 0
          : Math.min(1, Math.max(0, window.scrollY / scrollable));
      const here = path.getPointAtLength(progress * total);
      const ahead = path.getPointAtLength(Math.min(total, progress * total + 4));
      const tilt = reduce?.matches
        ? 0
        : (Math.atan2(ahead.x - here.x, ahead.y - here.y || 1) * -90) / Math.PI;
      kite.style.transform = `translate(${here.x}px, ${here.y}px) translate(-50%, 0) rotate(${tilt}deg)`;
    };
    const onScroll = (): void => {
      if (frame === 0) frame = window.requestAnimationFrame(place);
    };

    place();
    if (reduce?.matches) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [size]);

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-print="hide"
    >
      {size ? (
        <svg className={styles.svg} width={size.width} height={size.height} focusable="false">
          <path ref={pathRef} d={buildPath(size)} className={styles.path} />
        </svg>
      ) : null}
      <div ref={kiteRef} className={styles.kite}>
        <Kite size="sm" />
      </div>
    </div>
  );
}
