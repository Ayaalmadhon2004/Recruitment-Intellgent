import { en } from '@/domain/copy';
import type { QuestionCardLabels } from '@/patterns';

const base = {
  status: en.questionCard.status,
  notSure: en.questionCard.notSure,
  notSureActive: en.questionCard.notSureActive,
  unknownNote: en.questionCard.unknownNote,
  todoHint: en.questionCard.todoHint,
  choose: en.questionCard.choose,
  yes: en.questionCard.yes,
  no: en.questionCard.no,
  notAnswered: en.questionCard.notAnswered,
};

/** Labels for flows that ask no evidence tag (Quick Start). */
export const questionCardLabels: QuestionCardLabels = base;

/** Labels for flows that also ask how the answer is known (full Intake). */
export const questionCardLabelsWithEvidence: QuestionCardLabels = {
  ...base,
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
