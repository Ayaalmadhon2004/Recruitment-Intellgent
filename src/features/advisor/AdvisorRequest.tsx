'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { FlowShell, TbcValue } from '@/patterns';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { PageContainer, SectionHeader } from '@/shell';
import { Field, Icon, PaperFoldMark, RadioCardGroup, Select } from '@/ui';
import { AdvisorAside } from './AdvisorAside';
import { AdvisorSuccess } from './AdvisorSuccess';
import { AdvisorTeam } from './AdvisorTeam';
import { ReasonCards } from './ReasonCards';
import { channelById, channels, fill, timeWindows } from './channels';
import { errorMessages } from './errors';
import { isChannel, isTimeWindow, validateAdvisorRequest } from './validate';
import type { AdvisorRequestInput, FieldErrors } from './validate';
import type { AdvisorResponseBody } from './api/handler';
import styles from './AdvisorRequest.module.css';

const copy = en.advisor;
const endpoint = '/api/advisor-request';
const firstStep = 0;

const emptyValues: AdvisorRequestInput = {
  channel: 'whatsapp',
  name: '',
  institution: '',
  contact: '',
  time: 'morning',
  message: '',
};

export type AdvisorRequestProps = {
  /** Destination of "Back to my report". */
  backHref?: string;
  /** For stories and tests: start state. */
  initialStep?: number;
  initialValues?: Partial<AdvisorRequestInput>;
  initialStatus?: 'editing' | 'submitting' | 'success';
  initialErrors?: FieldErrors;
};

const steps = [
  { id: 'channel', label: copy.flow.stepChannel },
  { id: 'details', label: copy.flow.stepDetails },
];

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

async function send(values: AdvisorRequestInput): Promise<AdvisorResponseBody | null> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    return (await res.json()) as AdvisorResponseBody;
  } catch {
    return null;
  }
}

export function AdvisorRequest({
  backHref = routes.report,
  initialStep = firstStep,
  initialValues,
  initialStatus = 'editing',
  initialErrors = {},
}: AdvisorRequestProps): ReactNode {
  const [step, setStep] = useState(initialStep);
  const [values, setValues] = useState<AdvisorRequestInput>({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [status, setStatus] = useState(initialStatus);
  const [serverError, setServerError] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const [sent, setSent] = useState<AdvisorRequestInput | null>(
    initialStatus === 'success' ? { ...emptyValues, ...initialValues } : null,
  );
  const details = useRef<HTMLDivElement>(null);

  // After a failed submit, move focus to the first field with an error.
  useEffect(() => {
    if (focusTick === 0) return;
    details.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusTick]);

  const channel = channelById(values.channel);

  const set = <K extends keyof AdvisorRequestInput>(
    key: K,
    value: AdvisorRequestInput[K],
  ): void => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (): Promise<void> => {
    const result = validateAdvisorRequest(values);
    if (!result.ok) {
      setErrors(result.errors);
      setFocusTick((n) => n + 1);
      return;
    }
    setServerError(false);
    setStatus('submitting');
    const body = await send(result.value);
    if (body?.ok) {
      setSent(result.value);
      setStatus('success');
      return;
    }
    setStatus('editing');
    if (body && 'errors' in body) {
      setErrors(body.errors);
      setFocusTick((n) => n + 1);
    } else {
      setServerError(true);
    }
  };

  const reset = (): void => {
    setValues(emptyValues);
    setErrors({});
    setSent(null);
    setServerError(false);
    setStep(firstStep);
    setStatus('editing');
  };

  const onNext = (): void => {
    if (step < steps.length - 1) setStep(step + 1);
    else void submit();
  };

  const success =
    status === 'success' && sent ? (
      <AdvisorSuccess request={sent} backHref={backHref} onAgain={reset} />
    ) : undefined;

  const channelOptions = channels.map((c) => ({
    value: c.id,
    label: c.copy.name,
    description: c.copy.line,
    icon: c.icon,
    detail: <TbcValue value={c.confirmed} placeholder={c.copy.detailTbc} />,
  }));

  const err = (key: keyof FieldErrors): string | undefined => {
    const code = errors[key];
    return code ? errorMessages[code] : undefined;
  };

  return (
    <>
      <section className={styles.hero}>
        <span className={styles.heroMark}>
          <PaperFoldMark size={320} />
        </span>
        <PageContainer className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{copy.hero.title}</h1>
          <p className={styles.heroLead}>{copy.hero.lead}</p>
        </PageContainer>
      </section>
      <PageContainer className={styles.main}>
        <ReasonCards />
        <AdvisorTeam />
        <section aria-label={copy.flow.sectionLabel} className={styles.flow}>
          <FlowShell
            steps={steps}
            current={step}
            labels={flowLabels}
            onBack={() => setStep((s) => Math.max(firstStep, s - 1))}
            onNext={onNext}
            submitting={status === 'submitting'}
            success={success}
          >
            {step === 0 ? (
              <div className={styles.stepBlock}>
                <SectionHeader
                  eyebrow={fill(copy.flow.stepEyebrow, { n: 1 })}
                  title={copy.flow.stepChannel}
                />
                <RadioCardGroup
                  legend={copy.flow.channelLegend}
                  name="channel"
                  options={channelOptions}
                  value={values.channel}
                  onChange={(v) => {
                    if (isChannel(v)) {
                      set('channel', v);
                      setErrors((e) => ({ ...e, contact: undefined }));
                    }
                  }}
                />
              </div>
            ) : (
              <div className={styles.detailsRow}>
                <div ref={details} className={styles.form}>
                  <SectionHeader
                    eyebrow={fill(copy.flow.stepEyebrow, { n: 2 })}
                    title={copy.flow.stepDetails}
                  />
                  {serverError ? (
                    <p role="alert" className={styles.serverError}>
                      <Icon name="concern" size={16} strokeWidth={2.4} />
                      {copy.errors.server}
                    </p>
                  ) : null}
                  <div className={styles.pair}>
                    <Field
                      label={copy.form.name}
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set('name', e.target.value)}
                      error={err('name')}
                    />
                    <Field
                      label={copy.form.institution}
                      type="text"
                      autoComplete="organization"
                      value={values.institution}
                      onChange={(e) => set('institution', e.target.value)}
                      error={err('institution')}
                    />
                  </div>
                  <div className={styles.pair}>
                    <Field
                      label={channel.copy.contactLabel}
                      type={channel.inputType}
                      autoComplete={channel.autoComplete}
                      inputMode={channel.inputType === 'tel' ? 'tel' : 'email'}
                      value={values.contact}
                      onChange={(e) => set('contact', e.target.value)}
                      error={err('contact')}
                    />
                    <Select
                      label={copy.form.time}
                      options={timeWindows}
                      value={values.time}
                      onChange={(e) => {
                        if (isTimeWindow(e.target.value)) set('time', e.target.value);
                      }}
                      error={err('time')}
                    />
                  </div>
                  <Field
                    multiline
                    label={copy.form.message}
                    hint={copy.form.messageHint}
                    value={values.message}
                    onChange={(e) => set('message', e.target.value)}
                    error={err('message')}
                  />
                  <p className={styles.muted}>
                    {fill(copy.form.via, { channel: channel.copy.via })}
                  </p>
                </div>
                <AdvisorAside />
              </div>
            )}
          </FlowShell>
        </section>
      </PageContainer>
    </>
  );
}
