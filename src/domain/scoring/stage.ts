import type { Answer, DomainConfig, StageResult } from '../types';
import { findAnswer } from './answers';
import { notScorable } from './result';

/**
 * Pick the stage from the configured headcount question (Vietnamese students enrolled).
 * No answer, "Not sure", or a value that is not a whole number of at least 0 gives NotScorable.
 */
export function pickStage(answers: readonly Answer[], config: DomainConfig): StageResult {
  const questionId = config.stages.source.questionId;
  const answer = findAnswer(answers, questionId);
  if (answer?.kind !== 'known') return notScorable('missing-answers', [questionId]);

  const headcount = answer.value;
  if (typeof headcount !== 'number' || !Number.isInteger(headcount) || headcount < 0) {
    return notScorable('invalid-answer', [questionId]);
  }

  const stage = config.stages.stages.find(
    (s) => headcount >= s.min && (s.max === null || headcount <= s.max),
  );
  if (!stage) return notScorable('invalid-answer', [questionId]);
  return { kind: 'staged', stage: stage.id };
}
