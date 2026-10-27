import { CONFIG_VERSION, questionsConfig } from '@/domain/config';
import type { Answer, AnswerValue, Question, QuestionId } from '@/domain/types';
import type { StoredAudit } from './store';

/**
 * Stories only. Answers built from whatever the config asks, so the stories keep working when the real 40
 * questions replace the temporary ones. The values are placeholders to fill the screen, not sample facts.
 */
const valueFor = (q: Question): AnswerValue => {
  if (q.type === 'toggle') return true;
  if (q.type === 'number') return 5;
  const first = q.options[0]?.value ?? '';
  return q.type === 'chips' ? [first] : first;
};

const answerOf = (q: Question): Answer => ({
  kind: 'known',
  questionId: q.id,
  value: valueFor(q),
  evidence: 'verified',
  confidence: 'high',
});

const ids = (section: string): Question[] => questionsConfig.filter((q) => q.section === section);

const base = { configVersion: CONFIG_VERSION, answers: [], confirmedTagIds: [], sectionIndex: 0 };

/** Section A answered with confirmed tags, B half done with a Not sure, resumed at C. */
export const partlyAnswered: StoredAudit = {
  ...base,
  answers: [
    ...ids('A').map(answerOf),
    ...ids('B')
      .slice(0, 2)
      .map((q, i): Answer => (i === 0 ? answerOf(q) : { kind: 'unknown', questionId: q.id })),
  ],
  confirmedTagIds: ids('A').map((q): QuestionId => q.id),
  sectionIndex: 2,
};

/** Every question answered with a confirmed tag. */
export const allAnswered: StoredAudit = {
  ...base,
  answers: questionsConfig.map(answerOf),
  confirmedTagIds: questionsConfig.map((q): QuestionId => q.id),
  sectionIndex: 5,
};

/** Every question marked Not sure. */
export const allNotSure: StoredAudit = {
  ...base,
  answers: questionsConfig.map((q): Answer => ({ kind: 'unknown', questionId: q.id })),
  sectionIndex: 5,
};

/** Saved under an older config version. */
export const olderVersion: StoredAudit = { ...partlyAnswered, configVersion: 'vri-config-0.0.1' };
