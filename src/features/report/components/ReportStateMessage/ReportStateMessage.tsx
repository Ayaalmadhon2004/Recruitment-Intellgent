import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { Button } from '@/ui';
import styles from './ReportStateMessage.module.css';

export type ReportStateMessageProps = {
  state: 'error' | 'empty';
  onRetry: () => void;
  quickStartHref: string;
  intakeHref: string;
};

const copy = en.reportPage;

/** The page-level states that are not the report itself (loading is a skeleton, not a message). Each has one h1, so focus has a place to land. */
export function ReportStateMessage({
  state,
  onRetry,
  quickStartHref,
  intakeHref,
}: ReportStateMessageProps): ReactNode {
  return (
    <section className={styles.message}>
      {state === 'error' ? (
        <>
          <h1 className={styles.title}>{copy.errorTitle}</h1>
          <p role="alert" className={styles.body}>
            {copy.errorBody}
          </p>
          <div className={styles.actions}>
            <Button onClick={onRetry}>{copy.retry}</Button>
          </div>
        </>
      ) : null}
      {state === 'empty' ? (
        <>
          <h1 className={styles.title}>{copy.emptyTitle}</h1>
          <p className={styles.body}>{copy.emptyBody}</p>
          <div className={styles.actions}>
            <Button href={quickStartHref}>{copy.emptyQuickStart}</Button>
            <Button variant="secondary" href={intakeHref}>
              {copy.emptyIntake}
            </Button>
          </div>
        </>
      ) : null}
    </section>
  );
}
