import type { AuditSummariesRequest, AuditSummariesResponse } from './contract';
import type { SavedAudit } from './types';

/** Asks the server for each audit's stage. Answers go up; stages come back. Undefined means unavailable. */
export async function fetchAuditSummaries(
  audits: readonly SavedAudit[],
): Promise<AuditSummariesResponse | undefined> {
  if (audits.length === 0) return { configVersion: '', summaries: [] };
  const body: AuditSummariesRequest = {
    audits: audits.map((a) => ({
      id: a.id,
      configVersion: a.stored.configVersion,
      answers: a.stored.answers,
    })),
  };
  try {
    const response = await fetch('/api/audit-summaries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) return undefined;
    return (await response.json()) as AuditSummariesResponse;
  } catch {
    return undefined;
  }
}
