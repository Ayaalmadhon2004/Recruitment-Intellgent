import { en } from '@/domain/copy';
import type { QuestionCardLabels, QuestionView } from '@/patterns';

/** Label bundle for QuestionCard stories and tests, resolved from the English copy file. */
export const questionCardLabels: QuestionCardLabels = {
  status: en.questionCard.status,
  notSure: en.questionCard.notSure,
  notSureActive: en.questionCard.notSureActive,
  unknownNote: en.questionCard.unknownNote,
  todoHint: en.questionCard.todoHint,
  choose: en.questionCard.choose,
  yes: en.questionCard.yes,
  no: en.questionCard.no,
  notAnswered: en.questionCard.notAnswered,
  evidence: {
    heading: en.questionCard.evidenceHeading,
    missing: en.questionCard.evidenceMissing,
    tags: {
      verified: en.evidenceTags.verified,
      'institution-reported': en.evidenceTags['institution-reported'],
      estimate: en.evidenceTags.estimate,
      judgement: en.evidenceTags.judgement,
    },
  },
};

/** One question of each type, using the Intake design wording where a copy key exists. Test data only. */
export const sampleQuestions: Record<QuestionView['type'], QuestionView> = {
  select: {
    id: 'A1',
    type: 'select',
    text: en.questions.A1.text,
    help: en.questions.A1.help,
    controlLabel: en.questions.A1.control,
    options: [
      { value: 'public-university', label: en.questions.A1.options['public-university'].label },
      { value: 'private-university', label: en.questions.A1.options['private-university'].label },
      { value: 'other', label: en.questions.A1.options.other.label },
    ],
  },
  radio: {
    id: 'B1',
    type: 'radio',
    text: 'Pick the closest match',
    help: 'Choose one.',
    options: [
      { value: 'one', label: 'Option one', description: 'First description' },
      { value: 'two', label: 'Option two', description: 'Second description' },
      { value: 'three', label: 'Option three' },
    ],
  },
  chips: {
    id: 'A3',
    type: 'chips',
    text: 'Which levels can Vietnamese students join?',
    help: 'Choose all that apply.',
    options: [
      { value: 'bachelor', label: 'Bachelor' },
      { value: 'master', label: 'Master' },
      { value: 'doctorate', label: 'Doctorate' },
      { value: 'pathway', label: 'Pathway' },
    ],
  },
  number: {
    id: 'D1',
    type: 'number',
    text: 'How many Vietnamese students do you enrol each year?',
    help: 'Use your best figure.',
    controlLabel: 'Students per year',
    unit: 'students',
    placeholder: '0',
  },
  toggle: {
    id: 'F4',
    type: 'toggle',
    text: en.questions.F4.text,
    help: en.questions.F4.help,
  },
};
