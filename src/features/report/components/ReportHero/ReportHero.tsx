import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { progressText, stageChipText } from '@/features/shared-labels';
import { Button } from '@/ui';
import { ProgressBar, SampleDataBadge, TbcValue } from '@/patterns';
import type { ReportMode } from '../../contract';
import type { ReportModel } from '../../contract';
import type { ReportLinks } from '../types';
import styles from './ReportHero.module.css';

export type ReportHeroProps = {
  model: ReportModel;
  mode: ReportMode;
  links: ReportLinks;
  /** Shown beside the text in the interactive report (the radar). */
  aside?: ReactNode;
  /** Where "See my scores" jumps to. */
  scoresHref?: string;
};

/** Copy that changes with the mode. Everything else in the hero is the same facts. */
const modeCopy = {
  interactive: { eyebrow: en.report.eyebrow, lead: en.report.lead },
  preview: { eyebrow: en.firstRead.eyebrow, lead: en.firstRead.lead },
  print: { eyebrow: en.report.printEyebrow, lead: en.report.printTitle },
} as const satisfies Record<ReportMode, { eyebrow: string; lead: string }>;

/** Institution, stage, completeness and sample badge. The cover in print, the top band elsewhere. */
export function ReportHero({
  model,
  mode,
  links,
  aside,
  scoresHref = '#scores',
}: ReportHeroProps): ReactNode {
  const { eyebrow, lead } = modeCopy[mode];
  const { handled, total } = model.completeness;
  const stageChip =
    model.stage.kind === 'staged'
      ? stageChipText(model.stage.stage)
      : en.report.stageNotScorableChip;

  return (
    <header className={styles.hero} data-mode={mode}>
      <div className={styles.text}>
        {model.isSample ? <SampleDataBadge label={en.status.sample} /> : null}
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{model.institutionName}</h1>
        <p className={styles.lead}>{lead}</p>
        <ul className={styles.chips}>
          <li className={styles.chip}>{stageChip}</li>
          {mode === 'preview' ? (
            <li className={styles.chip}>{en.firstRead.preliminaryChip}</li>
          ) : null}
        </ul>
        <div className={styles.progress}>
          <ProgressBar
            value={handled}
            max={total}
            label={en.report.completenessLabel}
            valueText={progressText(handled, total)}
            tone={mode === 'print' ? 'navy' : 'inverse'}
            size="lg"
          />
        </div>
        {mode === 'print' ? (
          <p className={styles.date}>
            {en.report.print.dateLabel}:{' '}
            <TbcValue value={tbcConfig.reportDate} placeholder={en.status.tbc} label={en.status.pending} />
          </p>
        ) : null}
        {mode === 'interactive' ? (
          <div className={styles.actions}>
            {links.continueHref ? (
              <Button href={links.continueHref} variant="inverse" size="lg">
                {en.report.continueAudit}
              </Button>
            ) : null}
            <Button href={scoresHref} variant="inverse-outline" size="lg">
              {en.report.seeScores}
            </Button>
          </div>
        ) : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  );
}
