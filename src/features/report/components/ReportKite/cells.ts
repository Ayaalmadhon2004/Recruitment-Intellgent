import { questionsConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { sectionIds } from '@/domain/types';
import type { Answer, SectionId } from '@/domain/types';

/**
 * How firm an answered cell is. It reads the confidence the answer already carries (it follows the evidence
 * tag through config). "Not sure" has no confidence at all, so it shows with the weakest look.
 * No score is computed here.
 */
export type CellState = 'empty' | 'strong' | 'medium' | 'weak';

export type KiteCell = { readonly id: string; readonly state: CellState };

export type KiteSection = {
  readonly id: SectionId;
  readonly name: string;
  readonly cells: readonly KiteCell[];
  readonly answered: number;
};

const stateOf = (answer: Answer | undefined): CellState => {
  if (!answer) return 'empty';
  if (answer.kind === 'unknown') return 'weak';
  if (answer.confidence === 'high') return 'strong';
  return answer.confidence === 'medium' ? 'medium' : 'weak';
};

/** One entry per section, one cell per question of that section, from the question list (never hard-coded). */
export function buildKiteSections(answers: readonly Answer[]): KiteSection[] {
  return sectionIds.map((id) => {
    const cells = questionsConfig
      .filter((q) => q.section === id)
      .map((q) => ({ id: q.id, state: stateOf(answers.find((a) => a.questionId === q.id)) }));
    return {
      id,
      name: en.sections[id],
      cells,
      answered: cells.filter((c) => c.state !== 'empty').length,
    };
  });
}
