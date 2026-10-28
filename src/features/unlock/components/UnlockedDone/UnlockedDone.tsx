import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { Button, Icon } from '@/ui';
import styles from './UnlockedDone.module.css';

const copy = en.unlock.done;

export type UnlockedDoneProps = {
  /** The option used, already rendered (a confirmed label, or the TBC placeholder). */
  option: ReactNode;
  reportHref?: string;
  pdfHref?: string;
};

/** The success state: the report is unlocked. Status is the icon, the word DONE and the title. */
export function UnlockedDone({
  option,
  reportHref = routes.report,
  pdfHref = routes.reportPdf,
}: UnlockedDoneProps): ReactNode {
  return (
    <section aria-labelledby="unlock-done-title" className={styles.done}>
      <span className={styles.icon} role="img" aria-label={copy.iconLabel}>
        <Icon name="check-circle" size={96} strokeWidth={1.8} />
      </span>
      <div className={styles.text}>
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h2 id="unlock-done-title" className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.body}>
          {copy.optionUsed} {option}
        </p>
        <div className={styles.actions}>
          <Button href={reportHref}>{copy.openReport}</Button>
          <Button href={pdfHref} variant="secondary">
            {copy.previewPdf}
          </Button>
        </div>
      </div>
    </section>
  );
}
