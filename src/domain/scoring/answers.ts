import type { Answer, KnownAnswer, QuestionId } from '../types';

/** The latest answer for a question, if any. */
export function findAnswer(answers: readonly Answer[], id: QuestionId): Answer | undefined {
  for (let i = answers.length - 1; i >= 0; i -= 1) {
    const answer = answers[i];
    if (answer?.questionId === id) return answer;
  }
  return undefined;
}

/** "Not sure" counts as not answered: we never guess a score from it. */
export function findKnownAnswer(answers: readonly Answer[], id: QuestionId): KnownAnswer | undefined {
  const answer = findAnswer(answers, id);
  return answer?.kind === 'known' ? answer : undefined;
}

export function isAnswered(answers: readonly Answer[], id: QuestionId): boolean {
  return findKnownAnswer(answers, id) !== undefined;
}
