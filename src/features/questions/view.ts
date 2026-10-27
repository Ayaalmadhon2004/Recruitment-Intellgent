import { en } from '@/domain/copy';
import type { Question, QuestionId } from '@/domain/types';
import type { QuestionView } from '@/patterns';

type QuestionCopy = {
  text: string;
  help: string;
  control?: string;
  unit?: string;
  placeholder?: string;
  options?: Record<string, { label: string; description?: string }>;
};

const copyFor = (id: QuestionId): QuestionCopy => {
  const all: Partial<Record<string, QuestionCopy>> = en.questions;
  const copy = all[id];
  if (!copy) throw new Error(`No copy for question ${id}`);
  return copy;
};

/** Turns a domain question into the text-resolved view the QuestionCard pattern renders. */
export function toQuestionView(question: Question): QuestionView {
  const copy = copyFor(question.id);
  const view: QuestionView = {
    id: question.id,
    type: question.type,
    text: copy.text,
    help: copy.help,
    controlLabel: copy.control,
    unit: copy.unit,
    placeholder: copy.placeholder,
  };
  if (question.type === 'select' || question.type === 'radio' || question.type === 'chips') {
    return {
      ...view,
      options: question.options.map((o) => {
        const option = copy.options?.[o.value];
        if (!option) throw new Error(`No copy for ${question.id} option ${o.value}`);
        return { value: o.value, label: option.label, description: option.description };
      }),
    };
  }
  return view;
}
