import { sectionIds } from '../types';
import { questionsConfig } from './questions.config';

/**
 * The single source of truth for audit scope. Every question count and section count shown anywhere
 * (landing, Quick Start, Intake, dashboard) is read from here, and this is derived from the question
 * list, so it can never disagree with what the person is actually asked. Today it is the 24 temporary
 * questions and 5 Quick Start questions; when Capstone confirms the real 40 (unknown 2) it follows.
 */
export const auditScope = {
  totalQuestions: questionsConfig.length,
  quickStartQuestions: questionsConfig.filter((q) => q.quickStart).length,
  sections: sectionIds.length,
} as const;
