import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en, t } from '@/domain/copy';
import type { AffordabilityComponentId } from '@/domain/types';
import { affordabilityComponentIds } from '@/domain/types';
import { TbcValue } from '@/patterns';
import { Card } from '@/ui';
import styles from './AffordabilityWeights.module.css';

export type AffordabilityWeightsProps = {
  weights: Readonly<Record<AffordabilityComponentId, number>>;
};

/** Shows the six weights from config. It never turns calculator inputs into a score. */
export function AffordabilityWeights({ weights }: AffordabilityWeightsProps): ReactNode {
  const total = affordabilityComponentIds.reduce((sum, id) => sum + weights[id], 0);
  return (
    <Card tone="open" radius="lg" className={styles.card}>
      <p className={styles.intro}>{en.costCalc.weights.intro}</p>
      <ul className={styles.list} aria-label={en.costCalc.weights.listLabel}>
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
        <span>{en.costCalc.weights.total}</span>
        <span>{total}%</span>
      </p>
      <p className={styles.mapping}>
        {en.costCalc.weights.mappingLabel}{' '}
        <TbcValue value={tbcConfig.scoringFormulas} placeholder={en.status.tbc} label={en.status.pending} />
      </p>
    </Card>
  );
}
