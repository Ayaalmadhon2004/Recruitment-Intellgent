import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import type { QuestionId } from '@/domain/types';
import { reportUiCopy } from '@/design/ui-copy';
import { questionLabel } from '@/features/questions';
import { notScorableLabels, scoreCardLabels } from '@/features/shared-labels';
import { ConfidenceMeter, NotScorableState } from '@/patterns';
import { SectionHeader } from '@/shell';
import type { ReportGauge } from '../../contract';
import { gaugeName } from '../../labels';
import styles from './GaugePair.module.css';

export type GaugePairProps = {
  gauges: readonly ReportGauge[];
  questionHref?: (id: QuestionId) => string | undefined;
};

/** School Fit and Agent Attractiveness as a dotted list. A gauge that cannot be read says so; it is never drawn as 0. */
export function GaugePair({ gauges, questionHref }: GaugePairProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="report-gauges-title">
      <SectionHeader
        id="report-gauges-title"
        eyebrow={en.report.gauges.eyebrow}
        title={en.report.gauges.title}
      />
      <ul className={styles.list}>
        {gauges.map(({ id, result }) => {
          const name = gaugeName(id);
          return (
            <li key={id} className={styles.item}>
              <h3 className={styles.name}>{name}</h3>
              {result.kind === 'scored-gauge' ? (
                <>
                  <p className={styles.value}>
                    {fill(reportUiCopy.gauges.scoreLine, { value: result.value.toFixed(1) })}
                  </p>
                  <ConfidenceMeter
                    level={result.confidence}
                    label={scoreCardLabels.confidence}
                    levelLabel={scoreCardLabels.confidenceLevels[result.confidence]}
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
