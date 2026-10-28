import type { ReactNode } from 'react';
import { t } from '@/domain/copy';
import { en } from '@/domain/copy';
import type { PriceBand, PriceBandId } from '@/domain/types';
import { Icon, cx } from '@/ui';
import styles from './PriceBandRow.module.css';

export type PriceBandRowProps = {
  bands: readonly PriceBand[];
  current: PriceBandId;
};

/** Five bands in order. The current one carries an icon and the words "Your band", not colour alone. */
export function PriceBandRow({ bands, current }: PriceBandRowProps): ReactNode {
  const ordered = [...bands].sort((a, b) => a.minUsd - b.minUsd);
  return (
    <ol className={styles.row} aria-label={en.costCalc.bands.listLabel}>
      {ordered.map((band) => {
        const here = band.id === current;
        return (
          <li
            key={band.id}
            className={cx(styles.band, here && styles.here)}
            aria-current={here ? 'true' : undefined}
            data-here={here ? 'true' : undefined}
          >
            <span className={styles.label}>
              {here ? <Icon name="check-circle" size={20} strokeWidth={2.4} /> : null}
              {t(band.labelKey)}
            </span>
            <span className={styles.note}>
              {here ? en.costCalc.bands.yourBand : en.costCalc.bands.notes[band.id]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
