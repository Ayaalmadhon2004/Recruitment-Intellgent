'use client';

import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import type { PilotPlan as PilotPlanModel } from '@/domain/types';
import { SectionHeader } from '@/shell';
import { Carousel, cx } from '@/ui';
import type { ReportMode } from '../../contract';
import styles from './PilotPlan.module.css';

export type PilotPlanProps = {
  pilot: PilotPlanModel;
  mode: ReportMode;
};

const copy = en.report.pilot;

/** Month titles and bodies are fixed content from the design. The numbers come from the model. */
const steps = [
  { id: 'first', ...copy.steps.first, tone: 'navy' },
  { id: 'second', ...copy.steps.second, tone: 'crimson' },
  { id: 'third', ...copy.steps.third, tone: 'plain' },
] as const;

const carouselLabels = {
  previous: copy.previous,
  next: copy.next,
  dots: copy.dots,
  goTo: (position: number): string => fill(copy.goTo, { position }),
  slide: (position: number, total: number): string => fill(copy.slide, { position, total }),
};

function Step({ step }: { step: (typeof steps)[number] }): ReactNode {
  return (
    <div className={cx(styles.step, styles[step.tone])}>
      <span className={styles.months}>{step.months}</span>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepBody}>{step.body}</p>
    </div>
  );
}

/** The 6-month agent pilot. A carousel on screen, a plain list in print. */
export function PilotPlan({ pilot, mode }: PilotPlanProps): ReactNode {
  const { min, max } = pilot.commissionBenchmarkPercent;
  const facts = [
    fill(copy.summaryMonths, { months: pilot.durationMonths }),
    fill(copy.summaryAgents, { agents: pilot.agentCount }),
    pilot.exclusive ? copy.exclusive : copy.nonExclusive,
    fill(copy.commission, { min, max }),
  ];
  const title = fill(copy.title, { months: pilot.durationMonths });

  return (
    <section className={styles.section} data-mode={mode} aria-labelledby="report-pilot-title">
      <SectionHeader
        id="report-pilot-title"
        eyebrow={mode === 'print' ? en.report.print.pilotHeading : copy.eyebrow}
        title={title}
      />
      <ul className={styles.facts}>
        {facts.map((fact) => (
          <li key={fact} className={styles.fact}>
            {fact}
          </li>
        ))}
      </ul>
      {mode === 'print' ? (
        <ol className={styles.list}>
          {steps.map((step) => (
            <li key={step.id} className={styles.listItem}>
              <Step step={step} />
            </li>
          ))}
        </ol>
      ) : (
        <Carousel
          label={copy.carouselLabel}
          labels={carouselLabels}
          slides={steps.map((step) => ({ id: step.id, content: <Step step={step} /> }))}
        />
      )}
    </section>
  );
}
