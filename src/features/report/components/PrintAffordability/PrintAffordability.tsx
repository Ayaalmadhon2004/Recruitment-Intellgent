import type { ReactNode } from 'react';
import { scoringConfig, tbcConfig } from '@/domain/config';
import { en, t } from '@/domain/copy';
import { affordabilityComponentIds } from '@/domain/types';
import type { AffordabilityComponentId } from '@/domain/types';
import { TbcValue } from '@/patterns';
import { SectionHeader } from '@/shell';
import styles from './PrintAffordability.module.css';

export type PrintAffordabilityProps = {
  /** Defaults to the config; passed in so tests can swap them. */
  weights?: Readonly<Record<AffordabilityComponentId, number>>;
};

const copy = en.report.print.afford;

/** The Affordability result and the six confirmed weights. It never turns inputs into a component score. */
export function PrintAffordability({
  weights = scoringConfig.affordabilityWeights,
}: PrintAffordabilityProps): ReactNode {
  const total = affordabilityComponentIds.reduce((sum, id) => sum + weights[id], 0);
  return (
    <section className={styles.section} aria-labelledby="print-afford-title">
      <SectionHeader id="print-afford-title" eyebrow={copy.eyebrow} title={copy.title} />
      <ul className={styles.list} aria-label={copy.listLabel}>
        {affordabilityComponentIds.map((id) => (
          <li key={id} className={styles.item}>
            <span className={styles.name}>{t(`affordabilityComponents.${id}`)}</span>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.fill} style={{ width: `${weights[id]}%` }} />
            </span>
            <span className={styles.value}>{weights[id]}%</span>
          </li>
        ))}
      </ul>
      <p className={styles.total}>
        <span>{copy.total}</span>
        <span>{total}%</span>
      </p>
      <p className={styles.mapping}>
        {copy.mappingLabel}{' '}
        <TbcValue value={tbcConfig.scoringFormulas} placeholder={en.status.tbc} label={en.status.pending} />
      </p>
    </section>
  );
}
