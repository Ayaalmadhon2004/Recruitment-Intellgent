'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import type { QuestionId, ScoreAreaId } from '@/domain/types';
import { reportUiCopy } from '@/design/ui-copy';
import { questionLabel } from '@/features/questions';
import { notScorableLabels, scoreCardLabels } from '@/features/shared-labels';
import { ConfidenceMeter, NotScorableState, StatusBadge } from '@/patterns';
import { SectionHeader } from '@/shell';
import { cx } from '@/ui';
import type { OpenReportArea, ReportArea, ReportModel } from '../../contract';
import { areaName } from '../../labels';
import { AreaEvidence } from '../AreaEvidence';
import { LockedArea } from '../LockedArea';
import { bandTone } from '../bandTone';
import styles from './ScoreMetrics.module.css';

export type ScoreMetricsProps = {
  model: ReportModel;
  questionHref?: (id: QuestionId) => string | undefined;
  unlockHref?: string;
};

type MetricId = 'readiness' | 'completeness' | 'digital-visibility';

const copy = reportUiCopy.scores;
const labels = scoreCardLabels;

/** The three scores shown, in this order. Readiness and Digital visibility are model areas; Completeness is the audit's. */
const metricIds: readonly MetricId[] = ['readiness', 'completeness', 'digital-visibility'];

const metricName = (id: MetricId): string =>
  id === 'completeness' ? en.report.completenessLabel : areaName(id);

const FULL = 100;

const percent = (value: number): string => fill(copy.percent, { value: Math.round(value) });

/** Interactive report: pick one of three scores and read its percentage. Never a 0 for a score that cannot be read. */
export function ScoreMetrics({ model, questionHref, unlockHref }: ScoreMetricsProps): ReactNode {
  const [selected, setSelected] = useState<MetricId>('readiness');
  const groupName = useId();
  const area = (id: ScoreAreaId): ReportArea | undefined => model.areas.find((a) => a.id === id);

  return (
    <section id="scores" className={styles.section} aria-labelledby="report-scores-title">
      <SectionHeader
        id="report-scores-title"
        eyebrow={en.report.scoresEyebrow}
        title={copy.title}
      />
      <div className={styles.body}>
        <div role="radiogroup" aria-label={copy.pick} className={styles.pills}>
          {metricIds.map((id) => (
            <label key={id} className={cx(styles.pill, selected === id && styles.selected)}>
              <input
                type="radio"
                name={groupName}
                value={id}
                checked={selected === id}
                onChange={() => setSelected(id)}
                className={styles.input}
              />
              {metricName(id)}
            </label>
          ))}
        </div>
        <div className={styles.panel} aria-live="polite">
          {selected === 'completeness' ? (
            <Completeness model={model} />
          ) : (
            <AreaMetric
              id={selected}
              area={area(selected)}
              questionHref={questionHref}
              unlockHref={unlockHref}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Completeness({ model }: { model: ReportModel }): ReactNode {
  const { handled, total, unknown } = model.completeness;
  const name = metricName('completeness');
  return (
    <>
      <h3 className={styles.name}>{name}</h3>
      {total > 0 ? (
        <p className={styles.value}>{percent((handled / total) * FULL)}</p>
      ) : (
        <p className={styles.value}>{en.status.notScorable}</p>
      )}
      <p className={styles.line}>{fill(copy.completenessLine, { handled, total, unknown })}</p>
    </>
  );
}

type AreaMetricProps = {
  id: ScoreAreaId;
  area: ReportArea | undefined;
  questionHref?: (id: QuestionId) => string | undefined;
  unlockHref?: string;
};

function AreaMetric({ id, area, questionHref, unlockHref }: AreaMetricProps): ReactNode {
  const name = areaName(id);
  if (!area) return <h3 className={styles.name}>{name}</h3>;
  if (area.locked) return <LockedArea name={name} unlockHref={unlockHref} headingLevel="h3" />;
  const open: OpenReportArea = area;
  const { result } = open;
  return (
    <>
      <h3 className={styles.name}>{name}</h3>
      {result.kind === 'scored' ? (
        <>
          <p className={styles.value}>{percent(result.value)}</p>
          <div className={styles.meta}>
            <StatusBadge tone={bandTone(result.band)} label={labels.bands[result.band]} />
            <ConfidenceMeter
              level={result.confidence}
              label={labels.confidence}
              levelLabel={labels.confidenceLevels[result.confidence]}
            />
          </div>
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
      <AreaEvidence area={open} questionHref={questionHref} />
    </>
  );
}
