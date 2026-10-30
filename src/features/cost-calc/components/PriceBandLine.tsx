import type { ReactNode } from 'react';
import { strategyCopy } from '@/design/ui-copy';
import { en, t } from '@/domain/copy';
import type { PriceBand, PriceBandId } from '@/domain/types';
import { BubblePopover, cx } from '@/ui';
import { fill, usd } from '../format';
import styles from './PriceBandLine.module.css';

const PERCENT = 100;

export type PriceBandLineProps = {
  bands: readonly PriceBand[];
  /** The band the net price falls in. */
  current: PriceBandId;
  /** Net annual price in USD. */
  net: number;
};

/**
 * One thin line for the current band: a small dot at each end with its number above, a bigger dot
 * for the net price, and a bubble for the details. A band with no upper limit borrows the width of
 * the band below it, only to place the dot; its end is shown as open, not as a number.
 */
export function PriceBandLine({ bands, current, net }: PriceBandLineProps): ReactNode {
  const ordered = [...bands].sort((a, b) => a.minUsd - b.minUsd);
  const index = ordered.findIndex((b) => b.id === current);
  const band = ordered[index];
  if (!band) return null;

  const below = ordered[index - 1];
  const openEnd = band.maxUsd === null;
  const high = band.maxUsd ?? band.minUsd + (below ? band.minUsd - below.minUsd : 1);
  const width = Math.max(high - band.minUsd, 1);
  const place = Math.min(1, Math.max(0, (net - band.minUsd) / width)) * PERCENT;
  const label = t(band.labelKey);

  return (
    <div
      className={styles.root}
      role="group"
      aria-label={fill(strategyCopy.priceLineLabel, { band: label })}
      data-testid="price-band"
      data-band={band.id}
    >
      <p className={styles.heading}>
        <span className={styles.band}>{label}</span>
        <span className={styles.note}>{en.costCalc.bands.yourBand}</span>
        <BubblePopover label={strategyCopy.priceDetailsLabel}>
          {strategyCopy.priceDetails}
        </BubblePopover>
      </p>
      <div className={styles.stage}>
        <span className={styles.line} aria-hidden="true" />
        <div className={cx(styles.point, styles.min)}>
          <span className={styles.above}>
            <span className={styles.caption}>{strategyCopy.priceMin}</span>
            <span className={styles.number}>{usd(band.minUsd)}</span>
          </span>
          <span className={styles.dot} aria-hidden="true" />
        </div>
        <div className={cx(styles.point, styles.max)}>
          <span className={styles.above}>
            <span className={styles.caption}>{strategyCopy.priceMax}</span>
            <span className={styles.number}>
              {band.maxUsd === null ? strategyCopy.priceOpenEnd : usd(band.maxUsd)}
            </span>
          </span>
          <span className={cx(styles.dot, openEnd && styles.dotOpen)} aria-hidden="true" />
        </div>
        <div className={styles.point} style={{ left: `${place}%` }}>
          <span className={styles.dotBig} aria-hidden="true" />
          <span className={styles.expectedLabel}>
            <span className={styles.caption}>{strategyCopy.priceExpected}</span>
            <span className={styles.number}>{usd(net)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
