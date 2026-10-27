import { parseStoredAudit } from './parse';
import type { AnswerStore, StoredAudit } from './types';

/** An in-memory store for tests and stories. Round-trips through JSON like a real store. */
export function createMemoryStore(initial: StoredAudit | null = null): AnswerStore & {
  readonly saves: readonly StoredAudit[];
} {
  const saves: StoredAudit[] = [];
  let text = initial ? JSON.stringify(initial) : null;
  return {
    saves,
    load: () => (text ? parseStoredAudit(JSON.parse(text)) : null),
    save: (stored) => {
      text = JSON.stringify(stored);
      saves.push(stored);
    },
  };
}
