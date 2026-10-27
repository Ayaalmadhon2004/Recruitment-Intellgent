'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Icon } from '../Icon';
import styles from './Carousel.module.css';

export type CarouselSlide = { id: string; content: ReactNode };

export type CarouselProps = {
  slides: readonly CarouselSlide[];
  /** Accessible name of the whole carousel. */
  label: string;
  labels: {
    previous: string;
    next: string;
    /** Accessible name of the dot group. */
    dots: string;
    goTo: (position: number) => string;
    slide: (position: number, total: number) => string;
  };
};

const SWIPE_THRESHOLD = 40;

/** No autoplay. Previous and next buttons, labelled dots, arrow keys and swipe. */
export function Carousel({ slides, label, labels }: CarouselProps): ReactNode {
  const base = useId();
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const total = slides.length;

  const go = (to: number): void => setIndex(((to % total) + total) % total);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>): void => {
    startX.current = e.clientX;
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>): void => {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    startX.current = null;
    if (delta <= -SWIPE_THRESHOLD) go(index + 1);
    else if (delta >= SWIPE_THRESHOLD) go(index - 1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={styles.root}
      onKeyDown={onKeyDown}
    >
      <div className={styles.controls}>
        <button
          type="button"
          aria-label={labels.previous}
          className={styles.prev}
          onClick={() => go(index - 1)}
        >
          <Icon name="chevron-left" size={20} strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label={labels.next}
          className={styles.next}
          onClick={() => go(index + 1)}
        >
          <Icon name="chevron-right" size={20} strokeWidth={2.6} />
        </button>
      </div>
      <div className={styles.viewport} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="off"
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              id={`${base}-slide-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={labels.slide(i + 1, total)}
              aria-hidden={i !== index}
              inert={i !== index}
              className={styles.slide}
            >
              {s.content}
            </div>
          ))}
        </div>
      </div>
      <div role="group" aria-label={labels.dots} className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={labels.goTo(i + 1)}
            aria-current={i === index ? 'true' : undefined}
            aria-controls={`${base}-slide-${i}`}
            className={cx(styles.dot, i === index && styles.dotActive)}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
