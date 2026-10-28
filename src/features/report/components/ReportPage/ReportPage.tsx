'use client';

import type { ReactNode } from 'react';
import type { Audit } from '@/domain/types';
import type { ReportModel } from '../../contract';
import { useReportModel } from '../../useReportModel';
import type { ReportModelState } from '../../useReportModel';
import { ReportSection } from '../ReportSection';
import { ReportStateMessage } from '../ReportStateMessage';
import { ReportVersionNotice } from '../ReportVersionNotice';
import { useFocusHeading } from '../useFocusHeading';
import styles from './ReportPage.module.css';

export type ReportPageProps = {
  /** Where answering a question, changing answers and continuing the audit go. */
  intakeHref?: string;
  quickStartHref?: string;
  /** Replaces the stored audit. For tests and stories. Keep the reference stable. */
  loadAudit?: () => Audit | null;
  /** Fixed state for stories. Skips storage and the network. */
  previewState?: 'loading' | 'error' | 'empty';
  /** A ready report for stories. Skips storage and the network. */
  previewModel?: ReportModel;
};

const noAudit = (): null => null;
const ignore = (): void => undefined;

/** The state a story asks for, or undefined to use the live one. */
function fixedState(
  model: ReportModel | undefined,
  state: ReportPageProps['previewState'],
): ReportModelState | undefined {
  if (model) return { status: 'ready', model, retry: ignore };
  if (state) return { status: state, model: undefined, retry: ignore };
  return undefined;
}
const questionHrefTo = (href: string) => (): string => href;

/** The report page: loads this device's answers, asks the server for the report and draws it. */
export function ReportPage({
  intakeHref = '/intake',
  quickStartHref = '/quick-start',
  loadAudit,
  previewState,
  previewModel,
}: ReportPageProps): ReactNode {
  const preview = previewState !== undefined || previewModel !== undefined;
  const live = useReportModel({ loadAudit: preview ? noAudit : loadAudit });
  const state = fixedState(previewModel, previewState) ?? live;
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
