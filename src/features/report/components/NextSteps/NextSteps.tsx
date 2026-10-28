import type { ReactNode } from 'react';
import { en, t } from '@/domain/copy';
import type { Recommendation } from '@/domain/types';
import { fill } from '@/features/shared-labels';
import { ActionList } from '@/patterns';
import { SectionHeader } from '@/shell';
import type { ReportMode } from '../../contract';
import { areaName } from '../../labels';
import styles from './NextSteps.module.css';

export type NextStepsProps = {
  recommendations: readonly Recommendation[];
  mode?: ReportMode;
};

const copy = en.report.recommendations;

/** Recommendations ranked by impact. Renders nothing when there are none: no content is invented. */
export function NextSteps({ recommendations, mode }: NextStepsProps): ReactNode {
  if (recommendations.length === 0) return null;
  const ranked = [...recommendations].sort((a, b) => b.impact - a.impact);
  const items = ranked.map((r) => ({
    id: r.id,
    title: t(r.titleKey),
    body: fill(copy.area, { area: areaName(r.areaId) }),
  }));
  return (
    <section id="actions" aria-labelledby="report-actions-title">
      <SectionHeader id="report-actions-title" eyebrow={copy.eyebrow} title={copy.title} />
      {mode === 'print' ? (
        <ol className={styles.list} aria-label={copy.listLabel}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ActionList label={copy.listLabel} items={items} />
      )}
    </section>
  );
}
