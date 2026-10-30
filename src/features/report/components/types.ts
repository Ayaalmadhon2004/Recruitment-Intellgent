import type { QuestionId } from '@/domain/types';

/** Where the report's buttons and links go. A missing link means that action is not shown. */
export type ReportLinks = {
  continueHref?: string;
  changeAnswersHref?: string;
  unlockHref?: string;
  pdfHref?: string;
  /** The agent matrix (agent strategy) page. */
  agentStrategyHref?: string;
  /** Where to talk to a person. */
  advisorHref?: string;
  /** Where to answer a missing question. When it returns a value the question is a link. */
  questionHref?: (id: QuestionId) => string | undefined;
};
