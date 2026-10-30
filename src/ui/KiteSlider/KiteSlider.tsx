'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { Kite } from '../Kite';
import { cx } from '../internal/cx';
import styles from './KiteSlider.module.css';

const PERCENT = 100;

export type KiteSliderProps = {
  /** Accessible name of the slider. */
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  /** The words shown above the kite and spoken as the value, for example "Month one". */
  valueText: (value: number) => string;
  className?: string;
};

/**
 * A paper kite you slide along a dashed line, one whole step at a time. A real ARIA slider:
 * arrow keys, Home and End move it; a press or drag anywhere on the line moves it too.
 * Vertical page scroll still works on touch (`touch-action: pan-y`).
 */
export function KiteSlider({
  label,
  min,
  max,
  value,
  onChange,
  valueText,
  className,
}: KiteSliderProps): ReactNode {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const span = Math.max(max - min, 1);
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const clamp = (n: number): number => Math.min(max, Math.max(min, n));
  const set = (next: number): void => {
    const v = clamp(next);
    if (v !== value) onChange(v);
  };
  const fromPointer = (clientX: number): void => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    set(min + Math.round(ratio * span));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    thumbRef.current?.focus({ preventScroll: true });
    fromPointer(event.clientX);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (dragging) fromPointer(event.clientX);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const moves: Record<string, number> = {
      ArrowRight: value + 1,
      ArrowUp: value + 1,
      ArrowLeft: value - 1,
      ArrowDown: value - 1,
      Home: min,
      End: max,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    set(next);
  };

  const position = ((clamp(value) - min) / span) * PERCENT;
  const text = valueText(value);

  return (
    <div className={cx(styles.root, className)}>
      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span className={styles.line} aria-hidden="true" />
        {steps.map((step) => (
          <span
            key={step}
            className={cx(styles.stop, step <= value && styles.stopPassed)}
            style={{ left: `${((step - min) / span) * PERCENT}%` }}
            aria-hidden="true"
          />
        ))}
        <div
          ref={thumbRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={text}
          aria-orientation="horizontal"
          className={cx(styles.thumb, dragging && styles.dragging)}
          style={{ left: `${position}%` }}
          onKeyDown={onKeyDown}
        >
          <span className={styles.value} aria-hidden="true">
            {text}
          </span>
          <Kite size="sm" className={styles.kite} />
        </div>
      </div>
    </div>
  );
}
