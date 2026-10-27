import { questionsConfig } from '../config';
import {
  confidences,
  type Answer,
  type AnswerValue,
  type Confidence,
  type KnownEvidenceTag,
  type QuestionId,
} from '../types';

/** Pure validation of answers received from outside (request bodies). No React, no I/O. */

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

export function fail(message: string): ParseResult {
  return { ok: false, message };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
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
  if (typeof id !== 'string' || !questionIdPattern.test(id))
    return `${at}.questionId must look like "A1".`;
  if (!knownQuestionIds.has(id)) return `${at}.questionId "${id}" is not a known question.`;
  const questionId = id as QuestionId;

  if (item.kind === 'unknown') return { kind: 'unknown', questionId };
  if (item.kind !== 'known') return `${at}.kind must be "known" or "unknown".`;

  const value = parseValue(item.value);
  if (value === undefined) {
    return `${at}.value must be a finite number, boolean, string or non-empty string array.`;
  }
  if (
    typeof item.evidence !== 'string' ||
    !knownEvidence.includes(item.evidence as KnownEvidenceTag)
  ) {
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

/**
 * Validates a list of answers (shared by every route that accepts answers). `path` prefixes messages.
 * Duplicates are kept: the domain uses the latest answer. Empty lists are allowed here.
 */
export function parseAnswerList(raw: unknown, path: string): ParseResult {
  if (!Array.isArray(raw)) return fail(`"${path}" must be an array.`);
  if (raw.length > MAX_ANSWERS) return fail(`"${path}" must have at most ${MAX_ANSWERS} items.`);

  const parsed = (raw as unknown[]).map((item, index) => parseAnswer(item, `${path}[${index}]`));
  const error = parsed.find((p): p is string => typeof p === 'string');
  return error === undefined ? { ok: true, answers: parsed as Answer[] } : fail(error);
}
