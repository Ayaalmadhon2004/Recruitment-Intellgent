import type { ReactNode } from 'react';
import styles from './WaveDivider.module.css';

export type WaveTone = 'card' | 'page' | 'warm' | 'navy' | 'blue';

export type WaveDividerProps = {
  /** Tone of the section above the wave. */
  from: WaveTone;
  /** Tone of the section below the wave. */
  to: WaveTone;
  className?: string;
};

const WAVE_PATH = 'M0 40 C 240 0, 480 0, 720 24 S 1200 64, 1440 16 L1440 80 L0 80 Z';

/** The single decorative wave of the site: a curved seam from the hero into the rest of the page. Decorative only. */
export function WaveDivider({ from, to, className }: WaveDividerProps): ReactNode {
  const classes = [styles.divider, styles[`from-${from}`], styles[`to-${to}`], className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" focusable="false" className={styles.svg}>
        <path d={WAVE_PATH} />
      </svg>
    </div>
  );
}
