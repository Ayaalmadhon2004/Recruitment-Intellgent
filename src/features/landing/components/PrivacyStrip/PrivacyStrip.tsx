import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { TbcValue } from '@/patterns';
import { Icon } from '@/ui';
import styles from './PrivacyStrip.module.css';

const copy = en.landing.privacy;
const ICON_SIZE = 22;

export type PrivacyStripProps = {
  /** From tbc.config.privacyPolicyUrl. Null until Capstone confirms it. */
  privacyPolicyUrl: string | null;
};

export function PrivacyStrip({ privacyPolicyUrl }: PrivacyStripProps): ReactNode {
  return (
    <section className={styles.strip} aria-label={copy.label}>
      <span className={styles.icon}>
        <Icon name="shield" size={ICON_SIZE} />
      </span>
      <div className={styles.text}>
        <span className={styles.title}>{copy.title}</span>
        <span className={styles.body}>
          {copy.body}{' '}
          {privacyPolicyUrl ? (
            <a href={privacyPolicyUrl}>{copy.policyLink}</a>
          ) : (
            <TbcValue value={null} placeholder={copy.policyPlaceholder} />
          )}
        </span>
      </div>
    </section>
  );
}
