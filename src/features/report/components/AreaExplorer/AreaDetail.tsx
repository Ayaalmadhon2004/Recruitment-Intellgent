import type { ReactNode } from 'react';
import type { QuestionId } from '@/domain/types';
import { questionLabel } from '@/features/questions';
import { notScorableLabels, scoreCardLabels } from '@/features/shared-labels';
import { ConfidenceMeter, NotScorableState, ScoreRing, StatusBadge } from '@/patterns';
import type { ReportArea } from '../../contract';
import { areaName } from '../../labels';
import { AreaEvidence } from '../AreaEvidence';
import { bandTone } from '../bandTone';
import styles from './AreaExplorer.module.css';

export type AreaDetailProps = {
  area: ReportArea;
  questionHref?: (id: QuestionId) => string | undefined;
};

const labels = scoreCardLabels;

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
      <AreaEvidence area={area} questionHref={questionHref} />
    </div>
  );
}
