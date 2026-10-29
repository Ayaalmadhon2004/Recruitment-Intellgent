'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en, t } from '@/domain/copy';
import type { StageResult } from '@/domain/types';
import { PageContainer } from '@/shell';
import { Button, Card } from '@/ui';
import { fetchAuditSummaries } from '../../api';
import { stageViewOf, toCardModel } from '../../model';
import type { StageView } from '../../model';
import { getDefaultRuntime } from '../../runtime';
import type { AccountsRuntime } from '../../runtime';
import type { SavedAudit } from '../../types';
import { useAccountSession } from '../../useAccountSession';
import { adoptLocalAudit, resumeAudit, signOutAndClear, startNewAudit } from '../../working-copy';
import type { OpenTarget } from '../AuditCard';
import { DashboardSkeleton, DashboardView } from '../DashboardView';
import styles from './DashboardPage.module.css';

export type DashboardPageProps = {
  /** Where the account service, device and Quick Start copies live. Defaults to this browser. Keep stable. */
  runtime?: AccountsRuntime;
};

const copy = en.accounts.dashboard;

/** Stages by audit id; 'unavailable' when the server could not be reached; undefined while asking. */
type Stages = Readonly<Record<string, StageResult>> | 'unavailable' | undefined;

type Data =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; audits: SavedAudit[]; stages: Stages };

/** Loads the signed-in person's audits (moving anonymous work in first), then asks the server for stages. */
export function DashboardPage({ runtime: runtimeProp }: DashboardPageProps): ReactNode {
  const router = useRouter();
  const [runtime] = useState(() => runtimeProp ?? getDefaultRuntime());
  const { session, refresh } = useAccountSession(runtime);
  const [data, setData] = useState<Data>({ status: 'loading' });
  const [openingId, setOpeningId] = useState<string>();
  const [failedId, setFailedId] = useState<string>();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutFailed, setSignOutFailed] = useState(false);
  const user = session.user;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        try {
          await adoptLocalAudit(runtime);
        } catch {
          // Adoption can be retried on the next visit; it must not hide the audits already saved.
        }
        const audits = await runtime.service.listAudits();
        if (cancelled) return;
        setData({ status: 'ready', audits, stages: undefined });
        const summaries = await fetchAuditSummaries(audits);
        if (cancelled) return;
        const stages: Stages = summaries
          ? Object.fromEntries(summaries.summaries.map((s) => [s.id, s.stage]))
          : 'unavailable';
        setData((prev) => (prev.status === 'ready' ? { ...prev, stages } : prev));
      } catch {
        if (!cancelled) setData({ status: 'error' });
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [user, runtime]);

  const cards = useMemo(() => {
    if (data.status !== 'ready') return [];
    return data.audits.map((audit) => {
      const stage: StageView =
        data.stages === undefined
          ? { kind: 'checking' }
          : data.stages === 'unavailable'
            ? { kind: 'unavailable' }
            : stageViewOf(data.stages[audit.id], runtime.config, t);
      return toCardModel(audit, stage, runtime.config);
    });
  }, [data, runtime.config]);

  const onOpen = (id: string, target: OpenTarget): void => {
    setOpeningId(id);
    setFailedId(undefined);
    resumeAudit(runtime, id).then(
      () => router.push(target === 'intake' ? routes.intake : routes.report),
      () => {
        setOpeningId(undefined);
        setFailedId(id);
      },
    );
  };

  const onStartNew = (): void => {
    startNewAudit(runtime);
    router.push(routes.intake);
  };

  const onSignOut = (): void => {
    setSigningOut(true);
    setSignOutFailed(false);
    signOutAndClear(runtime).then(
      () => router.push(routes.signIn),
      () => {
        setSigningOut(false);
        setSignOutFailed(true);
      },
    );
  };

  if (session.status === 'signed-out') {
    return (
      <PageContainer className={styles.page}>
        <Card radius="lg" className={styles.card}>
          <span className={styles.eyebrow}>{copy.signedOut.eyebrow}</span>
          <h1 className={styles.title}>{copy.signedOut.title}</h1>
          <p className={styles.body}>{copy.signedOut.body}</p>
          <div>
            <Button href={routes.signIn}>{copy.signedOut.cta}</Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (session.status === 'error' || data.status === 'error') {
    return (
      <PageContainer className={styles.page}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p role="alert" className={styles.body}>
          {copy.loadError}
        </p>
        <div>
          <Button
            variant="secondary"
            onClick={() => {
              setData({ status: 'loading' });
              refresh();
            }}
          >
            {copy.retry}
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (session.status === 'loading' || data.status === 'loading' || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardView
      email={user.email}
      audits={cards}
      total={runtime.config.questions.length}
      onOpen={onOpen}
      openingId={openingId}
      failedId={failedId}
      onStartNew={onStartNew}
      onSignOut={onSignOut}
      signingOut={signingOut}
      signOutFailed={signOutFailed}
      development={runtime.isDevelopment}
    />
  );
}
