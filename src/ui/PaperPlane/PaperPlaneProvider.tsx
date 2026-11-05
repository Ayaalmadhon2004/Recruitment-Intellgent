'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { MOBILE_MAX_WIDTH, plane } from '@/design/motion';
import { PaperPlane } from './PaperPlane';
import styles from './PaperPlaneProvider.module.css';
import { prefersReducedMotion } from '../motion';

/** Opens a page. The app passes its router in, so this primitive knows nothing about routing. */
export type PlaneNavigate = (href: string) => void;

/** Starts a flight from `origin` (default: the focused element, which is the button just pressed) and opens `href`. */
export type FlyTo = (href: string, origin?: Element | null) => void;

const PlaneContext = createContext<FlyTo | undefined>(undefined);

/** The flight function, or undefined where there is no provider (then links just navigate). */
export function usePaperPlane(): FlyTo | undefined {
  return useContext(PlaneContext);
}

/** True for a link that stays on this site and opens in this tab. */
export function isInternalHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

type Point = { x: number; y: number };

/** Points along a curve from the button up and out past the top-right corner, with the heading at each. */
export function flightPath(
  from: Point,
  viewport: { width: number; height: number },
): Array<Point & { angle: number }> {
  const end: Point = { x: viewport.width + 120, y: -120 };
  // The control point lifts the plane first, then lets it sweep out.
  const control: Point = {
    x: from.x + (end.x - from.x) * 0.25,
    y: from.y - viewport.height * 0.55,
  };
  const steps = 14;
  const at = (t: number): Point => ({
    x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x,
    y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y,
  });
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const a = at(t);
    const b = at(Math.min(1, t + 0.02));
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    return { ...a, angle };
  });
}

export type PaperPlaneProviderProps = {
  navigate: PlaneNavigate;
  children: ReactNode;
};

/**
 * Wraps the app once. `flyTo` launches the paper plane from a button, opens the next page while the
 * plane is still in the air, and lets it finish its flight across the new page. Under reduced motion
 * the page simply opens. The overlay lives here, above the pages, so a route change cannot cut it off.
 */
export function PaperPlaneProvider({ navigate, children }: PaperPlaneProviderProps): ReactNode {
  const stage = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flyTo = useCallback<FlyTo>((href, origin) => {
    const go = (): void => navigateRef.current(href);
    const node = stage.current;
    const active = document.activeElement;
    const source =
      origin ?? (active instanceof Element && active !== document.body ? active : null);
    if (busy.current) return;
    if (
      !node ||
      !source ||
      source === document.body ||
      prefersReducedMotion() ||
      typeof node.animate !== 'function'
    ) {
      go();
      return;
    }
    busy.current = true;
    const rect = source.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const size = viewport.width <= MOBILE_MAX_WIDTH ? plane.sizeMobile : plane.size;
    const start: Point = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const path = flightPath(start, viewport);
    node.style.width = `${size}px`;
    node.hidden = false;
    const frames: Keyframe[] = path.map((p, i) => {
      const t = i / (path.length - 1);
      return {
        offset: t,
        opacity: t < 0.06 ? t / 0.06 : t > 0.9 ? (1 - t) / 0.1 : 1,
        transform: `translate(${p.x - size / 2}px, ${p.y - size * 0.3}px) rotate(${p.angle}deg) scale(${0.5 + 0.5 * Math.min(1, t * 3)})`,
      };
    });
    const flight = node.animate(frames, {
      duration: plane.flight,
      easing: 'ease-in',
      fill: 'both',
    });
    timer.current = window.setTimeout(go, plane.navigateAt);
    const done = (): void => {
      node.hidden = true;
      busy.current = false;
    };
    flight.onfinish = done;
    flight.oncancel = done;
  }, []);

  const value = useMemo(() => flyTo, [flyTo]);

  return (
    <PlaneContext.Provider value={value}>
      {children}
      <div ref={stage} className={styles.stage} aria-hidden="true" hidden>
        <PaperPlane />
      </div>
    </PlaneContext.Provider>
  );
}
