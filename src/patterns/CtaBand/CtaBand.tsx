import type { ReactNode } from 'react';
import { Button, cx } from '@/ui';
import type { ButtonVariant } from '@/ui';
import styles from './CtaBand.module.css';

export type CtaAction = {
  label: string;
  href: string;
  variant?: 'inverse' | 'inverse-outline';
};

/**
 * band: full navy closing statement, for the one conversion moment on a page.
 * panel: soft navy tint, for a mid-page next step.
 * inline: a quiet ruled row with no fill, for secondary exits such as pausing or asking an advisor.
 */
export type CtaBandTone = 'band' | 'panel' | 'inline';

export type CtaBandProps = {
  tone?: CtaBandTone;
  title: string;
  body?: string;
  eyebrow?: string;
  /** Small line under the body, for example a note that something is to be confirmed. */
  note?: ReactNode;
  actions: readonly CtaAction[];
};

/** Light tones swap the inverse buttons for the standard pair: the first action is primary, the rest secondary. */
function buttonVariant(tone: CtaBandTone, action: CtaAction, index: number): ButtonVariant {
  if (tone === 'band') return action.variant ?? 'inverse';
  return index === 0 && action.variant !== 'inverse-outline' ? 'primary' : 'secondary';
}

export function CtaBand({
  tone = 'band',
  title,
  body,
  eyebrow,
  note,
  actions,
}: CtaBandProps): ReactNode {
  return (
    <section className={cx(styles.base, styles[tone])} aria-label={title}>
      <div className={styles.text}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h2 className={styles.title}>{title}</h2>
        {body ? <p className={styles.body}>{body}</p> : null}
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
      <div className={styles.actions}>
        {actions.map((a, index) => (
          <Button
            key={a.href + a.label}
            href={a.href}
            variant={buttonVariant(tone, a, index)}
            size={tone === 'inline' ? 'md' : 'lg'}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
