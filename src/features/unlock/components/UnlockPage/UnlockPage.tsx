'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { CtaBand, FlowShell, SampleDataBadge, TbcValue } from '@/patterns';
import { PageContainer, SectionHeader } from '@/shell';
import { Button, Icon, RadioCardGroup } from '@/ui';
import type { IconName } from '@/ui';
import { resolveUnlockPaths } from '../../paths';
import type { ResolvedUnlockPath } from '../../paths';
import { getDefaultRuntime } from '../../runtime';
import type { UnlockRuntime } from '../../runtime';
import type { EntitlementRecord } from '../../service/types';
import { DevUnlockNotice } from '../DevUnlockNotice';
import { FreeVsFull } from '../FreeVsFull';
import { SectionPeek } from '../SectionPeek';
import { UnlockedDone } from '../UnlockedDone';
import styles from './UnlockPage.module.css';

const copy = en.unlock;

type Load =
  | { status: 'checking' }
  | { status: 'error' }
  | { status: 'ready'; record: EntitlementRecord; hasAudit: boolean };

export type UnlockPageProps = {
  /** Where the entitlement service and the device audit live. Defaults to this browser. Keep stable. */
  runtime?: UnlockRuntime;
  institutionName?: string;
  /** True for fixture data: shows the Sample data badge. */
  isSample?: boolean;
  /** For stories and tests: where the flow starts. */
  initialOpen?: boolean;
  initialStep?: 0 | 1;
  initialPathId?: string;
};

const pathIcons: readonly IconName[] = ['check-circle', 'chat', 'person'];

const steps = [
  { id: 'choose', label: copy.flow.stepChoose },
  { id: 'confirm', label: copy.flow.stepConfirm },
];

const finalStep = { id: 'done', label: copy.flow.stepDone };

const flowLabels = {
  stepperLabel: copy.flow.stepperLabel,
  stateLabels: {
    done: copy.flow.stateDone,
    current: copy.flow.stateCurrent,
    upcoming: copy.flow.stateUpcoming,
  },
  back: copy.flow.back,
  next: copy.flow.next,
  submit: copy.flow.submit,
  loading: copy.flow.sending,
  announce: (n: number, total: number, label: string): string =>
    fill(copy.flow.announce, { n, total, label }),
};

const optionNode = (path: ResolvedUnlockPath | undefined): ReactNode =>
  path && path.confirmed ? (
    path.label
  ) : (
    <TbcValue value={null} placeholder={path ? path.label : en.status.tbc} label={en.status.pending} />
  );

/**
 * The Unlock screen. Entitlement comes from the `EntitlementService` in the runtime; the options, price and
 * timing come from config and show as to be confirmed until Capstone decides (open item 5).
 */
