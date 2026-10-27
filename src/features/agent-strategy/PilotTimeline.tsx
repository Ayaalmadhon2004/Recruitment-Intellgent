import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import type { PilotPlan } from '@/domain/types';
import { cx } from '@/ui';
import { fill } from './format';
import styles from './AgentStrategy.module.css';

const copy = en.agentStrategy.pilot;

/** Month ids in copy. A test keeps this in step with `agentsConfig.pilot.durationMonths`. */
export const monthKeys = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] as const;

export type PilotTimelineProps = {
  pilot: PilotPlan;
  /** 1-based. */
  month: number;
  onSelect: (month: number) => void;
};

export function PilotTimeline({ pilot, month, onSelect }: PilotTimelineProps): ReactNode {
  const vars = {
    months: pilot.durationMonths,
    agentCount: pilot.agentCount,
    min: pilot.commissionBenchmarkPercent.min,
    max: pilot.commissionBenchmarkPercent.max,
  };
  const items = monthKeys.slice(0, pilot.durationMonths).map((key, index) => ({
    n: index + 1,
    ...copy.months[key],
  }));
  const current = items.find((m) => m.n === month) ?? items[0];

  return (
    <>
      <ol className={styles.timeline} aria-label={copy.listLabel}>
        {items.map((m) => {
          const on = m.n === current?.n;
          return (
            <li key={m.n} className={styles.timelineItem}>
              <button
                type="button"
                aria-pressed={on}
                aria-label={fill(copy.monthAria, { n: m.n, title: m.title })}
                className={cx(styles.node, on && styles.nodeOn)}
                onClick={() => onSelect(m.n)}
              >
                {m.n}
              </button>
              <span className={styles.monthTitle}>{fill(copy.month, { n: m.n })}</span>
              <span className={styles.monthPhase}>{copy.phases[m.phase]}</span>
            </li>
          );
        })}
      </ol>
      {current ? (
        <div className={styles.monthPanel} role="status">
          <span className={styles.monthPanelLabel}>
            {fill(copy.detail, { n: current.n, phase: copy.phases[current.phase] })}
          </span>
          <span className={styles.monthPanelTitle}>{current.title}</span>
          <span className={styles.monthPanelBody}>{fill(current.body, vars)}</span>
        </div>
      ) : null}
    </>
  );
}
