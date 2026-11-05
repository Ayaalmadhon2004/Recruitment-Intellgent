import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { EmptyState } from '@/patterns';
import { Button, Kite } from '@/ui';
import styles from './ReportStateMessage.module.css';

export type ReportStateMessageProps = {
  state: 'error' | 'empty';
  onRetry: () => void;
  quickStartHref: string;
  intakeHref: string;
};

const copy = en.reportPage;

/** The page-level states that are not the report itself (loading is a skeleton, not a message). Each has one h1, so focus has a place to land. Empty uses the shared EmptyState. */
export function ReportStateMessage({
  state,
  onRetry,
  quickStartHref,
  intakeHref,
}: ReportStateMessageProps): ReactNode {
  if (state === 'empty') {
    return (
      <EmptyState
        label={copy.emptyTitle}
        title={copy.emptyTitle}
        body={copy.emptyBody}
        visual={<Kite wings="open" size="lg" />}
        headingLevel={1}
      >
        <Button href={quickStartHref}>{copy.emptyQuickStart}</Button>
        <Button variant="outline" href={intakeHref}>
          {copy.emptyIntake}
        </Button>
      </EmptyState>
    );
  }
  return (
    <section className={styles.message}>
      <h1 className={styles.title}>{copy.errorTitle}</h1>
      <p role="alert" className={styles.body}>
        {copy.errorBody}
      </p>
      <div className={styles.actions}>
        <Button onClick={onRetry}>{copy.retry}</Button>
      </div>
    </section>
  );
}
