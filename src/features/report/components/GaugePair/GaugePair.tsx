import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import type { QuestionId } from '@/domain/types';
import { notScorableLabels, questionLabel, scoreCardLabels } from '@/features/shared-labels';
import { ConfidenceMeter, NotScorableState, ScoreRing } from '@/patterns';
import { SectionHeader } from '@/shell';
import { Card } from '@/ui';
import type { ReportGauge } from '../../contract';
import { gaugeAria, gaugeName } from '../../labels';
import styles from './GaugePair.module.css';

export type GaugePairProps = {
  gauges: readonly ReportGauge[];
  questionHref?: (id: QuestionId) => string | undefined;
};

/** School Fit and Agent Attractiveness. A gauge that cannot be read says so; it is never drawn as 0. */
export function GaugePair({ gauges, questionHref }: GaugePairProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="report-gauges-title">
      <SectionHeader
        id="report-gauges-title"
        eyebrow={en.report.gauges.eyebrow}
        title={en.report.gauges.title}
      />
      <div className={styles.grid}>
        {gauges.map(({ id, result }) => {
          const name = gaugeName(id);
          return (
            <div key={id} className={styles.item}>
              <Card as="article" radius="lg" aria-label={name} className={styles.card}>
                {result.kind === 'scored-gauge' ? (
                  <>
                    <ScoreRing
                      result={result}
                      ariaLabel={gaugeAria(name, result.value)}
                      caption={en.report.gauges.outOf}
                      size={140}
                    />
                    <div className={styles.text}>
                      <h3 className={styles.name}>{name}</h3>
                      <ConfidenceMeter
                        level={result.confidence}
                        label={scoreCardLabels.confidence}
                        levelLabel={scoreCardLabels.confidenceLevels[result.confidence]}
                      />
                    </div>
                  </>
                ) : (
                  <div className={styles.text}>
                    <h3 className={styles.name}>{name}</h3>
                    <NotScorableState
                      result={result}
                      labels={notScorableLabels}
                      questionLabel={questionLabel}
                      questionHref={questionHref}
                      headingLevel="h4"
                    />
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
