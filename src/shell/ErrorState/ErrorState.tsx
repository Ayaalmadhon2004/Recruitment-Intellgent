import type { ReactNode } from 'react';
import { Icon } from '@/ui';
import { PageContainer } from '../PageContainer';
import styles from './ErrorState.module.css';

export type ErrorStateProps = {
  /** Short label above the title, for example "PAGE NOT FOUND". Comes from `en`. */
  eyebrow: string;
  title: string;
  body: string;
  /** The actions: a retry button and/or links. Rendered in a row that wraps on narrow screens. */
  children: ReactNode;
  /** `main` when no layout supplies the page landmark (not-found, global error). */
  as?: 'div' | 'main';
};

/** A friendly full-width message for an error or a missing page. Never shows technical details. */
export function ErrorState({
  eyebrow,
  title,
  body,
  children,
  as: Tag = 'div',
}: ErrorStateProps): ReactNode {
  return (
    <Tag className={styles.state}>
      <PageContainer>
        <div className={styles.card}>
          <span className={styles.mark} aria-hidden="true">
            <Icon name="alert" size={28} strokeWidth={2.2} />
          </span>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.body}>{body}</p>
          <div className={styles.actions}>{children}</div>
        </div>
      </PageContainer>
    </Tag>
  );
}
