import { CONFIG_VERSION } from '@/domain/config';
import { sectionIds } from '@/domain/types';
import type {
  Answer,
  AnswerValue,
  DomainConfig,
  KnownEvidenceTag,
  Question,
  QuestionId,
  SectionId,
} from '@/domain/types';
import {
  countHandled,
  isUnsure,
  knownFor,
  setAnswer,
  setEvidence,
  toggleUnsure,
} from '@/features/questions';
import type { StoredAudit } from '../store';

/** Everything the Intake remembers. Scores are not part of it. */
export type IntakeState = {
  answers: readonly Answer[];
  /** Questions where the person picked an evidence tag themselves. */
  confirmedTagIds: readonly QuestionId[];
  sectionIndex: number;
};

export const emptyIntakeState: IntakeState = { answers: [], confirmedTagIds: [], sectionIndex: 0 };

export type SectionProgress = {
  id: SectionId;
  handled: number;
  total: number;
  complete: boolean;
};

export type OverallProgress = {
  handled: number;
  total: number;
  /** Questions marked "Not sure". */
  unsure: number;
};

const without = (ids: readonly QuestionId[], id: QuestionId): QuestionId[] =>
  ids.filter((x) => x !== id);

/** Record a value. A tag the person already confirmed is kept; otherwise the default tag stands in. */
export const answerQuestion = (
  state: IntakeState,
  id: QuestionId,
  value: AnswerValue,
  config: DomainConfig,
): IntakeState => ({ ...state, answers: setAnswer(state.answers, id, value, config) });

/** "Not sure" drops the value, and with it any tag the person had picked. */
export const toggleNotSure = (state: IntakeState, id: QuestionId): IntakeState => ({
  ...state,
  answers: toggleUnsure(state.answers, id),
  confirmedTagIds: without(state.confirmedTagIds, id),
});

/** The person picks how they know an answer. Only an answered question can have a tag. */
export function confirmEvidence(
  state: IntakeState,
  id: QuestionId,
  tag: KnownEvidenceTag,
  config: DomainConfig,
): IntakeState {
  if (!knownFor(state.answers, id)) return state;
  return {
    ...state,
    answers: setEvidence(state.answers, id, tag, config),
    confirmedTagIds: [...without(state.confirmedTagIds, id), id],
  };
}

export const goToSection = (state: IntakeState, index: number): IntakeState => ({
  ...state,
  sectionIndex: Math.min(Math.max(0, Math.trunc(index)), sectionIds.length - 1),
});

/** The tag the person chose, or undefined while only the stand-in default is stored. */
export const confirmedTagFor = (
  state: IntakeState,
  id: QuestionId,
): KnownEvidenceTag | undefined =>
  state.confirmedTagIds.includes(id) ? knownFor(state.answers, id)?.evidence : undefined;

export const questionsInSection = (
  questions: readonly Question[],
  section: SectionId,
): Question[] => questions.filter((q) => q.section === section);

export const sectionProgress = (
  state: IntakeState,
  questions: readonly Question[],
): SectionProgress[] =>
  sectionIds.map((id) => {
    const ids = questionsInSection(questions, id).map((q) => q.id);
    const handled = countHandled(state.answers, ids);
    return { id, handled, total: ids.length, complete: ids.length > 0 && handled === ids.length };
  });

export function overallProgress(
  state: IntakeState,
  questions: readonly Question[],
): OverallProgress {
  const ids = questions.map((q) => q.id);
  return {
    handled: countHandled(state.answers, ids),
    total: ids.length,
    unsure: ids.filter((id) => isUnsure(state.answers, id)).length,
  };
}

export type Hydrated = {
  state: IntakeState;
  /** The saved audit was made under another config version. */
  versionChanged: boolean;
};

/**
 * Builds the starting state from a saved audit. Answers for questions that no longer exist are dropped;
 * everything else is kept even when the config version differs (the caller shows a notice).
 */
export function hydrate(stored: StoredAudit, questions: readonly Question[]): Hydrated {
  const known = new Set<QuestionId>(questions.map((q) => q.id));
  const answers = stored.answers.filter((a) => known.has(a.questionId));
  const kept = new Set(answers.map((a) => a.questionId));
  const confirmedTagIds = stored.confirmedTagIds.filter(
    (id) => kept.has(id) && knownFor(answers, id) !== undefined,
  );
  return {
    state: goToSection({ answers, confirmedTagIds, sectionIndex: 0 }, stored.sectionIndex),
    versionChanged: stored.configVersion !== CONFIG_VERSION,
  };
}

export const toStored = (state: IntakeState): StoredAudit => ({
  configVersion: CONFIG_VERSION,
  answers: [...state.answers],
  confirmedTagIds: [...state.confirmedTagIds],
  sectionIndex: state.sectionIndex,
});
