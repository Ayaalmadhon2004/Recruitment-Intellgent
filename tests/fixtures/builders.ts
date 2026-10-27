import type {
  AnswerValue,
  Confidence,
  KnownAnswer,
  KnownEvidenceTag,
  QuestionId,
  UnknownAnswer,
} from '@/domain/types';

export function known(
  questionId: QuestionId,
  value: AnswerValue,
  evidence: KnownEvidenceTag = 'verified',
  confidence: Confidence = 'high',
): KnownAnswer {
  return { kind: 'known', questionId, value, evidence, confidence };
}

export function unknown(questionId: QuestionId): UnknownAnswer {
  return { kind: 'unknown', questionId };
}
