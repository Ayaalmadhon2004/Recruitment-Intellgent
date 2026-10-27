import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import type { IconName } from '@/ui';
import { Button, Icon } from '@/ui';
import { ProgressBar } from '@/patterns';
import type { SaveStatus } from '../../state';
import styles from './IntakeOverview.module.css';

export type IntakeOverviewProps = {
  /** Questions answered or marked Not sure. */
  handled: number;
  /** Every question in the config. Never a fixed number. */
  total: number;
  /** Questions marked Not sure. */
  unsure: number;
  saveStatus: SaveStatus;
  onSaveNow: () => void;
  /** Letter of the section the audit resumed at, when an earlier audit was found. */
  resumedSection?: string;
  /** The saved audit came from another config version. */
  versionChanged?: boolean;
};

const copy = en.intake;

const saveIcon: Record<SaveStatus, IconName> = {
  idle: 'info',
  saving: 'clock',
  saved: 'check-circle',
};

const saveText: Record<SaveStatus, string> = {
  idle: copy.save.idle,
  saving: copy.save.saving,
  saved: copy.save.saved,
};

export function IntakeOverview({
  handled,
  total,
  unsure,
  saveStatus,
  onSaveNow,
  resumedSection,
  versionChanged = false,
}: IntakeOverviewProps): ReactNode {
  const percent = total > 0 ? Math.round((handled / total) * 100) : 0;
  const answeredText = fill(copy.answeredText, { done: handled, total });
  return (
    <section aria-label={copy.overviewLabel} className={styles.root}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>{fill(copy.eyebrow, { total })}</span>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.lead}>{copy.lead}</p>
        {resumedSection ? (
          <span className={styles.chip}>
            <Icon name="arrow-right" size={18} strokeWidth={2.2} />
            {fill(copy.resumed, { section: resumedSection })}
          </span>
        ) : null}
        {versionChanged ? (
          <div role="status" className={styles.notice}>
            <Icon name="info" size={20} />
            <span>{copy.versionNotice}</span>
          </div>
        ) : null}
      </div>

      <div className={styles.card}>
        <div className={styles.progress}>
          <span className={styles.percent} aria-hidden="true">
            {percent}%
          </span>
          <ProgressBar
            size="lg"
            value={handled}
            max={total}
            label={copy.completenessLabel}
            valueText={answeredText}
          />
          <span className={styles.unknown}>{fill(copy.unknownText, { count: unsure })}</span>
        </div>
        <div className={styles.saveRow}>
          <div role="status" aria-live="polite" className={styles.status} data-status={saveStatus}>
            <Icon name={saveIcon[saveStatus]} size={18} strokeWidth={2.4} />
            <span>{saveText[saveStatus]}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onSaveNow}>
            {copy.save.saveNow}
          </Button>
        </div>
      </div>
    </section>
  );
}
