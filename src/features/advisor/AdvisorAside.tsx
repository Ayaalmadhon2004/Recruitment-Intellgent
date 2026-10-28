import type { ReactNode } from 'react';
import { TbcValue } from '@/patterns';
import { tbcConfig } from '@/domain/config/tbc.config';
import { en } from '@/domain/copy';
import { Card, PhotoBox } from '@/ui';
import styles from './AdvisorRequest.module.css';

const copy = en.advisor.aside;

/** Advisor photo. A config value; until confirmed it is a labelled placeholder. */
export function AdvisorPhoto({ size }: { size: number }): ReactNode {
  const src = tbcConfig.advisorPhotoUrl;
  return src ? (
    <PhotoBox
      shape="round"
      width={size}
      height={size}
      src={src}
      alt={tbcConfig.advisorName ?? ''}
    />
  ) : (
    <PhotoBox shape="round" width={size} height={size} placeholder={copy.photoTbc} />
  );
}

export function AdvisorName(): ReactNode {
  return <TbcValue value={tbcConfig.advisorName} placeholder={copy.nameTbc} />;
}

export function AdvisorAside(): ReactNode {
  return (
    <aside aria-label={copy.label} className={styles.aside}>
      <Card radius="lg" className={styles.asideCard}>
        <AdvisorPhoto size={132} />
        <h3 className={styles.asideName}>
          <AdvisorName />
        </h3>
        <span className={styles.muted}>{copy.role}</span>
        <p className={styles.reply}>
          <strong className={styles.replyLabel}>{copy.replyTime}</strong>{' '}
          <TbcValue value={tbcConfig.advisorReplyTime} placeholder={en.status.tbc} />
        </p>
      </Card>
    </aside>
  );
}
