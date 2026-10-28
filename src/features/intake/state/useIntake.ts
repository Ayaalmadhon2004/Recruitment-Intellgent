'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { domainConfig } from '@/domain/config';
import type { AnswerValue, DomainConfig, KnownEvidenceTag, QuestionId } from '@/domain/types';
import type { AnswerStore } from '../store';
import {
  answerQuestion,
  clearQuestion,
  confirmEvidence,
  emptyIntakeState,
  goToSection,
  hydrate,
  overallProgress,
  sectionProgress,
  toStored,
  toggleNotSure,
} from './intake-state';
import type { IntakeState, OverallProgress, SectionProgress } from './intake-state';

export type SaveStatus = 'idle' | 'saving' | 'saved';

/** How long after the last change the answers are written. */
export const SAVE_DELAY_MS = 600;

export type UseIntake = {
  /** An earlier audit was found and loaded. */
  resumed: boolean;
  /** Zero-based section the saved audit was at when it was loaded. */
  resumedSectionIndex: number;
  /** The saved audit was made under another config version. */
  versionChanged: boolean;
  state: IntakeState;
  sections: SectionProgress[];
  overall: OverallProgress;
  saveStatus: SaveStatus;
  answer: (id: QuestionId, value: AnswerValue) => void;
  clear: (id: QuestionId) => void;
  toggleNotSure: (id: QuestionId) => void;
  pickEvidence: (id: QuestionId, tag: KnownEvidenceTag) => void;
  goToSection: (index: number) => void;
  /** Moves to a section and writes right away, so a reload resumes there. */
  saveAndGoToSection: (index: number) => void;
  /** Writes right away instead of waiting for the delay. */
  saveNow: () => void;
};

/**
 * All state of the full Intake: answers, Not sure marks, confirmed evidence tags, the current section and
 * the save status. Progress is written through the given store after a short pause, and on page hide.
 */
export function useIntake(
  store: AnswerStore,
  config: DomainConfig = domainConfig,
  delayMs: number = SAVE_DELAY_MS,
): UseIntake {
  // Read once, on the first render. Call this hook only in the browser (see IntakePage), where the store exists.
  const [initial] = useState(() => {
    const stored = store.load();
    return stored ? hydrate(stored, config.questions) : null;
  });
  const [state, setState] = useState<IntakeState>(initial?.state ?? emptyIntakeState);
  // The state object last written. The status is derived from it, so no effect has to set it.
  const [savedState, setSavedState] = useState<IntakeState>(initial?.state ?? emptyIntakeState);
  const [everSaved, setEverSaved] = useState(initial !== null);

  const latest = useRef({ state, savedState });
  useEffect(() => {
    latest.current = { state, savedState };
  });

  const write = useCallback(
    (next: IntakeState): void => {
      store.save(toStored(next));
      setSavedState(next);
      setEverSaved(true);
    },
    [store],
  );

  useEffect(() => {
    if (state === savedState) return undefined;
    const timer = setTimeout(() => write(state), delayMs);
    return () => clearTimeout(timer);
  }, [state, savedState, delayMs, write]);

  useEffect(() => {
    const flush = (): void => {
      const { state: s, savedState: saved } = latest.current;
      if (s !== saved) store.save(toStored(s));
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [store]);

  const sections = useMemo(() => sectionProgress(state, config.questions), [state, config]);
  const overall = useMemo(() => overallProgress(state, config.questions), [state, config]);

  let saveStatus: SaveStatus = 'idle';
  if (state !== savedState) saveStatus = 'saving';
  else if (everSaved) saveStatus = 'saved';

  return {
    resumed: initial !== null,
    resumedSectionIndex: initial?.state.sectionIndex ?? 0,
    versionChanged: initial?.versionChanged ?? false,
    state,
    sections,
    overall,
    saveStatus,
    answer: (id, value) => setState((s) => answerQuestion(s, id, value, config)),
    clear: (id) => setState((s) => clearQuestion(s, id)),
    toggleNotSure: (id) => setState((s) => toggleNotSure(s, id)),
    pickEvidence: (id, tag) => setState((s) => confirmEvidence(s, id, tag, config)),
    goToSection: (index) => setState((s) => goToSection(s, index)),
    saveAndGoToSection: (index) => {
      const next = goToSection(state, index);
      setState(next);
      write(next);
    },
    saveNow: () => write(state),
  };
}
