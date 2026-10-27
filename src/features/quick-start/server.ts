import { domainConfig, questionsConfig } from '@/domain/config';
import { isAnswered, pickStage, scoreArea } from '@/domain/scoring';
import {
  confidences,
  scoreAreaIds,
  type Answer,
  type AnswerValue,
  type Confidence,
  type DomainConfig,
  type KnownEvidenceTag,
  type QuestionId,
  type ScoreAreaId,
  type ScoreResult,
} from '@/domain/types';
import type { FirstReadResponse } from './contract';

/** Server-only helpers for POST /api/first-read. No React, nothing stored. */

export const MAX_ANSWERS = 200;
export const MAX_ARRAY_LENGTH = 50;
export const MAX_STRING_LENGTH = 200;

export type ParseResult = { ok: true; answers: Answer[] } | { ok: false; message: string };

const knownEvidence: readonly KnownEvidenceTag[] = [
  'verified',
  'institution-reported',
  'estimate',
  'judgement',
];
// Accepts a section letter A-F then digits: "B1", "F12" match; "G1", "b1", "B" do not.
const questionIdPattern = /^[A-F]\d+$/;
const knownQuestionIds: ReadonlySet<string> = new Set(questionsConfig.map((q) => q.id));

function fail(message: string): ParseResult {
  return { ok: false, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseValue(value: unknown): AnswerValue | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') return value.length <= MAX_STRING_LENGTH ? value : undefined;
  if (Array.isArray(value)) {
    const items = value as unknown[];
    const valid =
      items.length > 0 &&
      items.length <= MAX_ARRAY_LENGTH &&
      items.every((i) => typeof i === 'string' && i.length <= MAX_STRING_LENGTH);
    return valid ? (items as string[]) : undefined;
  }
  return undefined;
}

/** One answer, or the message saying why it is invalid. */
function parseAnswer(item: unknown, at: string): Answer | string {
  if (!isRecord(item)) return `${at} must be an object.`;

  const id = item.questionId;
  if (typeof id !== 'string' || !questionIdPattern.test(id)) return `${at}.questionId must look like "A1".`;
  if (!knownQuestionIds.has(id)) return `${at}.questionId "${id}" is not a known question.`;
  const questionId = id as QuestionId;

  if (item.kind === 'unknown') return { kind: 'unknown', questionId };
  if (item.kind !== 'known') return `${at}.kind must be "known" or "unknown".`;

  const value = parseValue(item.value);
  if (value === undefined) {
    return `${at}.value must be a finite number, boolean, string or non-empty string array.`;
  }
  if (typeof item.evidence !== 'string' || !knownEvidence.includes(item.evidence as KnownEvidenceTag)) {
    return `${at}.evidence is not a valid evidence tag.`;
  }
  if (typeof item.confidence !== 'string' || !confidences.includes(item.confidence as Confidence)) {
    return `${at}.confidence is not a valid confidence.`;
  }
  return {
    kind: 'known',
    questionId,
    value,
    evidence: item.evidence as KnownEvidenceTag,
    confidence: item.confidence as Confidence,
  };
}

/** Strict validation of the request body. Duplicates are kept: the domain uses the latest answer. */
export function parseFirstReadRequest(body: unknown): ParseResult {
  if (!isRecord(body)) return fail('Body must be an object with an "answers" array.');
  const raw = body.answers;
  if (!Array.isArray(raw)) return fail('"answers" must be an array.');
  if (raw.length === 0) return fail('"answers" must not be empty.');
  if (raw.length > MAX_ANSWERS) return fail(`"answers" must have at most ${MAX_ANSWERS} items.`);

  const parsed = (raw as unknown[]).map((item, index) => parseAnswer(item, `answers[${index}]`));
  const error = parsed.find((p): p is string => typeof p === 'string');
  return error === undefined ? { ok: true, answers: parsed as Answer[] } : fail(error);
}

/** Stage and all six areas from stored answers. Areas without a formula stay NotScorable. */
export function computeFirstRead(
  answers: readonly Answer[],
  config: DomainConfig = domainConfig,
): FirstReadResponse {
  const quickStartIds = config.questions.filter((q) => q.quickStart).map((q) => q.id);
  const areas = Object.fromEntries(
    scoreAreaIds.map((id) => [id, scoreArea(id, answers, config)]),
  ) as Record<ScoreAreaId, ScoreResult>;
  return {
    configVersion: config.version,
    answeredCount: quickStartIds.filter((id) => isAnswered(answers, id)).length,
    quickStartTotal: quickStartIds.length,
    stage: pickStage(answers, config),
    areas,
  };
}
