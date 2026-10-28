'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import { SampleDataBadge } from '@/patterns';
import { PageContainer } from '@/shell';
import { Button, Icon, Select } from '@/ui';
import { countByFilter, filterCards, sortCards } from '../../model';
import type { AuditCardModel, AuditFilter, AuditSort } from '../../model';
import { AuditCard } from '../AuditCard';
import type { OpenTarget } from '../AuditCard';
import { DevAccountsNotice } from '../DevAccountsNotice';
import { EmptyAudits } from '../EmptyAudits';
import { FilterGroup } from '../FilterGroup';
import styles from './DashboardView.module.css';

export type DashboardViewProps = {
  email: string;
  audits: readonly AuditCardModel[];
  /** Questions in a full audit, from config. */
  total: number;
  onOpen: (id: string, target: OpenTarget) => void;
  openingId?: string;
  failedId?: string;
  onStartNew: () => void;
  onSignOut: () => void;
  signingOut?: boolean;
  signOutFailed?: boolean;
  /** Shows the "Development accounts" notice. */
  development?: boolean;
};

const copy = en.accounts.dashboard;

/** The signed-in Dashboard, drawn from card models. Stateless about accounts: the page supplies the data. */
export function DashboardView({
  email,
  audits,
  total,
  onOpen,
  openingId,
  failedId,
  onStartNew,
  onSignOut,
  signingOut = false,
  signOutFailed = false,
  development = false,
}: DashboardViewProps): ReactNode {
  const titleId = useId();
  const [filter, setFilter] = useState<AuditFilter>('all');
  const [sort, setSort] = useState<AuditSort>('updated');

  const counts = countByFilter(audits);
  const shown = sortCards(filterCards(audits, filter), sort, copy.card.untitled);
  const empty = audits.length === 0;

  return (
    <PageContainer className={styles.page}>
      <section aria-labelledby={titleId} className={styles.intro}>
        <div className={styles.introText}>
          {audits.some((a) => a.sample) ? <SampleDataBadge label={copy.sample} /> : null}
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 id={titleId} className={styles.title}>
            {copy.title}
          </h1>
          <p className={styles.lead}>{copy.lead}</p>
        </div>
        <span className={styles.private}>
          <Icon name="lock" size={18} strokeWidth={2.2} />
          {fill(copy.privateTo, { email })}
        </span>
      </section>

      {development ? <DevAccountsNotice /> : null}

      {empty ? (
        <EmptyAudits total={total} onStart={onStartNew} />
      ) : (
        <>
          <section aria-label={copy.controlsLabel} className={styles.controls}>
            <FilterGroup
              label={copy.filterLabel}
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: copy.filters.all, count: counts.all },
                { value: 'progress', label: copy.filters.progress, count: counts.progress },
                { value: 'complete', label: copy.filters.complete, count: counts.complete },
              ]}
            />
            <Select
              label={copy.sortLabel}
              value={sort}
              onChange={(e) => setSort(e.target.value as AuditSort)}
              options={[
                { value: 'updated', label: copy.sort.updated },
                { value: 'name', label: copy.sort.name },
                { value: 'progress', label: copy.sort.progress },
              ]}
            />
          </section>

          <section aria-label={copy.listLabel} className={styles.grid}>
            {shown.map((audit) => (
              <AuditCard
                key={audit.id}
                audit={audit}
                onOpen={onOpen}
                opening={openingId === audit.id}
                failed={failedId === audit.id}
              />
            ))}
            <button type="button" className={`${styles.newTile} hover-lift`} onClick={onStartNew}>
              <span className={styles.plus} aria-hidden="true">
                <Icon name="plus" size={28} strokeWidth={2.6} />
              </span>
              <span className={styles.newTitle}>{copy.newAudit.title}</span>
              <span className={styles.newBody}>{fill(copy.newAudit.body, { total })}</span>
            </button>
          </section>

          {shown.length === 0 ? (
            <p role="status" className={styles.noMatch}>
              {copy.noMatch}
            </p>
          ) : null}
        </>
      )}

      <section className={styles.privacy}>
        <div className={styles.privacyText}>
          <h2 className={styles.privacyTitle}>{copy.privacy.title}</h2>
          <span className={styles.privacyBody}>{copy.privacy.body}</span>
        </div>
        {signOutFailed ? (
          <p role="alert" className={styles.signOutFailed}>
            <Icon name="concern" size={16} strokeWidth={2.4} />
            {copy.privacy.signOutFailed}
          </p>
        ) : null}
        <Button
          variant="secondary"
          onClick={onSignOut}
          loading={signingOut}
          loadingLabel={copy.privacy.signingOut}
        >
          {copy.privacy.signOut}
        </Button>
      </section>
    </PageContainer>
  );
}
