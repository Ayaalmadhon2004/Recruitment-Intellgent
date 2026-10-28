import { domainConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import type { Answer, Audit, AuditStatus, DomainConfig } from '@/domain/types';
import { createLocalStorageStore } from './local-storage-store';
import type { AnswerStore } from './types';

/** The stored audit has no id of its own yet (no accounts): every device holds one audit. */
export const LOCAL_AUDIT_ID = 'local-audit';

export type LoadStoredAuditOptions = {
  /** Where the Intake keeps its answers. Defaults to this browser. */
  store?: AnswerStore;
  /**
   * Answers to use ONLY when the Intake store holds none (for example the Quick Start answers, a subset of
   * the Intake). Intake answers always win; the two are never merged.
   */
  fallbackAnswers?: () => readonly Answer[] | undefined;
  config?: DomainConfig;
};

/** Complete only when every configured question has an answer or a Not sure mark. */
export function deriveAuditStatus(answers: readonly Answer[], config: DomainConfig): AuditStatus {
  const handled = new Set(answers.map((a) => a.questionId));
  return config.questions.every((q) => handled.has(q.id)) ? 'complete' : 'in-progress';
}

/**
 * Read-only: the audit kept on this device as a domain `Audit`, or null when there are no answers.
 * Never throws and never writes. The institution name is a neutral placeholder because the Intake does not
 * ask for one. The entitlement is always `free` until Accounts and Unlock exist.
 */
export function loadStoredAudit({
  store = createLocalStorageStore(),
  fallbackAnswers,
  config = domainConfig,
}: LoadStoredAuditOptions = {}): Audit | null {
  const stored = store.load();
  const intakeAnswers = stored !== null && stored.answers.length > 0 ? stored : null;
  let fallback: readonly Answer[] | undefined;
  if (!intakeAnswers) {
    try {
      fallback = fallbackAnswers?.();
    } catch {
      fallback = undefined;
    }
  }
  const answers = intakeAnswers ? intakeAnswers.answers : fallback;
  if (!answers || answers.length === 0) return null;
  return {
    id: LOCAL_AUDIT_ID,
    institutionName: en.reportPage.institutionName,
    answers,
    status: deriveAuditStatus(answers, config),
    configVersion: intakeAnswers ? intakeAnswers.configVersion : config.version,
    entitlement: 'free',
  };
}
