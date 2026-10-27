import type { Answer } from '@/domain/types';
import type { FirstReadResponse } from './contract';
import { parseFirstReadRequest } from './server';

/**
 * Hands the Quick Start answers from the flow page to the First Read page. Browser tab storage only: no
 * account yet. Only answers are trusted for later use; the page asks the server for the scores again.
 */

const KEY = 'vri.quick-start';

type Stored = { answers: Answer[]; result?: FirstReadResponse };

function storage(): Storage | undefined {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

/** Keep the answers (and the last result, for reference only). Silently does nothing if storage fails. */
export function saveFirstRead(answers: readonly Answer[], result?: FirstReadResponse): void {
  try {
    const stored: Stored = { answers: [...answers], ...(result ? { result } : {}) };
    storage()?.setItem(KEY, JSON.stringify(stored));
  } catch {
    // Private mode or full storage: the flow still works for this visit.
  }
}

/** The raw stored text, or null. */
export function readRaw(): string | null {
  try {
    return storage()?.getItem(KEY) ?? null;
  } catch {
    return null;
  }
}

/** Answers from stored text, re-validated with the same rules as the server. Invalid text gives undefined. */
export function parseStoredAnswers(raw: string | null): Answer[] | undefined {
  if (!raw) return undefined;
  try {
    const json: unknown = JSON.parse(raw);
    const answers =
      typeof json === 'object' && json !== null
        ? (json as { answers?: unknown }).answers
        : undefined;
    const parsed = parseFirstReadRequest({ answers });
    return parsed.ok ? parsed.answers : undefined;
  } catch {
    return undefined;
  }
}

/** Stored answers. Invalid data is dropped from storage. */
export function loadAnswers(): Answer[] | undefined {
  const raw = readRaw();
  const answers = parseStoredAnswers(raw);
  if (raw && !answers) clear();
  return answers;
}

/** The stored result is never trusted for display; this returns it only if the shape is plausible. */
export function loadFirstRead(): { answers: Answer[]; result?: FirstReadResponse } | undefined {
  const answers = loadAnswers();
  if (!answers) return undefined;
  try {
    const json = JSON.parse(storage()?.getItem(KEY) ?? 'null') as Stored | null;
    const result = json?.result;
    const plausible =
      result !== undefined &&
      typeof result === 'object' &&
      typeof result.configVersion === 'string' &&
      typeof result.stage === 'object' &&
      typeof result.areas === 'object';
    return plausible ? { answers, result } : { answers };
  } catch {
    return { answers };
  }
}

export function clear(): void {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
