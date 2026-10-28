import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { Icon } from '@/ui';
import styles from './ReportVersionNotice.module.css';

export type ReportVersionNoticeProps = {
  /** Where the person reviews their answers. */
  reviewHref: string;
};

const copy = en.reportPage;

/** Shown when the stored answers were given under another config version than the one that scored them. */
export function ReportVersionNotice({ reviewHref }: ReportVersionNoticeProps): ReactNode {
  return (
    <div role="status" className={styles.notice}>
      <Icon name="info" size={20} />
      <div className={styles.text}>
        <strong>{copy.versionNoticeTitle}</strong>
        <span>{copy.versionNoticeBody}</span>
        <a href={reviewHref} className={styles.link}>
          {copy.versionNoticeLink}
        </a>
      </div>
    </div>
  );
}
