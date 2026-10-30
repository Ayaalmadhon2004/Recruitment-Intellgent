'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { domainConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { sectionIds } from '@/domain/types';
import type { Question, QuestionId, SectionId } from '@/domain/types';
import { uiCopy } from '@/design/ui-copy';
import {
  countHandled,
  isUnsure,
  knownFor,
  questionCardLabelsWithEvidence,
  toQuestionView,
} from '@/features/questions';
import { FirstReadPage, FirstReadPageLoading } from '@/features/quick-start';
import { QuestionCard } from '@/patterns';
import type { QuestionCardLabels } from '@/patterns';
import { Button, KiteTrack, StepLabel, useToast } from '@/ui';
import { confirmedTagFor, questionsInSection, useIntake } from '../../state';
import type { UseIntake } from '../../state';
import type { AnswerStore } from '../../store';
import styles from './AuditFlow.module.css';

/** Where the person is: the Quick Start questions, the free first read, or the remaining sections. */
export type AuditPhase = 'questions' | 'read' | 'sections';

export type AuditFlowProps = {
  /** Where answers are kept. They save by themselves a moment after each change. */
  store: AnswerStore;
  /** The phase named by the address, if any. Without it the flow resumes where the saved answers stand. */
  phase?: AuditPhase;
  onPhaseChange: (phase: AuditPhase) => void;
  /** Address of a phase, for the links on the first read. */
  phaseHref: (phase: AuditPhase) => string;
  /** Where "See my report" goes after the last section. */
  reportHref: string;
  /** Where "Unlock full report" goes; leave out when the audit is already unlocked or not yet known. */
  unlockHref?: string;
};

const copy = en.quickStart;
const quickQuestions: readonly Question[] = domainConfig.questions.filter((q) => q.quickStart);
const restQuestions: readonly Question[] = domainConfig.questions.filter((q) => !q.quickStart);
const quickIds: readonly QuestionId[] = quickQuestions.map((q) => q.id);
/** Sections that still have questions after the Quick Start ones. */
const restSections: readonly SectionId[] = sectionIds.filter((id) =>
  restQuestions.some((q) => q.section === id),
);

const labels: QuestionCardLabels = {
  ...questionCardLabelsWithEvidence,
  evidence: questionCardLabelsWithEvidence.evidence && {
    ...questionCardLabelsWithEvidence.evidence,
    heading: uiCopy.flow.howSure,
  },
};

const subscribe = (): (() => void) => () => undefined;
// The saved answers live in the browser, so the flow is drawn on the client only.
const useIsClient = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

type QuestionProps = { intake: UseIntake; question: Question; onAnswered: () => void };

/** One question: the plain card wired to the intake state, with the Not sure toast. */
function Question({ intake, question, onAnswered }: QuestionProps): ReactNode {
  const toast = useToast();
  const { answers } = intake.state;
  const id = question.id;
  return (
    <QuestionCard
      question={toQuestionView(question)}
      value={knownFor(answers, id)?.value}
      unsure={isUnsure(answers, id)}
      onChange={(value) => {
        onAnswered();
        intake.answer(id, value);
      }}
      onClear={() => intake.clear(id)}
      onUnsure={() => {
        onAnswered();
        if (!isUnsure(answers, id)) {
          toast.show({ message: en.intake.evidenceHelp.unknown, status: 'info' });
        }
        intake.toggleNotSure(id);
      }}
      evidence={{
        value: confirmedTagFor(intake.state, id),
        onChange: (tag) => intake.pickEvidence(id, tag),
      }}
      labels={labels}
      variant="plain"
      headingLevel="h2"
    />
  );
}

/** Index of the first Quick Start question without an answer; 0 when all are handled. */
function firstOpenQuick(intake: UseIntake): number {
  const open = quickQuestions.findIndex((q) => countHandled(intake.state.answers, [q.id]) === 0);
  return open === -1 ? 0 : open;
}

function defaultPhase(intake: UseIntake): AuditPhase {
  const quickDone = countHandled(intake.state.answers, quickIds) === quickIds.length;
  if (!quickDone) return 'questions';
  const rest = countHandled(
    intake.state.answers,
    restQuestions.map((q) => q.id),
  );
  return rest > 0 ? 'sections' : 'read';
}

