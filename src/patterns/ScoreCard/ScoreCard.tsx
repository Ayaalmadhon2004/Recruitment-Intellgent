import type { ReactNode } from 'react';
import type {
  BandId,
  Confidence,
  EvidenceTag as EvidenceTagId,
  QuestionId,
  ScoreResult,
} from '@/domain/types';
import { Card } from '@/ui';
import { ConfidenceMeter } from '../ConfidenceMeter';
import { EvidenceTag } from '../EvidenceTag';
import { bandTone } from '../internal/tone';
import { NotScorableState } from '../NotScorableState';
import type { NotScorableLabels } from '../NotScorableState';
import { ScoreRing } from '../ScoreRing';
import { StatusBadge } from '../StatusBadge';
import styles from './ScoreCard.module.css';

export type ScoreCardLabels = {
  bands: Record<BandId, string>;
  /** For example "out of 100". */
  outOf: string;
  /** For example (name, value) => "Readiness score 68 out of 100". */
  ringAria: (name: string, value: number) => string;
  evidenceTags: Record<EvidenceTagId, string>;
  confidence: string;
  confidenceLevels: Record<Confidence, string>;
  notScorable: NotScorableLabels;
};

export type ScoreCardProps = {
  name: string;
  /** Scored or NotScorable, rendered through one code path. */
  result: ScoreResult;
  labels: ScoreCardLabels;
  /** One sentence on why the score is what it is. */
  reason?: string;
  evidence?: EvidenceTagId;
  questionLabel?: (id: QuestionId) => string;
  questionHref?: (id: QuestionId) => string | undefined;
};

export function ScoreCard({
  name,
  result,
  labels,
  reason,
  evidence,
  questionLabel,
  questionHref,
}: ScoreCardProps): ReactNode {
  if (result.kind === 'not-scorable') {
    return (
      <Card
        as="article"
        tone="dashed"
        radius="lg"
        className={styles.card}
        aria-label={name}
        data-notscorable=""
      >
        <h3 className={styles.name}>{name}</h3>
        <NotScorableState
          result={result}
          labels={labels.notScorable}
          questionLabel={questionLabel}
          questionHref={questionHref}
          headingLevel="h4"
        />
      </Card>
    );
  }

  return (
    <Card as="article" radius="lg" lift className={styles.card} aria-label={name}>
      <ScoreRing
        result={result}
        ariaLabel={labels.ringAria(name, result.value)}
        caption={labels.outOf}
      />
      <h3 className={styles.name}>{name}</h3>
      <StatusBadge tone={bandTone(result.band)} label={labels.bands[result.band]} />
      {reason ? <p className={styles.reason}>{reason}</p> : null}
      <div className={styles.chips}>
        {evidence ? <EvidenceTag tag={evidence} label={labels.evidenceTags[evidence]} /> : null}
        <ConfidenceMeter
          level={result.confidence}
          label={labels.confidence}
          levelLabel={labels.confidenceLevels[result.confidence]}
        />
      </div>
    </Card>
  );
}
