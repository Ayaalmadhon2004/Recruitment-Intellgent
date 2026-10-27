import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { questionsConfig } from '@/domain/config';
import { toQuestionView } from './view';

describe('toQuestionView', () => {
  it('resolves every configured question to text with no leftover keys', () => {
    for (const q of questionsConfig) {
      const view = toQuestionView(q);
      expect(view.id).toBe(q.id);
      expect(view.type).toBe(q.type);
      expect(view.text.length).toBeGreaterThan(0);
      expect(view.help.length).toBeGreaterThan(0);
      expect(view.text).not.toMatch(/^questions\./);
    }
  });

  it('resolves options with their descriptions', () => {
    const a2 = questionsConfig.find((q) => q.id === 'A2');
    const view = toQuestionView(a2!);
    expect(view.options?.map((o) => o.value)).toEqual([
      'starting',
      'building',
      'growing',
      'established',
    ]);
    expect(view.options?.[1]).toMatchObject({
      label: en.questions.A2.options.building.label,
      description: '6-15 students',
    });
  });

  it('resolves control label, unit and placeholder for number questions', () => {
    const b1 = questionsConfig.find((q) => q.id === 'B1');
    expect(toQuestionView(b1!)).toMatchObject({ unit: 'students', placeholder: 'e.g. 9' });
  });

  it('leaves options out of number and toggle questions', () => {
    expect(toQuestionView(questionsConfig.find((q) => q.id === 'A4')!).options).toBeUndefined();
    expect(toQuestionView(questionsConfig.find((q) => q.id === 'B1')!).options).toBeUndefined();
  });
});
