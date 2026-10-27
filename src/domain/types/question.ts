import type { CopyKey } from '../copy';
import type { AffordabilityComponentId, GaugeId, QuestionId, ScoreAreaId, SectionId } from './ids';

/** Which score a question feeds. Optional component narrows it inside Affordability. */
export type Feed = {
  readonly area: ScoreAreaId | GaugeId;
  readonly component?: AffordabilityComponentId;
};

export type QuestionOption = {
  /** Stable id stored in answers. The visible text comes from copy. */
  readonly value: string;
  readonly labelKey: CopyKey;
  readonly descriptionKey?: CopyKey;
};

type QuestionBase = {
  readonly id: QuestionId;
  readonly section: SectionId;
  readonly textKey: CopyKey;
  readonly helpKey: CopyKey;
  readonly feeds: readonly Feed[];
  readonly quickStart: boolean;
  /** True while the question text and options are a stand-in until Capstone confirms the 40. */
  readonly temporary: boolean;
};

export type ChoiceQuestion = QuestionBase & {
  readonly type: 'select' | 'radio' | 'chips';
  readonly options: readonly QuestionOption[];
  readonly controlLabelKey?: CopyKey;
};

export type NumberQuestion = QuestionBase & {
  readonly type: 'number';
  readonly controlLabelKey: CopyKey;
  readonly unitKey: CopyKey;
  readonly placeholderKey: CopyKey;
};

export type ToggleQuestion = QuestionBase & { readonly type: 'toggle' };

export type Question = ChoiceQuestion | NumberQuestion | ToggleQuestion;