export function UnlockPage({
  runtime: runtimeProp,
  institutionName,
  isSample = false,
  initialOpen = false,
  initialStep = 0,
  initialPathId,
}: UnlockPageProps): ReactNode {
  const [runtime] = useState(() => runtimeProp ?? getDefaultRuntime());
  const paths = resolveUnlockPaths();
  const [attempt, setAttempt] = useState(0);
  const [load, setLoad] = useState<Load>({ status: 'checking' });
  const [open, setOpen] = useState(initialOpen);
  const [step, setStep] = useState<number>(initialStep);
  const [pathId, setPathId] = useState<string | null>(initialPathId ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<EntitlementRecord>();
  const flow = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<void> => {
      let next: Load;
      try {
        const record = await runtime.service.getEntitlement(runtime.auditKey());
        next = { status: 'ready', record, hasAudit: runtime.hasAudit() };
      } catch {
        next = { status: 'error' };
      }
      if (!cancelled) setLoad(next);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [runtime, attempt]);

  useEffect(() => {
    if (!open || !moveFocus.current) return;
    moveFocus.current = false;
    flow.current?.focus();
  }, [open]);

  const hero = (
    <header className={styles.hero}>
      {isSample ? <SampleDataBadge label={en.status.sample} /> : null}
      <span className={styles.eyebrow}>{copy.hero.eyebrow}</span>
      <h1 className={styles.title}>{copy.hero.title}</h1>
      <p className={styles.lead}>
        {institutionName ? fill(copy.hero.leadNamed, { name: institutionName }) : copy.hero.lead}
      </p>
    </header>
  );

  if (load.status !== 'ready') {
    return (
      <PageContainer className={styles.page}>
        {hero}
        {load.status === 'checking' ? (
          <p role="status" className={styles.message}>
            {copy.state.checking}
          </p>
        ) : (
          <div role="alert" className={styles.problem}>
            <Icon name="concern" size={22} strokeWidth={2.2} />
            <div className={styles.problemText}>
              <strong>{copy.state.errorTitle}</strong>
              <span>{copy.state.errorBody}</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setLoad({ status: 'checking' });
                setAttempt((n) => n + 1);
              }}
            >
              {copy.state.retry}
            </Button>
          </div>
        )}
      </PageContainer>
    );
  }

  const record = justUnlocked ?? (load.record.entitlement === 'unlocked' ? load.record : undefined);
  const unlocked = record !== undefined;
  const chosen = paths.find((p) => p.id === pathId);
  const flowVisible = (open && load.hasAudit) || justUnlocked !== undefined;

  const submit = async (): Promise<void> => {
    if (pathId === null) return;
    setSubmitting(true);
    setFailed(false);
    try {
      setJustUnlocked(
        await runtime.service.requestUnlock({ auditKey: runtime.auditKey(), pathId }),
      );
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const onNext = (): void => {
    if (step === 0) {
      if (pathId !== null) setStep(1);
    } else {
      void submit();
    }
  };

  let action: ReactNode;
  let note: string | undefined;
  if (!load.hasAudit) {
    note = copy.empty.body;
    action = <Button href={routes.quickStart}>{copy.empty.cta}</Button>;
  } else if (!open) {
    action = (
      <Button
        onClick={() => {
          moveFocus.current = true;
          setOpen(true);
        }}
      >
        {copy.cta.seeOptions}
      </Button>
    );
  } else {
    action = <span className={styles.pick}>{copy.cta.pickBelow}</span>;
  }

  const optionsStep = (
    <div className={styles.stepBlock}>
      <SectionHeader eyebrow={fill(copy.flow.stepEyebrow, { n: 1 })} title={copy.choose.title} />
      <RadioCardGroup
        legend={copy.choose.legend}
        name="unlock-path"
        options={paths.map((p, i) => ({
          value: p.id,
          label: p.label,
          icon: pathIcons[i] ?? 'check-circle',
          detail: p.confirmed ? (
            (p.note ?? undefined)
          ) : (
            <TbcValue value={null} placeholder={copy.choose.placeholderNote} label={en.status.pending} />
          ),
        }))}
        value={pathId}
        onChange={setPathId}
      />
      <p className={styles.hint}>{pathId === null ? copy.choose.pickOne : copy.choose.picked}</p>
    </div>
  );

  const confirmStep = (
    <div className={styles.confirmRow}>
      <div className={styles.confirmMain}>
        <SectionHeader eyebrow={fill(copy.flow.stepEyebrow, { n: 2 })} title={copy.confirm.title} />
        {failed ? (
          <p role="alert" className={styles.problemLine}>
            <Icon name="concern" size={20} strokeWidth={2.4} />
            <span>
              <strong>{copy.confirm.problem}</strong> {copy.confirm.failed}
            </span>
          </p>
        ) : null}
        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>{copy.confirm.report}</dt>
            <dd>
              {institutionName ?? copy.confirm.reportDefault}
              {isSample ? ` (${en.status.sample})` : ''}
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>{copy.confirm.option}</dt>
            <dd>{optionNode(chosen)}</dd>
          </div>
        </dl>
      </div>
      <aside className={styles.aside}>
        <h3 className={styles.asideTitle}>{copy.confirm.asideTitle}</h3>
        <p className={styles.asideBody}>{copy.confirm.asideBody}</p>
      </aside>
    </div>
  );

  const donePanel = (
    <UnlockedDone option={optionNode(paths.find((p) => p.id === record?.pathId))} />
  );

  return (
    <PageContainer className={styles.page}>
      {hero}
      <FreeVsFull unlocked={unlocked} />
      <SectionPeek unlocked={unlocked} action={unlocked ? undefined : action} note={note} />

      {flowVisible ? (
        <section
          ref={flow}
          tabIndex={-1}
          aria-label={copy.flow.sectionLabel}
          className={styles.flow}
        >
          <FlowShell
            steps={steps}
            current={step}
            labels={flowLabels}
            onBack={() => {
              setFailed(false);
              setStep(0);
            }}
            onNext={onNext}
            nextDisabled={step === 0 && pathId === null}
            submitting={submitting}
            finalStep={finalStep}
            success={justUnlocked ? donePanel : undefined}
          >
            {step === 0 ? optionsStep : confirmStep}
          </FlowShell>
        </section>
      ) : null}
      {unlocked && !justUnlocked ? donePanel : null}

      <CtaBand
        title={copy.advisor.title}
        body={copy.advisor.body}
        actions={[{ label: copy.advisor.cta, href: routes.advisor }]}
      />
      {runtime.isDevelopment ? <DevUnlockNotice /> : null}
    </PageContainer>
  );
}
