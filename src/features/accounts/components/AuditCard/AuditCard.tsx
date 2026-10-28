import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import { SampleDataBadge, StatusBadge } from '@/patterns';
import { Button, Card, Icon } from '@/ui';
import { formatUpdated } from '../../model';
import type { AuditCardModel, StageView } from '../../model';
import { ProgressRing } from '../ProgressRing';
import styles from './AuditCard.module.css';

export type OpenTarget = 'intake' | 'report';

export type AuditCardProps = {
  audit: AuditCardModel;
  /** Resumes this audit and goes to the Intake or the Report. */
  onOpen: (id: string, target: OpenTarget) => void;
  /** True while this card's audit is being opened: both buttons wait. */
  opening?: boolean;
  /** True when opening this audit failed. */
  failed?: boolean;
};

const copy = en.accounts.dashboard.card;

function stageText(stage: StageView): string {
  switch (stage.kind) {
    case 'staged':
      return fill(copy.stage, { stage: stage.label });
    case 'not-scorable':
      return copy.stageNotScorable;
    case 'unavailable':
      return copy.stageUnavailable;
    case 'checking':
      return copy.stageChecking;
  }
}

/** One saved audit: progress, stage, when it changed and the two ways back in. */
export function AuditCard({
  audit,
  onOpen,
  opening = false,
  failed = false,
}: AuditCardProps): ReactNode {
  const name = audit.name ?? copy.untitled;
  const complete = audit.progress === 'complete';
  return (
    <Card as="article" lift className={styles.card} aria-label={name}>
      <div className={styles.top}>
        <ProgressRing
          percent={audit.percent}
          tone={complete ? 'strong' : 'crimson'}
          ariaLabel={fill(copy.ringAria, { name, percent: audit.percent })}
        />
        <div className={styles.head}>
          <h2 className={styles.name}>{name}</h2>
          <StatusBadge
            tone={complete ? 'strong' : 'info'}
            label={complete ? copy.complete : copy.inProgress}
          />
        </div>
      </div>
      <div className={styles.facts}>
        <span>
          <strong className={styles.strong}>
            {fill(copy.answered, { answered: audit.answered, total: audit.total })}
          </strong>
        </span>
        <span>{stageText(audit.stage)}</span>
        <span>{fill(copy.updated, { date: formatUpdated(audit.updatedAt) })}</span>
        {audit.olderVersion !== null ? (
          <span className={styles.version}>
            <Icon name="info" size={16} />
            {fill(copy.versionNote, { version: audit.olderVersion })}
          </span>
        ) : null}
        {audit.sample ? <SampleDataBadge label={copy.sample} variant="outline" /> : null}
      </div>
      {failed ? (
        <p role="alert" className={styles.error}>
          <Icon name="concern" size={16} strokeWidth={2.4} />
          {copy.openError}
        </p>
      ) : null}
      <div className={styles.actions}>
        <Button
          size="sm"
          loading={opening}
          loadingLabel={copy.opening}
          aria-label={fill(copy.updateAria, { name })}
          onClick={() => onOpen(audit.id, 'intake')}
        >
          {copy.update}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={opening}
          aria-label={fill(copy.viewAria, { name })}
          onClick={() => onOpen(audit.id, 'report')}
        >
          {copy.view}
        </Button>
      </div>
    </Card>
  );
}
