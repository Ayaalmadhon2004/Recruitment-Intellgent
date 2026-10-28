import { domainConfig } from '@/domain/config';
import { findAnswer, findKnownAnswer, pickStage, scoreArea, scoreGauge } from '@/domain/scoring';
import {
  gaugeIds,
  scoreAreaIds,
  type Audit,
  type DomainConfig,
  type GaugeId,
  type Question,
  type ScoreAreaId,
} from '@/domain/types';
import { isRecord, parseAnswerList } from '@/domain/validation/answers';
import type { ReportArea, ReportEvidence, ReportGap, ReportGauge, ReportModel } from './contract';

/** Server-only: builds the ReportModel from an Audit plus a config. No React, nothing stored. */

export const MAX_TEXT_LENGTH = 200;

export type ReportParseResult = { ok: true; audit: Audit; isSample: boolean } | Failure;

type Failure = { ok: false; message: string };

function fail(message: string): Failure {
  return { ok: false, message };
}

const entitlements = ['free', 'unlocked'] as const;
const auditStatuses = ['in-progress', 'complete'] as const;

function feeds(question: Question, target: ScoreAreaId | GaugeId): boolean {
  return question.feeds.some((f) => f.area === target);
}

function buildArea(id: ScoreAreaId, audit: Audit, config: DomainConfig): ReportArea {
  // A free audit never receives a hidden area's result, evidence or gaps: the browser cannot reveal them.
  if (audit.entitlement === 'free' && config.access.lockedWhenFree.includes(id)) {
    return { id, locked: true };
  }
  const feeding = config.questions.filter((q) => feeds(q, id));
  const evidence: ReportEvidence[] = feeding.flatMap((q) => {
    const answer = findKnownAnswer(audit.answers, q.id);
    return answer === undefined
      ? []
      : [{ questionId: q.id, tag: answer.evidence, confidence: answer.confidence }];
  });
  const gaps: ReportGap[] = feeding
    .filter((q) => findKnownAnswer(audit.answers, q.id) === undefined)
    .map((q) => ({ questionId: q.id }));
  return {
    id,
    locked: false,
    result: scoreArea(id, audit.answers, config),
    evidence,
    gaps,
  };
}

function buildGauge(id: GaugeId, audit: Audit, config: DomainConfig): ReportGauge {
  return { id, result: scoreGauge(id, audit.answers, config) };
}

/** Pure and deterministic. Scores come from stored answers plus the config, never from stored scores. */
export function buildReportModel(
  audit: Audit,
  options: { readonly isSample: boolean },
  config: DomainConfig = domainConfig,
): ReportModel {
  const handled = config.questions.filter(
    (q) => findAnswer(audit.answers, q.id) !== undefined,
  ).length;
  const unknown = config.questions.filter(
    (q) => findAnswer(audit.answers, q.id)?.kind === 'unknown',
  ).length;

  return {
    configVersion: config.version,
    ...(audit.configVersion !== config.version ? { configVersionMismatch: true } : {}),
    institutionName: audit.institutionName,
    isSample: options.isSample,
    stage: pickStage(audit.answers, config),
    completeness: { handled, total: config.questions.length, unknown },
    areas: scoreAreaIds.map((id) => buildArea(id, audit, config)),
    gauges: gaugeIds.map((id) => buildGauge(id, audit, config)),
    recommendations: [],
    unlocked: audit.entitlement === 'unlocked',
    pilot: config.agents.pilot,
  };
}

function text(value: unknown, name: string): string | Failure {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_TEXT_LENGTH) {
    return fail(
      `audit.${name} must be a non-empty string of at most ${MAX_TEXT_LENGTH} characters.`,
    );
  }
  return value;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], name: string): T | Failure {
  return (
    allowed.find((a) => a === value) ?? fail(`audit.${name} must be one of: ${allowed.join(', ')}.`)
  );
}

/** Strict validation of the request body. Answers reuse the shared domain validation. */
export function parseReportRequest(body: unknown): ReportParseResult {
  if (!isRecord(body)) return fail('Body must be an object with an "audit" object.');
  const raw = body.audit;
  if (!isRecord(raw)) return fail('"audit" must be an object.');
  if (body.isSample !== undefined && typeof body.isSample !== 'boolean')
    return fail('"isSample" must be a boolean.');

  const id = text(raw.id, 'id');
  if (typeof id !== 'string') return id;
  const institutionName = text(raw.institutionName, 'institutionName');
  if (typeof institutionName !== 'string') return institutionName;
  const configVersion = text(raw.configVersion, 'configVersion');
  if (typeof configVersion !== 'string') return configVersion;
  const status = oneOf(raw.status, auditStatuses, 'status');
  if (typeof status !== 'string') return status;
  const entitlement = oneOf(raw.entitlement, entitlements, 'entitlement');
  if (typeof entitlement !== 'string') return entitlement;

  const answers = parseAnswerList(raw.answers, 'audit.answers');
  if (!answers.ok) return answers;

  return {
    ok: true,
    isSample: body.isSample ?? false,
    audit: { id, institutionName, answers: answers.answers, status, configVersion, entitlement },
  };
}
