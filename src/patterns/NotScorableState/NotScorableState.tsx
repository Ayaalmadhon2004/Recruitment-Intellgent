'use client';

import { createContext, useContext } from 'react';
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

/** True inside `NotScorableExplained`: the page says what "Not yet scorable" means once, so each area need not. */
type Explained = { readonly open: readonly NotScorable[]; readonly labels: NotScorableLabels };
const ExplainedOnce = createContext<Explained | undefined>(undefined);

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
  const explainedOnce = (useContext(ExplainedOnce)?.open.length ?? 0) > 0;
  // An unusable answer is specific to this area and says what to fix, so it always stays.
  const brief = explainedOnce && result.reason !== 'invalid-answer';
  return (
    <div className={styles.state} data-reason={result.reason}>
      <span className={styles.mark} aria-hidden="true">
        <Icon name="circle-dashed" size={28} strokeWidth={2.2} />
      </span>
      <div className={styles.text}>
        <Heading className={styles.title}>{labels.title}</Heading>
        {explainedOnce ? null : <p className={styles.explainer}>{labels.explainer}</p>}
        {brief ? null : <p className={styles.reason}>{labels.reasons[result.reason]}</p>}
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

export type NotScorableExplainedProps = {
  /** Every result on the page. Only the not-scorable ones are read. */
  results: readonly { readonly kind: string }[];
  labels: NotScorableLabels;
  children: ReactNode;
};

const isNotScorable = (result: { readonly kind: string }): result is NotScorable =>
  result.kind === 'not-scorable';

/**
 * Wrap a page once. While any result on it is not scorable, the areas inside show only the words
 * "Not yet scorable" and what is missing, and `NotScorableNote` says the rest once.
 */
export function NotScorableExplained({
  results,
  labels,
  children,
}: NotScorableExplainedProps): ReactNode {
  const open = results.filter(isNotScorable);
  return <ExplainedOnce.Provider value={{ open, labels }}>{children}</ExplainedOnce.Provider>;
}

/** The one note per page: what "Not yet scorable" means and why, once. Renders nothing when everything is scored. */
export function NotScorableNote(): ReactNode {
  const explained = useContext(ExplainedOnce);
  if (!explained) return null;
  const { open, labels } = explained;
  // The reasons that apply to the whole page, in a steady order. An unusable answer is said by its own area.
  const shared = (['no-formula', 'missing-answers'] as const).filter((reason) =>
    open.some((result) => result.reason === reason),
  );
  if (shared.length === 0) return null;
  return (
    <aside className={styles.note} aria-label={labels.title}>
      <span className={styles.mark} aria-hidden="true">
        <Icon name="circle-dashed" size={28} strokeWidth={2.2} />
      </span>
      <div className={styles.text}>
        <p className={styles.noteLead}>{labels.explainer}</p>
        {shared.map((reason) => (
          <p key={reason} className={styles.reason}>
            {labels.reasons[reason]}
          </p>
        ))}
      </div>
    </aside>
  );
}
