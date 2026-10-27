import type { ReactNode } from 'react';
import { Accordion } from '@/ui';
import styles from './ActionList.module.css';

export type ActionItem = {
  id: string;
  title: string;
  /** For example "Quick win" or "2-4 weeks". */
  effort?: string;
  body: string;
};

export type ActionListProps = {
  /** Already ranked, most impact first. The number shown is the rank. */
  items: readonly ActionItem[];
  /** Accessible name of the list. */
  label: string;
  /** Rank of the item that starts open. Defaults to the first. */
  openFirst?: boolean;
};

export function ActionList({ items, label, openFirst = true }: ActionListProps): ReactNode {
  return (
    <ol className={styles.list} aria-label={label}>
      <li aria-hidden="true" className={styles.line} />
      {items.map((item, index) => (
        <li key={item.id} className={styles.item}>
          <span className={styles.rank} aria-hidden="true">
            {index + 1}
          </span>
          <div className={styles.body}>
            <Accordion
              items={[
                {
                  id: item.id,
                  title: item.title,
                  subtitle: item.effort,
                  content: item.body,
                },
              ]}
              defaultOpenIds={openFirst && index === 0 ? [item.id] : []}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
