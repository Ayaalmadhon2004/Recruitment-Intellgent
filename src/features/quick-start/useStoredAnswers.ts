'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { Answer } from '@/domain/types';
import { parseStoredAnswers, readRaw } from './session';

const subscribe = (): (() => void) => () => undefined;
// The server has no storage: "not read yet" (undefined) differs from "read, nothing there" (null).
const serverSnapshot = (): undefined => undefined;

/**
 * This tab's stored answers, read without a mismatch on first render.
 * `raw` changes when the stored text changes, so it can key effects; undefined means not read yet.
 */
export function useStoredAnswers(): {
  answers: Answer[] | undefined;
  raw: string | null | undefined;
} {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  const answers = useMemo(() => parseStoredAnswers(raw ?? null), [raw]);
  return { answers, raw };
}
