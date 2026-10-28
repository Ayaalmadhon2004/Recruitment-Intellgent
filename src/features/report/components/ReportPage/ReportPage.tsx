'use client';

import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import type { Audit } from '@/domain/types';
import type { ReportModel } from '../../contract';
import { useReportState } from '../../useReportModel';
import { ReportSection } from '../ReportSection';
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
}: ReportPageProps): ReactNode {
  const preview = previewState !== undefined || previewModel !== undefined;
  const state = useReportState({ loadAudit, previewState, previewModel });
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
            }}
          />
        </>
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
