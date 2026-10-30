'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { distance } from '@/design/motion';
import { DrawLine, Kite, useReducedMotion } from '@/ui';
import styles from './ScrollCompanion.module.css';

export type ScrollCompanionProps = {
  /** Extra class for positioning overrides. */
  className?: string;
};

/** Share of the path kept clear at each end so the whole kite stays on screen. */
const EDGE = 0.04;

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

/** Scrolling stops being "now" after this long, and the kite eases back upright. */
const IDLE_MS = 140;

/**
 * A small paper kite that follows the page scroll along a dashed path. The path draws itself up to the
 * kite as you scroll, and the kite tilts a few degrees with the direction of travel, then settles back.
 * One passive scroll listener, throttled with rAF; positions are written straight to styles with no
 * layout reads in the loop. Not rendered under prefers-reduced-motion.
 */
export function ScrollCompanion({ className }: ScrollCompanionProps): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const kiteRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const measure = (): void => setSize({ width: root.clientWidth, height: root.clientHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [reduced]);

  useEffect(() => {
    const path = maskRef.current;
    const kite = kiteRef.current;
    const tilt = tiltRef.current;
    if (reduced || !size || !path || !kite || !tilt || typeof path.getTotalLength !== 'function')
      return;
    // Geometry is read once per layout, not per scroll event.
    const total = path.getTotalLength();
    let scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const remeasure = (): void => {
      scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    let frame = 0;
    let lastY = window.scrollY;
    let lastTilt = 0;
    let idle = 0;
    const setTilt = (deg: number): void => {
      if (deg === lastTilt) return;
      lastTilt = deg;
      tilt.style.transform = `rotate(${deg}deg)`;
    };
    const place = (): void => {
      frame = 0;
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / scrollable));
      const along = (EDGE + progress * (1 - 2 * EDGE)) * total;
      const here = path.getPointAtLength(along);
      const ahead = path.getPointAtLength(Math.min(total, along + 4));
      kite.style.transform = `translate(${here.x}px, ${here.y}px) translate(-50%, -50%)`;
      path.style.strokeDashoffset = String(1 - Math.min(1, along / total + 0.02));
      const down = Math.sign(y - lastY);
      lastY = y;
      if (down !== 0) {
        // Lean toward the side the kite is heading; flip when scrolling back up.
        const side = Math.sign(ahead.x - here.x) || 1;
        setTilt(down * side * distance.tilt);
        window.clearTimeout(idle);
        idle = window.setTimeout(() => setTilt(0), IDLE_MS);
      }
    };
    const onScroll = (): void => {
      if (frame === 0) frame = window.requestAnimationFrame(place);
    };

    place();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
      window.clearTimeout(idle);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [size, reduced]);

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      hidden={reduced || undefined}
      data-print="hide"
    >
      {size && !reduced ? (
        <svg className={styles.svg} width={size.width} height={size.height} focusable="false">
          <DrawLine d={buildPath(size)} className={styles.path} progress={0} maskRef={maskRef} />
        </svg>
      ) : null}
      <div ref={kiteRef} className={styles.kite}>
        <div ref={tiltRef} className={styles.tilt}>
          <Kite size="sm" />
        </div>
      </div>
    </div>
  );
}
