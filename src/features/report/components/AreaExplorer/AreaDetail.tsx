import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import type { QuestionId } from '@/domain/types';
import { questionLabel } from '@/features/questions';
import { notScorableLabels, scoreCardLabels } from '@/features/shared-labels';
import { ConfidenceMeter, EvidenceTag, NotScorableState, ScoreRing, StatusBadge } from '@/patterns';
import type { ReportArea } from '../../contract';
import { areaName } from '../../labels';
import { bandTone } from '../bandTone';
import styles from './AreaExplorer.module.css';

export type AreaDetailProps = {
  area: ReportArea;
  questionHref?: (id: QuestionId) => string | undefined;
};

const labels = scoreCardLabels;

/** One question as text, or as a link when the caller says where to answer it. */
function QuestionText({ id, href }: { id: QuestionId; href: string | undefined }): ReactNode {
  const text = questionLabel(id);
  return href ? (
    <a href={href} className={styles.link}>
      {text}
    </a>
  ) : (
    <span>{text}</span>
  );
}

/** The panel for one area: the result, what it rests on, and what is missing. */
export function AreaDetail({ area, questionHref }: AreaDetailProps): ReactNode {
  const name = areaName(area.id);
  const { result } = area;
  return (
    <div className={styles.detail}>
      <div className={styles.summary}>
        {result.kind === 'scored' ? (
          <ScoreRing
            result={result}
            ariaLabel={labels.ringAria(name, result.value)}
            caption={labels.outOf}
            size={190}
          />
        ) : null}
        <div className={styles.summaryText}>
          <h3 className={styles.name}>{name}</h3>
          {result.kind === 'scored' ? (
            <>
              <StatusBadge tone={bandTone(result.band)} label={labels.bands[result.band]} />
              <ConfidenceMeter
                level={result.confidence}
                label={labels.confidence}
                levelLabel={labels.confidenceLevels[result.confidence]}
              />
            </>
          ) : (
            <NotScorableState
              result={result}
              labels={notScorableLabels}
              questionLabel={questionLabel}
              questionHref={questionHref}
              headingLevel="h4"
            />
          )}
        </div>
      </div>

      <section className={styles.block} aria-label={`${name}: ${en.report.area.evidenceHeading}`}>
        <h4 className={styles.blockTitle}>{en.report.area.evidenceHeading}</h4>
        {area.evidence.length > 0 ? (
          <ul className={styles.rows}>
            {area.evidence.map((item) => (
              <li key={item.questionId} className={styles.row}>
                <span className={styles.question}>{questionLabel(item.questionId)}</span>
                <span className={styles.chips}>
                  <EvidenceTag tag={item.tag} label={labels.evidenceTags[item.tag]} />
                  <ConfidenceMeter
                    level={item.confidence}
                    label={labels.confidence}
                    levelLabel={labels.confidenceLevels[item.confidence]}
                  />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.plain}>{en.report.area.noEvidence}</p>
        )}
      </section>

      {area.gaps.length > 0 ? (
        <section className={styles.block} aria-label={`${name}: ${en.report.area.gapsHeading}`}>
          <h4 className={styles.blockTitle}>{en.report.area.gapsHeading}</h4>
          <ul className={styles.rows}>
            {area.gaps.map((gap) => (
              <li key={gap.questionId} className={styles.row}>
                <QuestionText id={gap.questionId} href={questionHref?.(gap.questionId)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
