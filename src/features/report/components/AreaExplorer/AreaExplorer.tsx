import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import type { QuestionId } from '@/domain/types';
import { SectionHeader } from '@/shell';
import { Tabs } from '@/ui';
import type { ReportArea } from '../../contract';
import { areaName } from '../../labels';
import { AreaDetail } from './AreaDetail';
import styles from './AreaExplorer.module.css';

export type AreaExplorerProps = {
  areas: readonly ReportArea[];
  questionHref?: (id: QuestionId) => string | undefined;
  unlockHref?: string;
};

const tabBadge = (area: ReportArea): string =>
  area.locked
    ? en.report.locked.word
    : area.result.kind === 'scored'
      ? String(Math.round(area.result.value))
      : en.report.tabNotScorable;

/** Interactive report: pick an area, read its result, evidence and gaps. */
export function AreaExplorer({ areas, questionHref, unlockHref }: AreaExplorerProps): ReactNode {
  return (
    <section id="scores" className={styles.section} aria-labelledby="report-scores-title">
      <SectionHeader
        id="report-scores-title"
        eyebrow={en.report.scoresEyebrow}
        title={en.report.scoresTitle}
      />
      <Tabs
        orientation="vertical"
        label={en.report.areasTabsLabel}
        tabs={areas.map((area) => ({
          id: area.id,
          label: areaName(area.id),
          badge: tabBadge(area),
          content: <AreaDetail area={area} questionHref={questionHref} unlockHref={unlockHref} />,
        }))}
      />
    </section>
  );
}
