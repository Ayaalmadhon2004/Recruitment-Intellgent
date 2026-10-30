import type { ReactNode } from 'react';
import { en, t } from '@/domain/copy';
import { scoringConfig, stagesConfig } from '@/domain/config';
import { scoreAreaIds } from '@/domain/types';
import type { NotScorable, QuestionId, ScoreAreaId, ScoreResult } from '@/domain/types';
import {
  bandTone,
  CtaBand,
  ProgressBar,
  SampleDataBadge,
  ScoreRing,
  StageCard,
  StatusBadge,
} from '@/patterns';
import { SectionHeader } from '@/shell';
import { Icon } from '@/ui';
import { questionLabel } from '@/features/questions';
import type { FirstReadResponse } from '../../contract';
import {
  progressText,
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
  /** Where "Unlock full report" goes. Without it the button is not shown. */
  unlockHref?: string;
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
  unlockHref,
}: FirstReadViewProps): ReactNode {
  const scoredAreas = scoreAreaIds.filter((id) => result.areas[id].kind === 'scored');
  const lockedAreas = scoreAreaIds.filter((id) => result.areas[id].kind === 'not-scorable');

  const lockedResults = lockedAreas.flatMap((id) => {
    const area = result.areas[id];
    return area.kind === 'not-scorable' ? [{ id, area }] : [];
  });
  // When every waiting area has the same reason it is said once, not on every row.
  const reasons = new Set(lockedResults.map(({ area }) => area.reason));
  const sharedReason = reasons.size === 1 ? [...reasons][0] : undefined;

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
          <ul className={styles.rows}>
            {scoredAreas.map((id) => (
              <li key={id}>
                <ScoredRow name={areaName(id)} result={result.areas[id]} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className={styles.plain}>{copy.scoredNone}</p>
      )}

      {lockedResults.length > 0 ? (
        <section className={styles.group} aria-label={copy.lockedTitle}>
          <SectionHeader eyebrow={copy.lockedEyebrow} title={copy.lockedTitle} />
          <p className={styles.plain}>
            {scoreCardLabels.notScorable.explainer}
            {sharedReason ? ` ${scoreCardLabels.notScorable.reasons[sharedReason]}` : ''}
          </p>
          <ul className={styles.rows}>
            {lockedResults.map(({ id, area }) => (
              <li key={id}>
                <WaitingRow
                  name={areaName(id)}
                  area={area}
                  showReason={sharedReason === undefined}
                  questionHref={questionHref}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand
        tone="panel"
        eyebrow={copy.ctaEyebrow}
        title={copy.ctaTitle}
        body={copy.ctaBody}
        actions={[
          { label: copy.ctaContinue, href: continueHref },
          ...(unlockHref ? [{ label: en.report.unlock.cta, href: unlockHref }] : []),
          { label: copy.ctaChange, href: changeAnswersHref },
        ]}
      />
    </div>
  );
}

/** One area that can already be read: ring, name and band word, set on the page with a thin line. */
function ScoredRow({ name, result }: { name: string; result: ScoreResult }): ReactNode {
  if (result.kind !== 'scored') return null;
  return (
    <article className={styles.row} aria-label={name}>
      <ScoreRing
        result={result}
        ariaLabel={scoreCardLabels.ringAria(name, result.value)}
        caption={scoreCardLabels.outOf}
        size={96}
        reveal
      />
      <div className={styles.rowText}>
        <h3 className={styles.rowName}>{name}</h3>
        <StatusBadge tone={bandTone(result.band)} label={scoreCardLabels.bands[result.band]} />
      </div>
    </article>
  );
}

/** One area that cannot be scored yet: icon, name and the words "Not yet scorable", then what to answer. */
function WaitingRow({
  name,
  area,
  showReason,
  questionHref,
}: {
  name: string;
  area: NotScorable;
  showReason: boolean;
  questionHref?: (id: QuestionId) => string | undefined;
}): ReactNode {
  const labels = scoreCardLabels.notScorable;
  return (
    <article className={styles.row} aria-label={name} data-notscorable="" data-reason={area.reason}>
      <span className={styles.mark} aria-hidden="true">
        <Icon name="circle-dashed" size={24} strokeWidth={2.2} />
      </span>
      <div className={styles.rowText}>
        <h3 className={styles.rowName}>{name}</h3>
        <p className={styles.waiting}>{labels.title}</p>
        {showReason ? <p className={styles.reason}>{labels.reasons[area.reason]}</p> : null}
        {area.missing.length > 0 ? (
          <div>
            <p className={styles.missingHeading}>{labels.missingHeading}</p>
            <ul className={styles.missing}>
              {area.missing.map((id) => {
                const text = questionLabel(id);
                const href = questionHref?.(id);
                return (
                  <li key={id}>
                    {href ? (
                      <a href={href} className={styles.link}>
                        {text}
                      </a>
                    ) : (
                      text
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
