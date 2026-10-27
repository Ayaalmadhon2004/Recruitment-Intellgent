import { describe, expect, it } from 'vitest';
import { CONFIG_VERSION, domainConfig, questionsConfig } from '@/domain/config';
import { known } from '@/fixtures/builders';
import { isUnsure, knownFor } from '@/features/questions';
import {
  answerQuestion,
  confirmEvidence,
  confirmedTagFor,
  emptyIntakeState,
  goToSection,
  hydrate,
  overallProgress,
  sectionProgress,
  toStored,
  toggleNotSure,
} from './intake-state';

const answered = answerQuestion(emptyIntakeState, 'A1', 'private-university', domainConfig);

describe('answering', () => {
  it('stores the default tag but does not count it as confirmed', () => {
    expect(knownFor(answered.answers, 'A1')?.evidence).toBe(domainConfig.evidence.defaultTag);
    expect(confirmedTagFor(answered, 'A1')).toBeUndefined();
  });

  it('confirming a tag stores it, sets confidence, and marks it confirmed', () => {
    const next = confirmEvidence(answered, 'A1', 'verified', domainConfig);
    expect(confirmedTagFor(next, 'A1')).toBe('verified');
    expect(knownFor(next.answers, 'A1')?.confidence).toBe('high');
    expect(next.confirmedTagIds).toEqual(['A1']);
  });

  it('keeps the confirmed tag when the value changes', () => {
    const tagged = confirmEvidence(answered, 'A1', 'estimate', domainConfig);
    const next = answerQuestion(tagged, 'A1', 'public-university', domainConfig);
    expect(confirmedTagFor(next, 'A1')).toBe('estimate');
  });

  it('cannot confirm a tag on a question without an answer', () => {
    expect(confirmEvidence(emptyIntakeState, 'A1', 'verified', domainConfig)).toBe(
      emptyIntakeState,
    );
  });

  it('does not change the state it was given', () => {
    const before = { ...answered };
    confirmEvidence(answered, 'A1', 'verified', domainConfig);
    expect(answered).toEqual(before);
  });
});

describe('Not sure', () => {
  it('marks Unknown, drops the value and the confirmed tag', () => {
    const tagged = confirmEvidence(answered, 'A1', 'verified', domainConfig);
    const next = toggleNotSure(tagged, 'A1');
    expect(isUnsure(next.answers, 'A1')).toBe(true);
    expect(next.confirmedTagIds).toEqual([]);
  });

  it('toggles back to untouched', () => {
    const next = toggleNotSure(toggleNotSure(emptyIntakeState, 'A1'), 'A1');
    expect(next.answers).toEqual([]);
  });

  it('a later answer needs its tag confirmed again', () => {
    const tagged = confirmEvidence(answered, 'A1', 'verified', domainConfig);
    const next = answerQuestion(toggleNotSure(tagged, 'A1'), 'A1', 'x', domainConfig);
    expect(confirmedTagFor(next, 'A1')).toBeUndefined();
  });
});

describe('progress', () => {
  it('counts answered and Not sure per section and overall, from config totals', () => {
    let state = answerQuestion(emptyIntakeState, 'A1', 'private-university', domainConfig);
    state = toggleNotSure(state, 'A2');
    state = toggleNotSure(state, 'B1');
    const sections = sectionProgress(state, questionsConfig);
    expect(sections.map((s) => s.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(sections[0]).toMatchObject({ handled: 2, total: 4, complete: false });
    expect(sections[1]).toMatchObject({ handled: 1, total: 4 });
    expect(sections[2]).toMatchObject({ handled: 0 });
    expect(overallProgress(state, questionsConfig)).toEqual({
      handled: 3,
      total: questionsConfig.length,
      unsure: 2,
    });
  });

  it('a section is complete when every question is answered or Not sure', () => {
    const ids = questionsConfig.filter((q) => q.section === 'A').map((q) => q.id);
    const state = ids.reduce((s, id) => toggleNotSure(s, id), emptyIntakeState);
    expect(sectionProgress(state, questionsConfig)[0]?.complete).toBe(true);
  });

  it('the overall total follows the config, not a fixed number', () => {
    expect(overallProgress(emptyIntakeState, questionsConfig.slice(0, 5)).total).toBe(5);
  });
});

describe('sections', () => {
  it('clamps the section index to A..F', () => {
    expect(goToSection(emptyIntakeState, 99).sectionIndex).toBe(5);
    expect(goToSection(emptyIntakeState, -3).sectionIndex).toBe(0);
  });
});

describe('storing and resuming', () => {
  it('round trips through the stored shape with the current config version', () => {
    const state = goToSection(confirmEvidence(answered, 'A1', 'verified', domainConfig), 2);
    const stored = toStored(state);
    expect(stored.configVersion).toBe(CONFIG_VERSION);
    expect(hydrate(stored, questionsConfig)).toEqual({ state, versionChanged: false });
  });

  it('resumes at the stored section', () => {
    expect(
      hydrate({ ...toStored(answered), sectionIndex: 3 }, questionsConfig).state.sectionIndex,
    ).toBe(3);
  });

  it('keeps answers but flags a different config version', () => {
    const result = hydrate({ ...toStored(answered), configVersion: 'older' }, questionsConfig);
    expect(result.versionChanged).toBe(true);
    expect(result.state.answers).toHaveLength(1);
  });

  it('drops answers and tags for questions that no longer exist', () => {
    const stored = {
      configVersion: CONFIG_VERSION,
      answers: [known('A1', 'x'), known('A99', 'y')],
      confirmedTagIds: ['A1' as const, 'A99' as const],
      sectionIndex: 0,
    };
    const { state } = hydrate(stored, questionsConfig);
    expect(state.answers.map((a) => a.questionId)).toEqual(['A1']);
    expect(state.confirmedTagIds).toEqual(['A1']);
  });
});
