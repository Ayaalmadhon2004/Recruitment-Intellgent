import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { ProgressBar } from '@/patterns';
import { AnimatedNumber } from '@/ui';
import { fill, usd } from '../format';
import styles from './ResultCard.module.css';

export type ResultCardProps = {
  tuition: number;
  living: number;
  includeLiving: boolean;
  appliedScholarship: number;
  net: number;
  coveragePercent: number;
  bandLabel: string;
  fourYears: number;
};

export function ResultCard({
  tuition,
  living,
  includeLiving,
  appliedScholarship,
  net,
  coveragePercent,
  bandLabel,
  fourYears,
}: ResultCardProps): ReactNode {
  const r = en.costCalc.result;
  const rounded = Math.round(coveragePercent);
  return (
    <section className={styles.card} aria-label={r.title}>
      <span className={styles.eyebrow}>{r.eyebrow}</span>
      <div className={styles.headline}>
        <span className={styles.net} data-testid="net-cost">
          <AnimatedNumber value={net} format={usd} />
        </span>
        <span className={styles.per}>{r.perYear}</span>
      </div>
      <ProgressBar
        size="lg"
        label={r.coverage}
        value={rounded}
        valueText={`${rounded}%`}
      />
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>{r.tuition}</dt>
          <dd>
            <AnimatedNumber value={tuition} format={usd} />
          </dd>
        </div>
        <div className={styles.row}>
          <dt>{r.living}</dt>
          <dd>
            {includeLiving ? <AnimatedNumber value={living} format={usd} /> : r.livingExcluded}
          </dd>
        </div>
        <div className={styles.row}>
          <dt>{r.scholarship}</dt>
          <dd>
            {appliedScholarship > 0 ? '- ' : null}
            <AnimatedNumber value={appliedScholarship} format={usd} />
          </dd>
        </div>
        <div className={styles.total}>
          <dt>{r.net}</dt>
          <dd>
            <AnimatedNumber value={net} format={usd} />
          </dd>
        </div>
      </dl>
      <div className={styles.chips}>
        <span className={styles.bandChip}>{fill(r.priceBand, { band: bandLabel })}</span>
        <span className={styles.chip}>{fill(r.fourYears, { amount: usd(fourYears) })}</span>
      </div>
    </section>
  );
}
