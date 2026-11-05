import type { ReactNode } from 'react';
import { Kite } from '@/ui';
import { PageContainer } from '../PageContainer';
import styles from './PageMessage.module.css';

export type PageMessageProps = {
  title: string;
  body: string;
  /** The buttons or links that lead out of this message. */
  children: ReactNode;
  /** Announce the message at once (an error) rather than leaving it to be read in order. */
  alert?: boolean;
};

/** A whole-page message with a way out: page not found, or something went wrong. One h1, so focus has a place to land. */
export function PageMessage({ title, body, children, alert }: PageMessageProps): ReactNode {
  return (
    <PageContainer>
      <section className={styles.message}>
        <Kite wings="open" size="lg" />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body} role={alert ? 'alert' : undefined}>
          {body}
        </p>
        <div className={styles.actions}>{children}</div>
      </section>
    </PageContainer>
  );
}
