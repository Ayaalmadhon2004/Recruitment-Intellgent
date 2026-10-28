import { domainConfig } from '@/domain/config';
import { pickStage } from '@/domain/scoring';
import type { Answer, DomainConfig } from '@/domain/types';
import { isRecord, parseAnswerList } from '@/domain/validation/answers';
import type { AuditSummariesResponse } from './contract';

/** Server-only helpers for POST /api/audit-summaries. No React, nothing stored. */

export const MAX_AUDITS = 50;
const MAX_TEXT = 200;

type ParsedAudit = { id: string; configVersion: string; answers: Answer[] };
export type ParseSummariesResult =
  { ok: true; audits: ParsedAudit[] } | { ok: false; message: string };

/** Strict validation of the request body. */
export function parseAuditSummariesRequest(body: unknown): ParseSummariesResult {
  if (!isRecord(body) || !Array.isArray(body.audits)) {
    return { ok: false, message: 'Body must be an object with an "audits" array.' };
  }
  if (body.audits.length > MAX_AUDITS) {
    return { ok: false, message: `"audits" must have at most ${MAX_AUDITS} items.` };
  }
  const audits: ParsedAudit[] = [];
  for (const [index, item] of (body.audits as unknown[]).entries()) {
    const at = `audits[${index}]`;
    if (!isRecord(item)) return { ok: false, message: `${at} must be an object.` };
    const { id, configVersion } = item;
    if (typeof id !== 'string' || id === '' || id.length > MAX_TEXT) {
      return { ok: false, message: `${at}.id must be a short text.` };
    }
    if (
      typeof configVersion !== 'string' ||
      configVersion === '' ||
      configVersion.length > MAX_TEXT
    ) {
      return { ok: false, message: `${at}.configVersion must be a short text.` };
    }
    const answers = parseAnswerList(item.answers, `${at}.answers`);
    if (!answers.ok) return { ok: false, message: answers.message };
    audits.push({ id, configVersion, answers: answers.answers });
  }
  return { ok: true, audits };
}

/** The stage of each audit, recomputed from its answers with the current config. */
export function summariseAudits(
  audits: readonly ParsedAudit[],
  config: DomainConfig = domainConfig,
): AuditSummariesResponse {
  return {
    configVersion: config.version,
    summaries: audits.map((a) => ({ id: a.id, stage: pickStage(a.answers, config) })),
  };
}
