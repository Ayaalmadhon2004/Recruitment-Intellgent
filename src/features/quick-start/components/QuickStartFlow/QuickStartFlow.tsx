'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { domainConfig, questionsConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import type { Answer, AnswerValue } from '@/domain/types';
import {
  answerFor,
  isUnsure,
  knownFor,
  questionCardLabels,
  setAnswer,
  toggleUnsure,
  toQuestionView,
} from '@/features/questions';
import { FlowShell, QuestionCard } from '@/patterns';
import type { FirstReadResponse } from '../../contract';
import { saveFirstRead } from '../../session';
import { useStoredAnswers } from '../../useStoredAnswers';
import styles from './QuickStartFlow.module.css';

const copy = en.quickStart;

const BAD_REQUEST = 400;
const PAYLOAD_TOO_LARGE = 413;

/** The five temporary Quick Start questions, in config order. */
const questions = questionsConfig.filter((q) => q.quickStart);
const views = questions.map(toQuestionView);
const steps = questions.map((q, index) => ({
  id: q.id,
  label: fill(copy.stepLabel, { n: index + 1 }),
}));

const flowLabels = {
  stepperLabel: copy.stepperLabel,
  stateLabels: copy.stateLabels,
  back: copy.back,
  next: copy.next,
  submit: copy.submit,
  announce: (position: number, total: number, label: string): string =>
    fill(copy.announce, { n: position, total, label }),
  loading: copy.loading,
};

type SubmitError = 'network' | 'invalid' | 'server';
const errorText: Record<SubmitError, string> = {
  network: copy.submitErrorNetwork,
  invalid: copy.submitErrorInvalid,
  server: copy.submitErrorServer,
};

export type QuickStartFlowProps = {
  /** Start state for stories and tests. Without answers the flow pre-fills from this tab's storage. */
  initialStep?: number;
  initialAnswers?: readonly Answer[];
  initialStatus?: 'idle' | 'submitting' | SubmitError;
  /** Where to go after a successful submit. */
  resultHref?: string;
};

type Outcome = { ok: true; result: FirstReadResponse } | { ok: false; error: SubmitError };

/** Asks the server for the First Read. Returns the error kind on failure. */
async function requestFirstRead(answers: readonly Answer[]): Promise<Outcome> {
  try {
    const response = await fetch('/api/first-read', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (response.status === BAD_REQUEST || response.status === PAYLOAD_TOO_LARGE) {
      return { ok: false, error: 'invalid' };
    }
    if (!response.ok) return { ok: false, error: 'server' };
    return { ok: true, result: (await response.json()) as FirstReadResponse };
  } catch (cause) {
    return { ok: false, error: cause instanceof SyntaxError ? 'server' : 'network' };
  }
}

/** Five questions, one per step. Client state is the domain Answer list; scores come from the server. */
export function QuickStartFlow({
  initialStep = 0,
  initialAnswers,
  initialStatus = 'idle',
  resultHref = '/first-read',
}: QuickStartFlowProps): ReactNode {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [status, setStatus] = useState(initialStatus);
  // Returning via "Change my answers": start from what this tab stored until the person edits.
  const stored = useStoredAnswers().answers;
  const [edited, setEdited] = useState<readonly Answer[] | undefined>(initialAnswers);
  const answers = edited ?? stored ?? [];

  const question = questions[step];
  const view = views[step];
  if (!question || !view) return null;

  const last = step === questions.length - 1;
  const handled = answerFor(answers, question.id) !== undefined;
  const submitting = status === 'submitting';
  const failure = status === 'idle' || status === 'submitting' ? undefined : status;

  const change = (value: AnswerValue): void => {
    setStatus('idle');
    setEdited(setAnswer(answers, question.id, value, domainConfig));
  };
  const unsure = (): void => {
    setStatus('idle');
    setEdited(toggleUnsure(answers, question.id));
  };

  const submit = async (): Promise<void> => {
    setStatus('submitting');
    const outcome = await requestFirstRead(answers);
    if (!outcome.ok) {
      setStatus(outcome.error);
      return;
    }
    saveFirstRead(answers, outcome.result);
    router.push(resultHref);
  };

  const next = (): void => {
    if (!last) setStep(step + 1);
    else if (!submitting) void submit();
  };

  return (
    <div className={styles.root}>
      <header className={styles.intro}>
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.lead}>{copy.lead}</p>
      </header>
      <FlowShell
        steps={steps}
        current={step}
        labels={flowLabels}
        onBack={() => setStep(Math.max(0, step - 1))}
        onNext={next}
        nextDisabled={!handled}
        submitting={submitting}
      >
        <QuestionCard
          question={view}
          value={knownFor(answers, question.id)?.value}
          unsure={isUnsure(answers, question.id)}
          onChange={change}
          onUnsure={unsure}
          labels={questionCardLabels}
          headingLevel="h2"
        />
        {last && failure ? (
          <div role="alert" className={styles.error}>
            <strong className={styles.errorTitle}>{copy.submitErrorTitle}</strong>
            <span>{errorText[failure]}</span>
          </div>
        ) : null}
      </FlowShell>
    </div>
  );
}
