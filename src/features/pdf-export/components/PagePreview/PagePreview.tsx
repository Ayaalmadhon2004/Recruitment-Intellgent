'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './PagePreview.module.css';

export type PreviewPage = 'cover' | 'content';

export type PagePreviewProps = {
  /** Which page shows on screen. Printing always includes every page. */
  page: PreviewPage;
  ariaLabel: string;
  /** The print-mode report. */
  children: ReactNode;
  /** Drawn behind the page in sample mode: diagonal word, not read aloud. */
  watermark?: string;
  footer?: ReactNode;
};

type Fit = { scale: number; height: number | undefined };

/**
 * An A4 sheet shown at the width of its box. The real print-mode report is laid out at A4 width and scaled
 * down, so the preview is the document, not a drawing of it. Printing removes the scale.
 */
export function PagePreview({
  page,
  ariaLabel,
  children,
  watermark,
  footer,
}: PagePreviewProps): ReactNode {
  const frame = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit>({ scale: 1, height: undefined });

  useEffect(() => {
    const frameEl = frame.current;
    const paperEl = paper.current;
    if (!frameEl || !paperEl) return;
    const measure = (): void => {
      const width = paperEl.offsetWidth;
      if (!width) return;
      const scale = Math.min(1, frameEl.clientWidth / width);
      const height = paperEl.offsetHeight * scale;
      setFit((prev) => (prev.scale === scale && prev.height === height ? prev : { scale, height }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(frameEl);
    observer.observe(paperEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} className={styles.frame} style={{ height: fit.height }}>
      <div
        ref={paper}
        className={styles.paper}
        data-page={page}
        role="img"
        aria-label={ariaLabel}
        style={{ transform: `scale(${fit.scale})` }}
      >
        {children}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
        {watermark ? (
          <div className={styles.watermark} aria-hidden="true">
            {watermark}
          </div>
        ) : null}
      </div>
    </div>
  );
}
