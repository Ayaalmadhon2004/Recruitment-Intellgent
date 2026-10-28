'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Audit } from '@/domain/types';
import type { ReportModel } from './contract';
import { loadDeviceAudit } from './storedAudit';

export type ReportModelState =
  | { status: 'loading'; model: undefined; retry: () => void }
  | { status: 'empty'; model: undefined; retry: () => void }
  | { status: 'error'; model: undefined; retry: () => void }
  | { status: 'ready'; model: ReportModel; retry: () => void };

export type UseReportModelOptions = {
  /** Where the audit comes from. Defaults to this device's stored answers. Keep the reference stable. */
  loadAudit?: () => Audit | null;
};

type Outcome =
  | { attempt: number; kind: 'empty' | 'error' }
  | { attempt: number; kind: 'ready'; model: ReportModel };

/** Scores are never stored or computed here: the server builds the model from the posted answers. */
async function fetchModel(audit: Audit): Promise<ReportModel | undefined> {
  try {
    const response = await fetch('/api/report', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ audit, isSample: false }),
    });
    if (!response.ok) return undefined;
    return (await response.json()) as ReportModel;
  } catch {
    return undefined;
  }
}

/** Loads the stored audit, asks the server for the report and returns its state. Nothing is cached. */
export function useReportModel({
  loadAudit = loadDeviceAudit,
}: UseReportModelOptions = {}): ReportModelState {
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>();

  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<void> => {
      const audit = loadAudit();
      let next: Outcome;
      if (!audit) {
        next = { attempt, kind: 'empty' };
      } else {
        const model = await fetchModel(audit);
        next = model ? { attempt, kind: 'ready', model } : { attempt, kind: 'error' };
      }
      if (!cancelled) setOutcome(next);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [attempt, loadAudit]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  // The server render and the first client render have read nothing yet: loading, never "empty".
  if (!outcome || outcome.attempt !== attempt)
    return { status: 'loading', model: undefined, retry };
  if (outcome.kind === 'ready') return { status: 'ready', model: outcome.model, retry };
  return { status: outcome.kind, model: undefined, retry };
}
