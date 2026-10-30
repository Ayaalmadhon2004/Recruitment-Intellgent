'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import type { Answer, Audit } from '@/domain/types';
import type { ReportModel } from '../../contract';
import { loadDeviceAudit } from '../../storedAudit';
import { useReportState } from '../../useReportModel';
import { ReportSection, ReportSkeleton } from '../ReportSection';
import { ReportStateMessage } from '../ReportStateMessage';
import { ReportVersionNotice } from '../ReportVersionNotice';
import { useFocusHeading } from '../useFocusHeading';
import styles from './ReportPage.module.css';

export type ReportPageProps = {
  /** Where answering a question, changing answers and continuing the audit go. */
  intakeHref?: string;
  /** Where "Download PDF" goes. */
  pdfHref?: string;
  quickStartHref?: string;
  /** Where "Unlock full report" and a locked area's "See unlock options" go. */
  unlockHref?: string;
  /** Replaces the stored audit. For tests and stories. Keep the reference stable. */
  loadAudit?: () => Audit | null;
  /** Fixed state for stories. Skips storage and the network. */
  previewState?: 'loading' | 'error' | 'empty';
  /** A ready report for stories. Skips storage and the network. */
  previewModel?: ReportModel;
  /** The answers behind a preview model, for the kite in stories. */
  previewAnswers?: readonly Answer[];
};

const questionHrefTo = (href: string) => (): string => href;

/** The report page: loads this device's answers, asks the server for the report and draws it. */
export function ReportPage({
  intakeHref = '/intake',
  pdfHref = routes.reportPdf,
  quickStartHref = '/quick-start',
  unlockHref = routes.unlock,
  loadAudit,
  previewState,
  previewModel,
  previewAnswers,
}: ReportPageProps): ReactNode {
  const preview = previewState !== undefined || previewModel !== undefined;
  const state = useReportState({ loadAudit, previewState, previewModel });
  // The kite needs which questions were answered, which the model does not carry: read the same stored audit.
  const ready = state.status === 'ready';
  const answers = useMemo(
    () => (!ready ? undefined : preview ? previewAnswers : (loadAudit ?? loadDeviceAudit)()?.answers),
    [ready, preview, previewAnswers, loadAudit],
  );
  const root = useFocusHeading(state.status, state.status !== 'loading' || preview);

  return (
    <div ref={root} className={styles.root}>
      {state.status === 'ready' ? (
        <>
          {state.model.configVersionMismatch ? (
            <ReportVersionNotice reviewHref={intakeHref} />
          ) : null}
          <ReportSection
            model={state.model}
            mode="interactive"
            links={{
              continueHref: intakeHref,
              changeAnswersHref: intakeHref,
              questionHref: questionHrefTo(intakeHref),
              pdfHref,
              unlockHref,
              agentStrategyHref: routes.agentStrategy,
              advisorHref: routes.advisor,
            }}
            answers={answers}
          />
        </>
      ) : state.status === 'loading' ? (
        <ReportSkeleton />
      ) : (
        <ReportStateMessage
          state={state.status}
          onRetry={state.retry}
          quickStartHref={quickStartHref}
          intakeHref={intakeHref}
        />
      )}
    </div>
  );
}
