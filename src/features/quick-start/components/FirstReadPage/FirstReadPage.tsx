'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import type { Answer } from '@/domain/types';
import { Button } from '@/ui';
import type { FirstReadResponse } from '../../contract';
import { useStoredAnswers } from '../../useStoredAnswers';
import { FirstReadView } from '../FirstReadView';
import styles from './FirstReadPage.module.css';

const copy = en.quickStart;

type State =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error' }
  | { kind: 'ready'; result: FirstReadResponse };

type Outcome = {
  attempt: number;
  raw: string | null | undefined;
  result: FirstReadResponse | undefined;
};

export type FirstReadPageProps = {
  /** Fixed state for stories. Skips storage and the network. */
  previewState?: 'loading' | 'empty' | 'error';
  changeAnswersHref?: string;
  continueHref?: string;
};

function stateFor(
  raw: string | null | undefined,
  answers: readonly Answer[] | undefined,
  outcome: Outcome | undefined,
  attempt: number,
): State {
  // The server render and the first client render have not read storage yet: loading, not "no answers".
  if (raw === undefined) return { kind: 'loading' };
  if (!answers) return { kind: 'empty' };
  if (!outcome || outcome.attempt !== attempt || outcome.raw !== raw) return { kind: 'loading' };
  return outcome.result ? { kind: 'ready', result: outcome.result } : { kind: 'error' };
}

/** Scores are never stored: ask the server again with the stored answers. */
async function fetchFirstRead(answers: readonly Answer[]): Promise<FirstReadResponse | undefined> {
  try {
    const response = await fetch('/api/first-read', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) return undefined;
    return (await response.json()) as FirstReadResponse;
  } catch {
    return undefined;
  }
}

/** The First Read page: loads this tab's answers, asks the server for the result and renders it. */
export function FirstReadPage({
  previewState,
  changeAnswersHref = routes.quickStart,
  continueHref = routes.intake,
}: FirstReadPageProps): ReactNode {
  const { answers, raw } = useStoredAnswers();
  const [attempt, setAttempt] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewState || !answers) return;
    let cancelled = false;
    const run = async (): Promise<void> => {
      const result = await fetchFirstRead(answers);
      if (!cancelled) setOutcome({ attempt, raw, result });
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [previewState, answers, attempt, raw]);

  const state: State = previewState
    ? { kind: previewState }
    : stateFor(raw, answers, outcome, attempt);

  // Move focus to the main heading whenever the page settles on a new state.
  useEffect(() => {
    if (state.kind === 'loading' && !previewState) return;
    const heading = root.current?.querySelector('h1');
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [state.kind, previewState]);

  if (state.kind === 'ready') {
    return (
      <div ref={root} className={styles.root}>
        <FirstReadView
          result={state.result}
          changeAnswersHref={changeAnswersHref}
          continueHref={continueHref}
        />
      </div>
    );
  }

  return (
    <div ref={root} className={styles.root}>
      <section className={styles.message} aria-busy={state.kind === 'loading'}>
        {state.kind === 'loading' ? (
          <>
            <h1 className={styles.title}>{copy.firstReadLoadingTitle}</h1>
            <p role="status" className={styles.body}>
              {copy.firstReadLoadingBody}
            </p>
          </>
        ) : null}
        {state.kind === 'error' ? (
          <>
            <h1 className={styles.title}>{copy.firstReadErrorTitle}</h1>
            <p role="alert" className={styles.body}>
              {copy.submitErrorServer}
            </p>
            <div className={styles.actions}>
              <Button onClick={() => setAttempt(attempt + 1)}>{copy.firstReadRetry}</Button>
              <Button variant="secondary" href={changeAnswersHref}>
                {en.firstRead.ctaChange}
              </Button>
            </div>
          </>
        ) : null}
        {state.kind === 'empty' ? (
          <>
            <h1 className={styles.title}>{copy.noAnswersTitle}</h1>
            <p className={styles.body}>{copy.noAnswersBody}</p>
            <div className={styles.actions}>
              <Button href={changeAnswersHref}>{copy.noAnswersLink}</Button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
