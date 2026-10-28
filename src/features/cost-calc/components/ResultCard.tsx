import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { ProgressBar } from '@/patterns';
import { Card } from '@/ui';
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
    <Card tone="navy" radius="lg" className={styles.card} aria-label={r.title} as="section">
      <span className={styles.eyebrow}>{r.eyebrow}</span>
      <div className={styles.headline}>
        <span className={styles.net} data-testid="net-cost">
          {usd(net)}
        </span>
        <span className={styles.per}>{r.perYear}</span>
      </div>
      <ProgressBar
        tone="inverse"
        size="lg"
        label={r.coverage}
        value={rounded}
        valueText={`${rounded}%`}
      />
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>{r.tuition}</dt>
          <dd>{usd(tuition)}</dd>
        </div>
        <div className={styles.row}>
          <dt>{r.living}</dt>
          <dd>{includeLiving ? usd(living) : r.livingExcluded}</dd>
        </div>
        <div className={styles.row}>
          <dt>{r.scholarship}</dt>
          <dd>{appliedScholarship > 0 ? `- ${usd(appliedScholarship)}` : usd(0)}</dd>
        </div>
        <div className={styles.total}>
          <dt>{r.net}</dt>
          <dd>{usd(net)}</dd>
        </div>
      </dl>
      <div className={styles.chips}>
        <span className={styles.bandChip}>{fill(r.priceBand, { band: bandLabel })}</span>
        <span className={styles.chip}>{fill(r.fourYears, { amount: usd(fourYears) })}</span>
      </div>
    </Card>
  );
}
