import type { ReactNode } from 'react';
import type { QuestionId } from '@/domain/types';
import { questionLabel } from '@/features/questions';
import { scoreCardLabels } from '@/features/shared-labels';
import { ScoreCard } from '@/patterns';
import type { ReportArea, ReportMode } from '../../contract';
import { areaName } from '../../labels';
import { LockedArea } from '../LockedArea';
import styles from './AreaGrid.module.css';

export type AreaGridProps = {
  areas: readonly ReportArea[];
  mode: ReportMode;
  questionHref?: (id: QuestionId) => string | undefined;
  /** Where a locked area's "See unlock options" goes. */
  unlockHref?: string;
};

/** All six areas as cards. Used by the free preview and by print. A locked area is hidden in every mode. */
export function AreaGrid({ areas, mode, questionHref, unlockHref }: AreaGridProps): ReactNode {
  return (
    <div className={styles.grid} data-mode={mode}>
      {areas.map((area) => {
        const name = areaName(area.id);
        return (
          <div key={area.id} className={styles.item}>
            {area.locked ? (
              <LockedArea name={name} unlockHref={mode === 'print' ? undefined : unlockHref} />
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
