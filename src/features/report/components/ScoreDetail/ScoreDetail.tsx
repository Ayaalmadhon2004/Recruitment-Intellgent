import type { ReactNode } from 'react';
import { scoringConfig } from '@/domain/config';
import { en, fill, t } from '@/domain/copy';
import { affordabilityComponentIds } from '@/domain/types';
import type { AffordabilityComponentId, QuestionId, Recommendation } from '@/domain/types';
import { questionLabel } from '@/features/questions';
import {
  ActionList,
  ConfidenceMeter,
  EvidenceTag,
  NotScorableState,
  ProgressBar,
  SampleDataBadge,
  ScoreRing,
  StatusBadge,
  TbcValue,
  bandTone,
} from '@/patterns';
import { Card, Icon } from '@/ui';
import type { OpenReportArea } from '../../contract';
import { rankRecommendations } from './rank';
import styles from './ScoreDetail.module.css';

export type ScoreDetailProps = {
  /** One entry of `ReportModel.areas`. */
  area: OpenReportArea;
  /** The report's recommendations. This view keeps only the ones for this area. */
  recommendations: readonly Recommendation[];
  /** True when the report is the sample audit. */
  sample?: boolean;
  /** Where to answer a question. When it returns a value the question is a link. */
  questionHref: (id: QuestionId) => string | undefined;
  backHref: string;
  /** Affordability weights. Defaults to the config; passed in so tests can swap them. */
  affordabilityWeights?: Readonly<Record<AffordabilityComponentId, number>>;
};

/** The weights are out of this total. */
const WEIGHT_SCALE = 100;

const notScorableLabels = {
  title: en.status.notScorable,
  reasons: en.notScorable.reasons,
  missingHeading: en.notScorable.missingHeading,
};

/** Everything behind one score area: how it is built, its evidence, gaps and next steps. */
export function ScoreDetail({
  area,
  recommendations,
  sample = false,
  questionHref,
  backHref,
  affordabilityWeights = scoringConfig.affordabilityWeights,
}: ScoreDetailProps): ReactNode {
  const name = en.areas[area.id];
  const ranked = rankRecommendations(recommendations, area.id);
  const result = area.result;
  const weightsTotal = affordabilityComponentIds.reduce(
    (sum, id) => sum + affordabilityWeights[id],
    0,
  );

  return (
    <div className={styles.root}>
      <a href={backHref} className={styles.back}>
        <Icon name="chevron-left" size={20} strokeWidth={2.6} />
        <span>{en.scoreDetail.back}</span>
      </a>

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>{en.scoreDetail.eyebrow}</span>
          <h1 className={styles.title}>{name}</h1>
          {sample ? <SampleDataBadge label={en.status.sample} /> : null}
        </div>
        <div className={styles.result}>
          {result.kind === 'scored' ? (
            <>
              <ScoreRing
                result={result}
                ariaLabel={fill(en.scoreDetail.ringAria, {
                  name,
                  value: Math.round(result.value),
                })}
                caption={en.scoreCard.outOf}
              />
              <div className={styles.resultMeta}>
                <StatusBadge tone={bandTone(result.band)} label={en.bands[result.band]} />
                <ConfidenceMeter
                  level={result.confidence}
                  label={en.confidence.label}
                  levelLabel={en.confidence[result.confidence]}
                />
              </div>
            </>
          ) : (
            <NotScorableState
              result={result}
              labels={notScorableLabels}
              questionLabel={questionLabel}
              questionHref={questionHref}
            />
          )}
        </div>
      </header>

      <section className={styles.section} aria-labelledby="sd-build">
        <h2 id="sd-build" className={styles.heading}>
          {en.scoreDetail.buildTitle}
        </h2>
        {area.id === 'affordability' ? (
          <>
            <p className={styles.lead}>{en.scoreDetail.buildLead}</p>
            <Card radius="md">
              <h3 className={styles.subheading}>{en.scoreDetail.componentsHeading}</h3>
              <ul className={styles.components}>
                {affordabilityComponentIds.map((id) => (
                  <li key={id}>
                    <ProgressBar
                      label={en.affordabilityComponents[id]}
                      value={affordabilityWeights[id]}
                      valueText={fill(en.scoreDetail.weightText, {
                        weight: affordabilityWeights[id],
                        total: WEIGHT_SCALE,
                      })}
                    />
                  </li>
                ))}
              </ul>
              <p className={styles.total}>
                <span>{en.scoreDetail.totalLabel}</span>
                <span data-testid="weights-total">{weightsTotal}</span>
              </p>
            </Card>
          </>
        ) : (
          <p className={styles.lead}>
            {en.scoreDetail.undefinedBuild} <TbcValue value={null} placeholder={en.status.tbc} label={en.status.pending} />
          </p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="sd-evidence">
        <h2 id="sd-evidence" className={styles.heading}>
          {en.scoreDetail.evidenceTitle}
        </h2>
        {area.evidence.length === 0 ? (
          <p className={styles.empty}>{en.scoreDetail.evidenceEmpty}</p>
        ) : (
          <>
            <p className={styles.lead}>{en.scoreDetail.evidenceLead}</p>
            <ul className={styles.rows} aria-label={en.scoreDetail.evidenceListLabel}>
              {area.evidence.map((item) => (
                <li key={item.questionId} className={styles.row}>
                  <span className={styles.rowText}>{questionLabel(item.questionId)}</span>
                  <span className={styles.rowChips}>
                    <EvidenceTag tag={item.tag} label={en.evidenceTags[item.tag]} />
                    <ConfidenceMeter
                      level={item.confidence}
                      label={en.confidence.label}
                      levelLabel={en.confidence[item.confidence]}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className={styles.section} aria-labelledby="sd-gaps">
        <h2 id="sd-gaps" className={styles.heading}>
          {en.scoreDetail.gapsTitle}
        </h2>
        {result.kind === 'scored' && area.gaps.length === 0 ? (
          <p className={styles.empty}>{en.scoreDetail.gapsNone}</p>
        ) : (
          <>
            <p className={styles.lead}>
              {result.kind === 'not-scorable'
                ? en.notScorable.reasons[result.reason]
                : en.scoreDetail.gapsLead}
            </p>
            {area.gaps.length > 0 ? (
              <ul className={styles.rows} aria-label={en.scoreDetail.gapsListLabel}>
                {area.gaps.map((gap) => {
                  const href = questionHref(gap.questionId);
                  const text = questionLabel(gap.questionId);
                  return (
                    <li key={gap.questionId} className={styles.row}>
                      {href ? (
                        <a href={href} className={styles.link}>
                          {text}
                        </a>
                      ) : (
                        <span className={styles.rowText}>{text}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={styles.empty}>{en.scoreDetail.gapsNoneListed}</p>
            )}
          </>
        )}
      </section>

      <section className={styles.section} aria-labelledby="sd-recs">
        <h2 id="sd-recs" className={styles.heading}>
          {en.scoreDetail.recommendationsTitle}
        </h2>
        {ranked.length === 0 ? (
          <p className={styles.empty}>{en.scoreDetail.recommendationsEmpty}</p>
        ) : (
          <>
            <p className={styles.lead}>{en.scoreDetail.recommendationsLead}</p>
            <ActionList
              label={en.scoreDetail.recommendationsLabel}
              items={ranked.map((item) => ({ id: item.id, title: t(item.titleKey) }))}
            />
          </>
        )}
      </section>
    </div>
  );
}
