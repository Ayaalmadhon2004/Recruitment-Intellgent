import type { ReactNode } from 'react';
import { en, t } from '@/domain/copy';
import type { Recommendation } from '@/domain/types';
import { fill } from '@/features/shared-labels';
import { ActionList } from '@/patterns';
import { SectionHeader } from '@/shell';
import { areaName } from '../../labels';

export type NextStepsProps = {
  recommendations: readonly Recommendation[];
};

const copy = en.report.recommendations;

/** Recommendations ranked by impact. Renders nothing when there are none: no content is invented. */
export function NextSteps({ recommendations }: NextStepsProps): ReactNode {
  if (recommendations.length === 0) return null;
  const ranked = [...recommendations].sort((a, b) => b.impact - a.impact);
  return (
    <section id="actions" aria-labelledby="report-actions-title">
      <SectionHeader id="report-actions-title" eyebrow={copy.eyebrow} title={copy.title} />
      <ActionList
        label={copy.listLabel}
        items={ranked.map((r) => ({
          id: r.id,
          title: t(r.titleKey),
          body: fill(copy.area, { area: areaName(r.areaId) }),
        }))}
      />
    </section>
  );
}
