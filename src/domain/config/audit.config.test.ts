import { describe, expect, it } from 'vitest';
import { auditScope } from './audit.config';
import { questionsConfig } from './questions.config';

describe('auditScope', () => {
  it('is derived from the question list, so no screen can disagree with it', () => {
    expect(auditScope.totalQuestions).toBe(questionsConfig.length);
    expect(auditScope.quickStartQuestions).toBe(questionsConfig.filter((q) => q.quickStart).length);
    expect(auditScope.quickStartQuestions).toBeLessThan(auditScope.totalQuestions);
  });
});
