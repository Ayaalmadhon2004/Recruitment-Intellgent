import { describe, expect, it } from 'vitest';
import { CONFIG_VERSION, domainConfig } from '@/domain/config';
import { known, unknown } from '../../../tests/fixtures/builders';
import {
  countByFilter,
  countHandled,
  filterCards,
  formatUpdated,
  sortCards,
  stageViewOf,
  toCardModel,
} from './model';
import type { AuditCardModel } from './model';
import { storedWith } from './test-helpers';
import type { SavedAudit } from './types';

const saved = (over: Partial<SavedAudit> = {}): SavedAudit => ({
  id: 'a',
  institutionName: null,
  stored: storedWith(),
  updatedAt: '2026-10-25T09:00:00.000Z',
  ...over,
});

const card = (over: Partial<AuditCardModel>): AuditCardModel => ({
  id: 'a',
  name: 'Alpha',
  answered: 5,
  total: 24,
  percent: 21,
  progress: 'in-progress',
  stage: { kind: 'checking' },
  updatedAt: '2026-10-25T09:00:00.000Z',
  olderVersion: null,
  sample: false,
  ...over,
});

describe('countHandled', () => {
  it('counts answers and Not sure marks once per known question', () => {
    const audit = saved({
      stored: storedWith([known('B1', 9), unknown('A1'), known('A1', 'x'), known('B1', 1)]),
    });
    expect(countHandled(audit, domainConfig)).toBe(2);
  });
});

describe('toCardModel', () => {
  const total = domainConfig.questions.length;

  it('derives progress from stored answers and config, never from a stored status', () => {
    const model = toCardModel(saved(), { kind: 'checking' }, domainConfig);
    expect(model.answered).toBe(3);
    expect(model.total).toBe(total);
    expect(model.percent).toBe(Math.round((3 / total) * 100));
    expect(model.progress).toBe('in-progress');
    expect(model.name).toBeNull();
    expect(model.olderVersion).toBeNull();
  });

  it('is complete when every configured question is handled', () => {
    const everything = domainConfig.questions.map((q) => unknown(q.id));
    const model = toCardModel(
      saved({ stored: storedWith(everything) }),
      { kind: 'checking' },
      domainConfig,
    );
    expect(model).toMatchObject({ progress: 'complete', percent: 100 });
  });

  it('flags answers saved under another config version', () => {
    const audit = saved({ stored: storedWith(undefined, 'vri-config-0.0.1') });
    expect(toCardModel(audit, { kind: 'checking' }, domainConfig).olderVersion).toBe(
      'vri-config-0.0.1',
    );
    expect(toCardModel(saved(), { kind: 'checking' }, domainConfig).olderVersion).toBeNull();
    expect(CONFIG_VERSION).not.toBe('vri-config-0.0.1');
  });
});

describe('stageViewOf', () => {
  const label = (key: string): string => `label:${key}`;
  it('maps the three outcomes without inventing a stage', () => {
    expect(stageViewOf(undefined, domainConfig, label)).toEqual({ kind: 'checking' });
    expect(
      stageViewOf(
        { kind: 'not-scorable', reason: 'missing-answers', missing: ['B1'] },
        domainConfig,
        label,
      ),
    ).toEqual({ kind: 'not-scorable' });
    expect(stageViewOf({ kind: 'staged', stage: 'building' }, domainConfig, label)).toEqual({
      kind: 'staged',
      label: 'label:stages.building.label',
    });
  });
});

describe('filter, count and sort', () => {
  const cards = [
    card({ id: '1', name: 'Bravo', percent: 50, updatedAt: '2026-10-20T00:00:00Z' }),
    card({
      id: '2',
      name: 'Alpha',
      percent: 100,
      progress: 'complete',
      updatedAt: '2026-10-09T00:00:00Z',
    }),
    card({ id: '3', name: null, percent: 10, updatedAt: '2026-10-25T00:00:00Z' }),
  ];

  it('counts and filters by progress', () => {
    expect(countByFilter(cards)).toEqual({ all: 3, progress: 2, complete: 1 });
    expect(filterCards(cards, 'complete').map((c) => c.id)).toEqual(['2']);
    expect(filterCards(cards, 'all')).toHaveLength(3);
  });

  it('sorts by last updated, name and progress without changing the input', () => {
    expect(sortCards(cards, 'updated', 'Untitled').map((c) => c.id)).toEqual(['3', '1', '2']);
    expect(sortCards(cards, 'name', 'Untitled').map((c) => c.id)).toEqual(['2', '1', '3']);
    expect(sortCards(cards, 'progress', 'Untitled').map((c) => c.id)).toEqual(['2', '1', '3']);
    expect(cards.map((c) => c.id)).toEqual(['1', '2', '3']);
  });
});

describe('formatUpdated', () => {
  it('formats in UTC and tolerates bad input', () => {
    expect(formatUpdated('2026-10-25T23:30:00Z')).toBe('25 Oct 2026');
    expect(formatUpdated('nonsense')).toBe('nonsense');
  });
});
