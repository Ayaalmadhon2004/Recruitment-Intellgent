import { useState } from 'react';
import type { ReactNode } from 'react';
import { strategyCopy } from '@/design/ui-copy';
import { en } from '@/domain/copy';
import type { PilotPlan } from '@/domain/types';
import { KiteSlider, StepTransition } from '@/ui';
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

/** Spelled-out month name ("Month one"), falling back to "Month 7" past the list. */
export function monthName(n: number): string {
  return strategyCopy.monthNames[n - 1] ?? fill(strategyCopy.monthFallback, { n });
}

/** A kite you slide along a dashed line from the first to the last pilot month; the month's detail follows it. */
export function PilotTimeline({ pilot, month, onSelect }: PilotTimelineProps): ReactNode {
  // Which way the kite moved, so the month detail leaves and arrives in the matching direction.
  const [previous, setPrevious] = useState(month);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  if (previous !== month) {
    setDirection(month > previous ? 'forward' : 'back');
    setPrevious(month);
  }
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
  if (!current) return null;

  return (
    <>
      <KiteSlider
        label={strategyCopy.pilotSliderLabel}
        min={1}
        max={items.length}
        value={current.n}
        onChange={onSelect}
        valueText={monthName}
      />
      <div className={styles.monthPanel} role="status">
        <StepTransition stepKey={current.n} direction={direction}>
          <div className={styles.monthPanelText}>
            <span className={styles.monthPanelLabel}>
              {fill(copy.detail, { n: current.n, phase: copy.phases[current.phase] })}
            </span>
            <span className={styles.monthPanelTitle}>{current.title}</span>
            <span className={styles.monthPanelBody}>{fill(current.body, vars)}</span>
          </div>
        </StepTransition>
      </div>
    </>
  );
}
