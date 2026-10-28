import { describe, expect, it, vi } from 'vitest';
import { CONFIG_VERSION, questionsConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import type { Answer } from '@/domain/types';
import { known, unknown } from '@/fixtures/builders';
import { createLocalStorageStore, createMemoryStore, loadStoredAudit } from '.';
import type { StoredAudit } from '.';

const stored = (answers: Answer[], configVersion = CONFIG_VERSION): StoredAudit => ({
  configVersion,
  answers,
  confirmedTagIds: [],
  sectionIndex: 0,
});

const STUDENTS = 9;
const quickStart: Answer[] = [known('B1', STUDENTS)];
const EVERY_OTHER = 2;

describe('loadStoredAudit', () => {
  it('is null when the store is empty', () => {
    expect(loadStoredAudit({ store: createMemoryStore() })).toBeNull();
  });

  it('turns stored answers into a free, in-progress audit with the stored config version', () => {
    const audit = loadStoredAudit({
      store: createMemoryStore(stored([known('A1', 'private-university')], 'old-version')),
    });
    expect(audit).toEqual({
      id: 'local-audit',
      institutionName: en.reportPage.institutionName,
      answers: [known('A1', 'private-university')],
      status: 'in-progress',
      configVersion: 'old-version',
      entitlement: 'free',
    });
  });

  it('is complete only when every configured question is answered or marked Not sure', () => {
    const all = questionsConfig.map((q, i) => (i % EVERY_OTHER ? unknown(q.id) : known(q.id, 1)));
    expect(loadStoredAudit({ store: createMemoryStore(stored(all)) })?.status).toBe('complete');
    expect(loadStoredAudit({ store: createMemoryStore(stored(all.slice(1))) })?.status).toBe(
      'in-progress',
    );
  });

  it('drops invalid JSON and foreign data', () => {
    const storage = { getItem: () => '{oops' } as unknown as Storage;
    expect(loadStoredAudit({ store: createLocalStorageStore(() => storage) })).toBeNull();
    const foreign = { getItem: () => '{"answers":"nope"}' } as unknown as Storage;
    expect(loadStoredAudit({ store: createLocalStorageStore(() => foreign) })).toBeNull();
  });

  it('does not throw when storage throws', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(loadStoredAudit({ store: createLocalStorageStore(() => storage) })).toBeNull();
  });

  it('does not write', () => {
    const store = createMemoryStore(stored([known('A1', 'x')]));
    loadStoredAudit({ store });
    expect(store.saves).toHaveLength(0);
  });

  describe('Quick Start fallback', () => {
    it('is used only when the Intake store is empty, under the current config version', () => {
      const audit = loadStoredAudit({
        store: createMemoryStore(),
        fallbackAnswers: () => quickStart,
      });
      expect(audit?.answers).toEqual(quickStart);
      expect(audit?.configVersion).toBe(CONFIG_VERSION);
    });

    it('is used when the Intake store holds no answers', () => {
      const audit = loadStoredAudit({
        store: createMemoryStore(stored([])),
        fallbackAnswers: () => quickStart,
      });
      expect(audit?.answers).toEqual(quickStart);
    });

    it('is not read when the Intake has answers, and is never merged', () => {
      const fallback = vi.fn(() => quickStart);
      const audit = loadStoredAudit({
        store: createMemoryStore(stored([known('A1', 'x')])),
        fallbackAnswers: fallback,
      });
      expect(audit?.answers).toEqual([known('A1', 'x')]);
      expect(fallback).not.toHaveBeenCalled();
    });

    it('is null when both are empty or the fallback throws', () => {
      expect(
        loadStoredAudit({ store: createMemoryStore(), fallbackAnswers: () => undefined }),
      ).toBeNull();
      expect(loadStoredAudit({ store: createMemoryStore(), fallbackAnswers: () => [] })).toBeNull();
      expect(
        loadStoredAudit({
          store: createMemoryStore(),
          fallbackAnswers: () => {
            throw new Error('blocked');
          },
        }),
      ).toBeNull();
    });
  });
});
