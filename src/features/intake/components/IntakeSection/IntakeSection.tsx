import type { ReactNode, Ref } from 'react';
import { en, fill } from '@/domain/copy';
import type { AnswerValue, KnownEvidenceTag, Question, QuestionId } from '@/domain/types';
import {
  isUnsure,
  knownFor,
  questionCardLabelsWithEvidence,
  toQuestionView,
} from '@/features/questions';
import { ProgressBar, QuestionCard } from '@/patterns';
import { Card } from '@/ui';
import { confirmedTagFor } from '../../state';
import type { IntakeState, SectionProgress } from '../../state';
import styles from './IntakeSection.module.css';

export type IntakeSectionProps = {
  progress: SectionProgress;
  /** Every question of the section, in config order. */
  questions: readonly Question[];
  state: IntakeState;
  onAnswer: (id: QuestionId, value: AnswerValue) => void;
  onNotSure: (id: QuestionId) => void;
  onEvidence: (id: QuestionId, tag: KnownEvidenceTag) => void;
  /** Receives focus when the section changes, so keyboard and screen reader users land on it. */
  headingRef?: Ref<HTMLHeadingElement>;
  /** Navigation buttons, placed under the questions. */
  children?: ReactNode;
};

const copy = en.intake;

/** The current section: heading, its progress, and every question as a card with an evidence picker. */
export function IntakeSection({
  progress,
  questions,
  state,
  onAnswer,
  onNotSure,
  onEvidence,
  headingRef,
  children,
}: IntakeSectionProps): ReactNode {
  const headingId = `intake-section-${progress.id}`;
  return (
    <Card as="section" radius="lg" aria-labelledby={headingId} className={styles.root}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <span className={styles.eyebrow}>{fill(copy.sectionEyebrow, { key: progress.id })}</span>
          <h2 id={headingId} ref={headingRef} tabIndex={-1} className={styles.title}>
            {en.sections[progress.id]}
          </h2>
        </div>
        <div className={styles.progress}>
          <ProgressBar
            value={progress.handled}
            max={progress.total}
            label={copy.sectionProgress}
            valueText={fill(copy.sectionCount, { done: progress.handled, total: progress.total })}
          />
        </div>
      </div>

      <ol aria-label={copy.questionsLabel} className={styles.questions}>
        {questions.map((q) => (
          <li key={q.id} className={styles.question}>
            <QuestionCard
              question={toQuestionView(q)}
              value={knownFor(state.answers, q.id)?.value}
              unsure={isUnsure(state.answers, q.id)}
              onChange={(value) => onAnswer(q.id, value)}
              onUnsure={() => onNotSure(q.id)}
              evidence={{
                value: confirmedTagFor(state, q.id),
                onChange: (tag) => onEvidence(q.id, tag),
              }}
              labels={questionCardLabelsWithEvidence}
              headingLevel="h3"
            />
          </li>
        ))}
      </ol>

      {children}
    </Card>
  );
}
