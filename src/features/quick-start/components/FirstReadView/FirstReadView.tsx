import type { ReactNode } from 'react';
import { en, t } from '@/domain/copy';
import { scoringConfig, stagesConfig } from '@/domain/config';
import { scoreAreaIds } from '@/domain/types';
import type { QuestionId, ScoreAreaId } from '@/domain/types';
import { CtaBand, ProgressBar, SampleDataBadge, ScoreCard, StageCard } from '@/patterns';
import { SectionHeader } from '@/shell';
import type { FirstReadResponse } from '../../contract';
import {
  progressText,
  questionLabel,
  rangeLabels,
  scoreCardLabels,
  stageCardLabels,
  stageChipText,
} from '@/features/shared-labels';
import styles from './FirstReadView.module.css';

export type FirstReadViewProps = {
  result: FirstReadResponse;
  /** True when the result comes from sample data. Shows the sample badge. */
  isSample?: boolean;
  /** Where to answer a missing question. When it returns a value the question is a link. */
  questionHref?: (id: QuestionId) => string | undefined;
  changeAnswersHref: string;
  continueHref: string;
};

const copy = en.firstRead;

/** Area name from the scoring config's copy key. */
const areaName = (id: ScoreAreaId): string => {
  const area = scoringConfig.areas.find((a) => a.id === id);
  return area ? t(area.nameKey) : en.areas[id];
};

/** Renders a First Read result computed by the server. It never computes or guesses a score. */
export function FirstReadView({
  result,
  isSample = false,
  questionHref,
  changeAnswersHref,
  continueHref,
}: FirstReadViewProps): ReactNode {
  const scoredAreas = scoreAreaIds.filter((id) => result.areas[id].kind === 'scored');
  const lockedAreas = scoreAreaIds.filter((id) => result.areas[id].kind === 'not-scorable');

  return (
    <div className={styles.root}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          {isSample ? <SampleDataBadge label={en.status.sample} /> : null}
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.lead}>{copy.lead}</p>
          <ul className={styles.chips}>
            {result.stage.kind === 'staged' ? (
              <li className={styles.chip}>{stageChipText(result.stage.stage)}</li>
            ) : null}
            <li className={styles.chip}>{copy.preliminaryChip}</li>
          </ul>
        </div>
        <div className={styles.heroProgress}>
          <ProgressBar
            value={result.answeredCount}
            max={result.quickStartTotal}
            label={copy.progressLabel}
            valueText={progressText(result.answeredCount, result.quickStartTotal)}
            tone="inverse"
            size="lg"
          />
        </div>
      </header>

      <StageCard
        result={result.stage}
        stages={stagesConfig.stages}
        rangeLabels={rangeLabels}
        labels={stageCardLabels}
        eyebrow={copy.stageEyebrow}
      />

      {scoredAreas.length > 0 ? (
        <section className={styles.group} aria-label={copy.scoredTitle}>
          <SectionHeader eyebrow={copy.scoredEyebrow} title={copy.scoredTitle} />
          <div className={styles.grid}>
            {scoredAreas.map((id) => (
              <ScoreCard
                key={id}
                name={areaName(id)}
                result={result.areas[id]}
                labels={scoreCardLabels}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className={styles.plain}>{copy.scoredNone}</p>
      )}

      {lockedAreas.length > 0 ? (
        <section className={styles.group} aria-label={copy.lockedTitle}>
          <SectionHeader eyebrow={copy.lockedEyebrow} title={copy.lockedTitle} />
          <div className={styles.grid}>
            {lockedAreas.map((id) => (
              <ScoreCard
                key={id}
                name={areaName(id)}
                result={result.areas[id]}
                labels={scoreCardLabels}
                questionLabel={questionLabel}
                questionHref={questionHref}
              />
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand
        eyebrow={copy.ctaEyebrow}
        title={copy.ctaTitle}
        body={copy.ctaBody}
        actions={[
          { label: copy.ctaContinue, href: continueHref },
          { label: copy.ctaChange, href: changeAnswersHref, variant: 'inverse-outline' },
        ]}
      />
    </div>
  );
}
