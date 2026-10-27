import type { QuestionId } from './ids';

export const evidenceTags = [
  'verified',
  'institution-reported',
  'estimate',
  'judgement',
  'unknown',
] as const;
export type EvidenceTag = (typeof evidenceTags)[number];
export type KnownEvidenceTag = Exclude<EvidenceTag, 'unknown'>;

export const confidences = ['high', 'medium', 'low'] as const;
export type Confidence = (typeof confidences)[number];

/** Number for number questions, boolean for toggles, string[] for chips, option id otherwise. */
export type AnswerValue = number | boolean | string | readonly string[];

/** A real answer. It always has a value, an evidence tag other than "unknown", and a confidence. */
export type KnownAnswer = {
  readonly kind: 'known';
  readonly questionId: QuestionId;
  readonly value: AnswerValue;
  readonly evidence: KnownEvidenceTag;
  readonly confidence: Confidence;
};

/** "Not sure". No value and no confidence: we never guess a score from it. */
export type UnknownAnswer = {
  readonly kind: 'unknown';
  readonly questionId: QuestionId;
};

export type Answer = KnownAnswer | UnknownAnswer;
