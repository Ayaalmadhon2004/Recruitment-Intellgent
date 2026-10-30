import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import type { Answer } from '@/domain/types';
import { progressText, stageChipText } from '@/features/shared-labels';
import { ProgressBar, SampleDataBadge } from '@/patterns';
import { Button } from '@/ui';
import type { ReportModel } from '../../contract';
import { ReportKite, buildKiteSections } from '../ReportKite';
import type { ReportLinks } from '../types';
import styles from './ReportBanner.module.css';

export type ReportBannerProps = {
  model: ReportModel;
  links: ReportLinks;
  /** The stored answers, so each question can fill its cell. Without them the kite is left out. */
  answers?: readonly Answer[];
  /** Where "See my scores" jumps to. */
  scoresHref?: string;
};

const pilotCopy = en.report.pilot;

/** The top of the interactive report: who, where they stand, the kite of answers and the suggested pilot. */
export function ReportBanner({
  model,
  links,
  answers,
  scoresHref = '#scores',
}: ReportBannerProps): ReactNode {
  const { handled, total } = model.completeness;
  const { pilot } = model;
  const stageChip =
    model.stage.kind === 'staged'
      ? stageChipText(model.stage.stage)
      : en.report.stageNotScorableChip;
  const pilotFacts = [
    fill(pilotCopy.summaryMonths, { months: pilot.durationMonths }),
    fill(pilotCopy.summaryAgents, { agents: pilot.agentCount }),
    pilot.exclusive ? pilotCopy.exclusive : pilotCopy.nonExclusive,
  ];

  return (
    <header className={styles.banner}>
      <div className={styles.text}>
        {model.isSample ? <SampleDataBadge label={en.status.sample} /> : null}
        <span className={styles.eyebrow}>{en.report.eyebrow}</span>
        <h1 className={styles.title}>{model.institutionName}</h1>
        <p className={styles.lead}>{en.report.lead}</p>
        <p className={styles.chip}>{stageChip}</p>
        <div className={styles.progress}>
          <ProgressBar
            value={handled}
            max={total}
            label={en.report.completenessLabel}
            valueText={progressText(handled, total)}
            size="lg"
          />
        </div>
        <div className={styles.pilot}>
          <h2 className={styles.pilotTitle}>{fill(pilotCopy.title, { months: pilot.durationMonths })}</h2>
          <ul className={styles.facts}>
            {pilotFacts.map((fact) => (
              <li key={fact} className={styles.fact}>
                {fact}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.actions}>
          {links.continueHref ? (
            <Button href={links.continueHref} size="lg">
              {en.report.continueAudit}
            </Button>
          ) : null}
          <Button href={scoresHref} variant="outline" size="lg">
            {en.report.seeScores}
          </Button>
        </div>
      </div>
      {answers ? <ReportKite className={styles.kite} sections={buildKiteSections(answers)} /> : null}
    </header>
  );
}
