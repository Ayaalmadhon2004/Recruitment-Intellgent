import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import type { SectionId } from '@/domain/types';
import { Button } from '@/ui';
import styles from './IntakeNav.module.css';

export type IntakeNavProps = {
  /** Letter of the previous section, or undefined on the first. */
  previous?: SectionId;
  /** Letter of the next section, or undefined on the last. */
  next?: SectionId;
  onPrevious: () => void;
  /** Saves, then moves on. */
  onNext: () => void;
  /** Where "See my report" goes. Shown on the last section. */
  reportHref: string;
};

const copy = en.intake.nav;

export function IntakeNav({
  previous,
  next,
  onPrevious,
  onNext,
  reportHref,
}: IntakeNavProps): ReactNode {
  return (
    <nav aria-label={copy.label} className={styles.root}>
      <div>
        {previous ? (
          <Button variant="secondary" onClick={onPrevious}>
            {fill(copy.back, { key: previous })}
          </Button>
        ) : null}
      </div>
      <div>
        {next ? (
          <Button onClick={onNext}>{fill(copy.next, { key: next })}</Button>
        ) : (
          <Button href={reportHref}>{copy.seeReport}</Button>
        )}
      </div>
    </nav>
  );
}
