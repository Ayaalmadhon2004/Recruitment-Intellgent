import { confidences, evidenceTags, sectionIds } from '@/domain/types';
import type { Answer, QuestionId } from '@/domain/types';
import type { StoredAudit } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sectionLetters: readonly string[] = sectionIds;

// A section letter then digits. Accepts "C3", rejects "Z9" (no such section) and "3C".
const isQuestionId = (value: unknown): value is QuestionId =>
  typeof value === 'string' &&
  /^[A-Z]\d+$/.test(value) &&
  sectionLetters.includes(value.slice(0, 1));

const isAnswerValue = (value: unknown): boolean =>
  typeof value === 'boolean' ||
  typeof value === 'string' ||
  (typeof value === 'number' && Number.isFinite(value)) ||
  (Array.isArray(value) && value.every((v) => typeof v === 'string'));

const knownTags: readonly string[] = evidenceTags.filter((tag) => tag !== 'unknown');

const isAnswer = (value: unknown): value is Answer => {
  if (!isRecord(value) || !isQuestionId(value.questionId)) return false;
  if (value.kind === 'unknown') return true;
  return (
    value.kind === 'known' &&
    isAnswerValue(value.value) &&
    typeof value.evidence === 'string' &&
    knownTags.includes(value.evidence) &&
    typeof value.confidence === 'string' &&
    (confidences as readonly string[]).includes(value.confidence)
  );
};

/** Turns whatever was stored into a StoredAudit, or null when it is not one. Nothing partial is kept. */
export function parseStoredAudit(raw: unknown): StoredAudit | null {
  if (!isRecord(raw)) return null;
  const { configVersion, answers, confirmedTagIds, sectionIndex } = raw;
  if (typeof configVersion !== 'string' || configVersion === '') return null;
  if (!Array.isArray(answers) || !answers.every(isAnswer)) return null;
  if (!Array.isArray(confirmedTagIds) || !confirmedTagIds.every(isQuestionId)) return null;
  if (typeof sectionIndex !== 'number' || !Number.isInteger(sectionIndex) || sectionIndex < 0) {
    return null;
  }
  const ids = answers.map((a) => a.questionId);
  if (new Set(ids).size !== ids.length) return null;
  return { configVersion, answers, confirmedTagIds, sectionIndex };
}
