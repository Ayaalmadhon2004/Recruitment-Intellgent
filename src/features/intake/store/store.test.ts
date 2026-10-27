import { describe, expect, it } from 'vitest';
import { CONFIG_VERSION } from '@/domain/config';
import { known } from '@/fixtures/builders';
import { createLocalStorageStore, parseStoredAudit } from '.';
import type { StoredAudit } from '.';

const sample: StoredAudit = {
  configVersion: CONFIG_VERSION,
  answers: [known('A1', 'private-university'), { kind: 'unknown', questionId: 'B2' }],
  confirmedTagIds: ['A1'],
  sectionIndex: 2,
};

/** A Storage stand-in backed by a plain object. */
const fakeStorage = (data: Record<string, string> = {}): Storage =>
  ({
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
  }) as unknown as Storage;

describe('local storage store', () => {
  it('round trips an audit', () => {
    const storage = fakeStorage();
    const store = createLocalStorageStore(() => storage);
    expect(store.load()).toBeNull();
    store.save(sample);
    expect(store.load()).toEqual(sample);
  });

  it('shares data between two store instances on the same storage', () => {
    const storage = fakeStorage();
    createLocalStorageStore(() => storage).save(sample);
    expect(createLocalStorageStore(() => storage).load()).toEqual(sample);
  });

  it.each([
    ['not JSON', '{oops'],
    ['a string', '"hello"'],
    ['an array', '[]'],
    ['foreign JSON', '{"theme":"dark"}'],
    ['a missing version', JSON.stringify({ ...sample, configVersion: undefined })],
    ['a bad section index', JSON.stringify({ ...sample, sectionIndex: -1 })],
    ['a fractional section index', JSON.stringify({ ...sample, sectionIndex: 1.5 })],
    [
      'an answer with a made-up tag',
      JSON.stringify({ ...sample, answers: [{ ...known('A1', 'x'), evidence: 'unknown' }] }),
    ],
    [
      'an answer for a question that cannot exist',
      JSON.stringify({ ...sample, answers: [known('Z9' as 'A1', 'x')] }),
    ],
    [
      'two answers for one question',
      JSON.stringify({ ...sample, answers: [known('A1', 'x'), known('A1', 'y')] }),
    ],
    ['bad confirmed ids', JSON.stringify({ ...sample, confirmedTagIds: ['nope'] })],
  ])('drops %s', (_name, text) => {
    const store = createLocalStorageStore(() => fakeStorage({ 'vri.intake.v1': text }));
    expect(store.load()).toBeNull();
  });

  it('does not throw when storage is missing', () => {
    const store = createLocalStorageStore(() => undefined);
    expect(store.load()).toBeNull();
    expect(() => store.save(sample)).not.toThrow();
  });

  it('does not throw when storage throws on read or write', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    } as unknown as Storage;
    const store = createLocalStorageStore(() => throwing);
    expect(store.load()).toBeNull();
    expect(() => store.save(sample)).not.toThrow();
  });

  it('does not throw when reaching the storage itself throws', () => {
    const store = createLocalStorageStore(() => {
      throw new Error('denied');
    });
    expect(store.load()).toBeNull();
  });
});

describe('parseStoredAudit', () => {
  it('keeps an audit saved under another config version, so the caller can warn', () => {
    expect(parseStoredAudit({ ...sample, configVersion: 'old' })?.configVersion).toBe('old');
  });
});
