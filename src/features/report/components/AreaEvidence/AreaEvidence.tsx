import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import type { QuestionId } from '@/domain/types';
import { questionLabel } from '@/features/questions';
import { scoreCardLabels } from '@/features/shared-labels';
import { ConfidenceMeter, EvidenceTag } from '@/patterns';
import type { OpenReportArea } from '../../contract';
import { areaName } from '../../labels';
import styles from './AreaEvidence.module.css';

export type AreaEvidenceProps = {
  area: OpenReportArea;
  questionHref?: (id: QuestionId) => string | undefined;
  /** Heading level of the two block titles. */
  headingLevel?: 'h3' | 'h4';
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

/** What an area rests on (each answer with its evidence tag and confidence) and what is missing. */
export function AreaEvidence({
  area,
  questionHref,
  headingLevel = 'h4',
}: AreaEvidenceProps): ReactNode {
  const name = areaName(area.id);
  const Heading = headingLevel;
  return (
    <>
      <section className={styles.block} aria-label={`${name}: ${en.report.area.evidenceHeading}`}>
        <Heading className={styles.blockTitle}>{en.report.area.evidenceHeading}</Heading>
        {area.evidence.length > 0 ? (
          <p className={styles.plain}>{en.report.area.evidenceLead}</p>
        ) : null}
        {area.evidence.length > 0 ? (
          <ul className={styles.rows}>
            {area.evidence.map((item) => (
              <li key={item.questionId} className={styles.row}>
                <span className={styles.question}>{questionLabel(item.questionId)}</span>
                <span className={styles.chips}>
                  <EvidenceTag
                    tag={item.tag}
                    label={labels.evidenceTags[item.tag]}
                    hint={labels.evidenceHints?.[item.tag]}
                  />
                  <ConfidenceMeter
                    level={item.confidence}
                    label={labels.confidence}
                    levelLabel={labels.confidenceLevels[item.confidence]}
                    hint={labels.confidenceHint}
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
          <Heading className={styles.blockTitle}>{en.report.area.gapsHeading}</Heading>
          <ul className={styles.rows}>
            {area.gaps.map((gap) => (
              <li key={gap.questionId} className={styles.row}>
                <QuestionText id={gap.questionId} href={questionHref?.(gap.questionId)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
