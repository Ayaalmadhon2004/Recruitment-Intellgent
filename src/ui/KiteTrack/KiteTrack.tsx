import type { CSSProperties, ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { Kite } from '../Kite';
import { cx } from '../internal/cx';
import styles from './KiteTrack.module.css';

export type KiteTrackProps = {
  /** Accessible name of the whole track. */
  label: string;
  /** Names of the previous, current and next stop. A missing stop leaves its place empty. */
  previous?: string;
  current: string;
  next?: string;
  /** 0 to 1: how far the kite has flown from the current stop toward the next one. */
  progress?: number;
  className?: string;
};

const clamp = (n: number): number => Math.min(1, Math.max(0, n));

/**
 * Three stops on a thin line (previous, current, next) with a paper kite resting on the current one.
 * As progress grows the kite flies toward the next stop. Text on the page: no box. The kite is
 * decoration; the current stop is named in text and marked with aria-current. Static under
 * prefers-reduced-motion.
 */
export function KiteTrack({
  label,
  previous,
  current,
  next,
  progress = 0,
  className,
}: KiteTrackProps): ReactNode {
  const stops = [
    { key: 'previous', name: previous, word: uiCopy.track.previous },
    { key: 'current', name: current, word: uiCopy.track.current },
    { key: 'next', name: next, word: uiCopy.track.next },
  ] as const;
  const style = { '--kite-progress': clamp(progress) } as CSSProperties;
  return (
    <div role="group" aria-label={label} className={cx(styles.root, className)} style={style}>
      <div className={styles.flight} aria-hidden="true">
        <span className={styles.kite} data-complete={progress >= 1}>
          <span className={styles.dip}>
            <Kite size="sm" wings={progress > 0 ? 'open' : 'left'} />
          </span>
        </span>
      </div>
      <div className={styles.rail} aria-hidden="true" />
      <ol className={styles.stops}>
        {stops.map((stop) => (
          <li
            key={stop.key}
            className={cx(styles.stop, stop.key === 'current' && styles.current)}
            aria-current={stop.key === 'current' ? 'step' : undefined}
          >
            {stop.name ? (
              <>
                <span className="visually-hidden">{stop.word}: </span>
                {stop.name}
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
