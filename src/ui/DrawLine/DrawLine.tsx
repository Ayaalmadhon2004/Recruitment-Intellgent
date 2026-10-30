'use client';

import { useId, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { duration as durationToken } from '@/design/motion';
import { useInView, useReducedMotion } from '../motion';
import styles from './DrawLine.module.css';

export type DrawLineProps = {
  /** SVG path data. */
  d: string;
  /** Styles the visible line (stroke, width, dash pattern). */
  className?: string;
  /** Milliseconds for the draw. Default is the large duration. */
  duration?: number;
  /** Milliseconds before the draw starts. */
  delay?: number;
  /**
   * Controlled mode, 0 to 1: the line is drawn this far and nothing animates by itself. Use it for
   * scroll-tied lines. Without it the line draws once when it scrolls into view.
   */
  progress?: number;
  /** The mask path that holds the dash offset, for scroll code that sets it directly (no re-render). */
  maskRef?: Ref<SVGPathElement>;
  /** Mask stroke width: wider than the visible stroke so the line is never clipped. */
  maskWidth?: number;
};

const DEFAULT_MASK_WIDTH = 24;
const EXTENT = 100000;

/**
 * A line that draws itself left to right (or along its path). The visible path keeps its own dash
 * pattern; a solid mask draws in over it with stroke-dashoffset, so dashed lines draw cleanly. Under
 * reduced motion the line is simply drawn.
 */
export function DrawLine({
  d,
  className,
  duration = durationToken.large,
  delay = 0,
  progress,
  maskRef,
  maskWidth = DEFAULT_MASK_WIDTH,
}: DrawLineProps): ReactNode {
  const id = useId();
  const ref = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref);
  const controlled = progress !== undefined;
  const drawn = reduced || seen;
  const offset = controlled ? 1 - Math.min(1, Math.max(0, progress)) : drawn ? 0 : 1;
  const style = {
    '--draw-ms': `${duration}ms`,
    '--draw-delay': `${delay}ms`,
  } as CSSProperties;
  return (
    <g ref={ref}>
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x={-EXTENT}
        y={-EXTENT}
        width={EXTENT * 2}
        height={EXTENT * 2}
      >
        <path
          ref={maskRef}
          d={d}
          pathLength={1}
          fill="none"
          stroke="white"
          strokeWidth={maskWidth}
          strokeDasharray={1}
          strokeDashoffset={offset}
          className={controlled ? undefined : styles.mask}
          style={style}
        />
      </mask>
      <path d={d} className={className} fill="none" mask={`url(#${id})`} />
    </g>
  );
}
