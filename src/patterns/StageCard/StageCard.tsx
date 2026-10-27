import type { ReactNode } from 'react';
import type { NotScorable, Stage, StageId, StageResult } from '@/domain/types';
import { Stepper } from '@/ui';
import { NotScorableState } from '../NotScorableState';
import type { NotScorableLabels } from '../NotScorableState';
import styles from './StageCard.module.css';

export type StageCardLabels = {
  /** Accessible name of the stage list. */
  listLabel: string;
  /** "Passed", "You are here", "Ahead" */
  stateLabels: { done: string; current: string; upcoming: string };
  notScorable: NotScorableLabels;
  /** Heading for a staged result, for example "You are building". */
  headline: (stage: StageId) => string;
};

export type StageCardProps = {
  result: StageResult;
  stages: readonly Stage[];
  /** Visible name of each stage's range, for example "6-15 students". */
  rangeLabels: Record<StageId, string>;
  labels: StageCardLabels;
  eyebrow: string;
};

export function StageCard({
  result,
  stages,
  rangeLabels,
  labels,
  eyebrow,
}: StageCardProps): ReactNode {
  if (result.kind === 'not-scorable') {
    return (
      <section className={styles.card}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <NotScorableState result={result satisfies NotScorable} labels={labels.notScorable} />
      </section>
    );
  }
  const current = Math.max(
    0,
    stages.findIndex((s) => s.id === result.stage),
  );
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.title}>{labels.headline(result.stage)}</h2>
      </div>
      <Stepper
        label={labels.listLabel}
        current={current}
        stateLabels={labels.stateLabels}
        steps={stages.map((s) => ({ id: s.id, label: rangeLabels[s.id] }))}
      />
    </section>
  );
}
