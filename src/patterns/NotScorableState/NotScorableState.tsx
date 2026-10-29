import type { ReactNode } from 'react';
import type { NotScorable, QuestionId } from '@/domain/types';
import { Icon } from '@/ui';
import styles from './NotScorableState.module.css';

export type NotScorableLabels = {
  /** "Not yet scorable" */
  title: string;
  /** One friendly sentence saying what the title means, shown under it. */
  explainer: string;
  /** Plain explanation for each reason. */
  reasons: Record<NotScorable['reason'], string>;
  /** Heading above the list, for example "Needs these answers". */
  missingHeading: string;
};

export type NotScorableStateProps = {
  result: NotScorable;
  labels: NotScorableLabels;
  /** Text of a question, so the list says what is missing in words. */
  questionLabel?: (id: QuestionId) => string;
  /** Where to answer a question. When given, each missing question becomes a link. */
  questionHref?: (id: QuestionId) => string | undefined;
  headingLevel?: 'h3' | 'h4';
};

/** Says "Not yet scorable" and what is missing. Never a number, never zero. */
export function NotScorableState({
  result,
  labels,
  questionLabel,
  questionHref,
  headingLevel = 'h3',
}: NotScorableStateProps): ReactNode {
  const Heading = headingLevel;
  return (
    <div className={styles.state} data-reason={result.reason}>
      <span className={styles.mark} aria-hidden="true">
        <Icon name="circle-dashed" size={28} strokeWidth={2.2} />
      </span>
      <div className={styles.text}>
        <Heading className={styles.title}>{labels.title}</Heading>
        <p className={styles.explainer}>{labels.explainer}</p>
        <p className={styles.reason}>{labels.reasons[result.reason]}</p>
        {result.missing.length > 0 ? (
          <div>
            <p className={styles.heading}>{labels.missingHeading}</p>
            <ul className={styles.list}>
              {result.missing.map((id) => {
                const text = questionLabel ? questionLabel(id) : id;
                const href = questionHref?.(id);
                return (
                  <li key={id}>
                    {href ? (
                      <a href={href} className={styles.link}>
                        {text}
                      </a>
                    ) : (
                      text
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
