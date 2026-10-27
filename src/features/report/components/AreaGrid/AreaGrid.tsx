import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import type { QuestionId } from '@/domain/types';
import { questionLabel, scoreCardLabels } from '@/features/shared-labels';
import { ScoreCard } from '@/patterns';
import { Card, Icon } from '@/ui';
import type { ReportArea, ReportMode } from '../../contract';
import { areaName } from '../../labels';
import styles from './AreaGrid.module.css';

export type AreaGridProps = {
  areas: readonly ReportArea[];
  mode: ReportMode;
  questionHref?: (id: QuestionId) => string | undefined;
};

/** A hidden area: a lock, the word "Locked" and one line. It never receives the area's result. */
function LockedArea({ name }: { name: string }): ReactNode {
  return (
    <Card as="article" tone="dashed" radius="lg" aria-label={name} data-locked="">
      <div className={styles.locked}>
        <span className={styles.mark} aria-hidden="true">
          <Icon name="lock" size={28} strokeWidth={2.4} />
        </span>
        <div className={styles.lockedText}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.word}>{en.report.locked.word}</span>
          <p className={styles.body}>{en.report.locked.body}</p>
        </div>
      </div>
    </Card>
  );
}

/** All six areas as cards. Used by the free preview and by print. Only the preview hides areas. */
export function AreaGrid({ areas, mode, questionHref }: AreaGridProps): ReactNode {
  return (
    <div className={styles.grid} data-mode={mode}>
      {areas.map((area) => {
        const name = areaName(area.id);
        return (
          <div key={area.id} className={styles.item}>
            {mode === 'preview' && area.locked ? (
              <LockedArea name={name} />
            ) : (
              <ScoreCard
                name={name}
                result={area.result}
                labels={scoreCardLabels}
                questionLabel={questionLabel}
                questionHref={questionHref}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
