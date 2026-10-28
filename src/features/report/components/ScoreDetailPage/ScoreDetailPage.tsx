'use client';

import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { scoreAreaIds } from '@/domain/types';
import type { Audit, ScoreAreaId } from '@/domain/types';
import type { ReportModel } from '../../contract';
import { useReportModel } from '../../useReportModel';
import type { ReportModelState } from '../../useReportModel';
import { ReportStateMessage } from '../ReportStateMessage';
import { ReportVersionNotice } from '../ReportVersionNotice';
import { ScoreDetail } from '../ScoreDetail';
import { useFocusHeading } from '../useFocusHeading';
import styles from './ScoreDetailPage.module.css';

export type ScoreDetailPageProps = {
  /** The raw route segment. Anything that is not a score area is a 404. */
  area: string;
  reportHref?: string;
  intakeHref?: string;
  quickStartHref?: string;
  /** Replaces the stored audit. For tests and stories. Keep the reference stable. */
  loadAudit?: () => Audit | null;
  /** A ready report for stories. Skips storage and the network. */
  previewModel?: ReportModel;
};

const noAudit = (): null => null;
const questionHrefTo = (href: string) => (): string => href;

const isScoreAreaId = (value: string): value is ScoreAreaId =>
  (scoreAreaIds as readonly string[]).includes(value);

/** One area's detail: how it is built, evidence, gaps and recommendations, from the server's report. */
export function ScoreDetailPage({
  area,
  reportHref = routes.report,
  intakeHref = routes.intake,
  quickStartHref = routes.quickStart,
  loadAudit,
  previewModel,
}: ScoreDetailPageProps): ReactNode {
  if (!isScoreAreaId(area)) notFound();
  const live = useReportModel({ loadAudit: previewModel ? noAudit : loadAudit });
  const state: ReportModelState = previewModel
    ? { status: 'ready', model: previewModel, retry: live.retry }
    : live;
  const root = useFocusHeading(state.status, state.status !== 'loading');

  const found = state.model?.areas.find((a) => a.id === area);

  return (
    <div ref={root} className={styles.root}>
      {state.status === 'ready' && found ? (
        <>
          {state.model.configVersionMismatch ? (
            <ReportVersionNotice reviewHref={intakeHref} />
          ) : null}
          <ScoreDetail
            area={found}
            recommendations={state.model.recommendations}
            sample={state.model.isSample}
            questionHref={questionHrefTo(intakeHref)}
            backHref={reportHref}
          />
        </>
      ) : (
        <ReportStateMessage
          state={state.status === 'ready' ? 'error' : state.status}
          onRetry={state.retry}
          quickStartHref={quickStartHref}
          intakeHref={intakeHref}
        />
      )}
    </div>
  );
}