function AuditFlowBody({
  store,
  phase,
  onPhaseChange,
  phaseHref,
  reportHref,
  unlockHref,
}: AuditFlowProps): ReactNode {
  const intake = useIntake(store);
  const toast = useToast();
  const { answers } = intake.state;
  const [resumePhase] = useState(() => defaultPhase(intake));
  const [step, setStep] = useState(() => firstOpenQuick(intake));
  const privacyShown = useRef(intake.overall.handled > 0);
  const focusTarget = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const quickDone = countHandled(answers, quickIds) === quickIds.length;
  // The order is fixed: nobody reaches the first read or the sections before the Quick Start questions.
  const current: AuditPhase = quickDone ? (phase ?? resumePhase) : 'questions';

  const sectionPos = Math.max(0, restSections.indexOf(sectionIds[intake.state.sectionIndex] ?? 'A'));
  const sectionId = restSections[sectionPos] ?? restSections[0];

  // After Back or Next the new question or section takes focus and scrolls into view.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    focusTarget.current?.focus();
  }, [step, sectionPos, current]);

  const onAnswered = (): void => {
    if (privacyShown.current) return;
    privacyShown.current = true;
    toast.show({ message: en.accounts.signIn.privacy, status: 'info' });
  };

  const sectionQuestions = useMemo(
    () =>
      sectionId
        ? questionsInSection(restQuestions, sectionId)
        : ([] as Question[]),
    [sectionId],
  );
  const sectionHandled = countHandled(
    answers,
    sectionQuestions.map((q) => q.id),
  );
  const progress = sectionQuestions.length > 0 ? sectionHandled / sectionQuestions.length : 0;

  if (current === 'read') {
    return (
      <FirstReadPage
        answers={answers}
        changeAnswersHref={phaseHref('questions')}
        continueHref={phaseHref('sections')}
        unlockHref={unlockHref}
      />
    );
  }

  if (current === 'questions') {
    const question = quickQuestions[step];
    if (!question) return null;
    const last = step === quickQuestions.length - 1;
    const handled = countHandled(answers, [question.id]) > 0;
    const go = (to: number): void => {
      moved.current = true;
      setStep(to);
    };
    return (
      <div className={styles.root}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 className={styles.title}>{fill(copy.title, { count: quickQuestions.length })}</h1>
          <p className={styles.lead}>{copy.lead}</p>
        </header>
        <StepLabel word={uiCopy.step.question} current={step + 1} total={quickQuestions.length} />
        <div ref={focusTarget} tabIndex={-1} className={styles.focus}>
          <Question key={question.id} intake={intake} question={question} onAnswered={onAnswered} />
        </div>
        <nav aria-label={copy.stepperLabel} className={styles.nav}>
          <div>
            {step > 0 ? (
              <Button variant="outline" onClick={() => go(step - 1)}>
                {copy.back}
              </Button>
            ) : null}
          </div>
          <Button
            disabled={!handled}
            onClick={() => {
              if (!last) {
                go(step + 1);
                return;
              }
              intake.saveNow();
              onPhaseChange('read');
            }}
          >
            {last ? copy.submit : copy.next}
          </Button>
        </nav>
      </div>
    );
  }

  if (!sectionId) return null;
  const previousId = restSections[sectionPos - 1];
  const nextId = restSections[sectionPos + 1];
  const goSection = (id: SectionId): void => {
    moved.current = true;
    intake.saveAndGoToSection(sectionIds.indexOf(id));
  };
  const saveText = {
    idle: en.intake.save.idle,
    saving: en.intake.save.saving,
    saved: en.intake.save.saved,
  }[intake.saveStatus];

  return (
    <div className={styles.root}>
      <header className={styles.intro}>
        <h1 className={styles.title}>{en.intake.title}</h1>
      </header>
      <KiteTrack
        label={uiCopy.flow.sectionsTrack}
        previous={previousId ? en.sections[previousId] : undefined}
        current={en.sections[sectionId]}
        next={nextId ? en.sections[nextId] : undefined}
        progress={progress}
      />
      <StepLabel current={sectionPos + 1} total={restSections.length} />
      <div ref={focusTarget} tabIndex={-1} className={styles.focus}>
        <h2 className={styles.sectionTitle}>{en.sections[sectionId]}</h2>
        <ol aria-label={en.intake.questionsLabel} className={styles.questions}>
          {sectionQuestions.map((q) => (
            <li key={q.id}>
              <Question intake={intake} question={q} onAnswered={onAnswered} />
            </li>
          ))}
        </ol>
      </div>
      <nav aria-label={en.intake.nav.label} className={styles.nav}>
        <div>
          {previousId ? (
            <Button
              variant="outline"
              onClick={() => goSection(previousId)}
            >
              {fill(uiCopy.flow.backTo, { name: en.sections[previousId] })}
            </Button>
          ) : (
            <Button variant="outline" href={phaseHref('read')}>
              {fill(uiCopy.flow.backTo, { name: copy.firstReadPageTitle })}
            </Button>
          )}
        </div>
        {nextId ? (
          <Button onClick={() => goSection(nextId)}>
            {fill(uiCopy.flow.continueTo, { name: en.sections[nextId] })}
          </Button>
        ) : (
          <Button href={reportHref}>{en.intake.nav.seeReport}</Button>
        )}
      </nav>
      <p role="status" aria-live="polite" className={styles.save}>
        {saveText}
      </p>
    </div>
  );
}

/**
 * One continuous audit: the Quick Start questions one by one, the free first read, then the remaining
 * questions section by section. Answers save by themselves; there is no save button.
 */
export function AuditFlow(props: AuditFlowProps): ReactNode {
  const isClient = useIsClient();
  if (!isClient) return <FirstReadPageLoading />;
  return <AuditFlowBody {...props} />;
}
