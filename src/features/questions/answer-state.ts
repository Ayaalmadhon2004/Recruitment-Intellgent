import { confidenceFor } from '@/domain/scoring';
import type {
  Answer,
  AnswerValue,
  DomainConfig,
  KnownAnswer,
  KnownEvidenceTag,
  QuestionId,
} from '@/domain/types';

/**
 * Pure helpers over the list of answers. The list is the only state: it is what gets stored, together with
 * the config version. Scores are never kept here.
 */

const without = (answers: readonly Answer[], id: QuestionId): Answer[] =>
  answers.filter((a) => a.questionId !== id);

export const answerFor = (answers: readonly Answer[], id: QuestionId): Answer | undefined =>
  answers.find((a) => a.questionId === id);

export const knownFor = (answers: readonly Answer[], id: QuestionId): KnownAnswer | undefined => {
  const answer = answerFor(answers, id);
  return answer?.kind === 'known' ? answer : undefined;
};

export const isUnsure = (answers: readonly Answer[], id: QuestionId): boolean =>
  answerFor(answers, id)?.kind === 'unknown';

/**
 * Record a value. The evidence tag is kept if the question already has one, otherwise `tag` (or the
 * configured default for flows that do not ask). Confidence always follows the tag through config.
 */
export function setAnswer(
  answers: readonly Answer[],
  id: QuestionId,
  value: AnswerValue,
  config: DomainConfig,
  tag?: KnownEvidenceTag,
): Answer[] {
  const evidence = tag ?? knownFor(answers, id)?.evidence ?? config.evidence.defaultTag;
  const next: KnownAnswer = {
    kind: 'known',
    questionId: id,
    value,
    evidence,
    confidence: confidenceFor(evidence, config),
  };
  return [...without(answers, id), next];
}

/** Change how an existing answer is known. Does nothing if the question has no answer yet. */
export function setEvidence(
  answers: readonly Answer[],
  id: QuestionId,
  tag: KnownEvidenceTag,
  config: DomainConfig,
): Answer[] {
  const current = knownFor(answers, id);
  if (!current) return [...answers];
  return setAnswer(answers, id, current.value, config, tag);
}

/** "Not sure" toggles: on removes any value, off clears the mark. */
export function toggleUnsure(answers: readonly Answer[], id: QuestionId): Answer[] {
  if (isUnsure(answers, id)) return without(answers, id);
  return [...without(answers, id), { kind: 'unknown', questionId: id }];
}

/** Questions with a real answer or an explicit "Not sure". */
export const countHandled = (answers: readonly Answer[], ids: readonly QuestionId[]): number =>
  ids.filter((id) => answerFor(answers, id) !== undefined).length;
