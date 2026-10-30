'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { PageContainer } from '@/shell';
import { Button, Field, Icon, PaperFoldMark, Select, StepLabel } from '@/ui';
import { AdvisorAside } from './AdvisorAside';
import { AdvisorSuccess } from './AdvisorSuccess';
import { AdvisorTeam } from './AdvisorTeam';
import { ChannelChoice } from './ChannelChoice';
import { WhenToTalk } from './WhenToTalk';
import { channelById, fill, timeWindows } from './channels';
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
] as const;

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
  // Which way the person moved, so the new step arrives from the matching side (as in the audit).
  const [seenStep, setSeenStep] = useState(initialStep);
  const [stepMotion, setStepMotion] = useState<'anim-step-next' | 'anim-step-back' | undefined>();
  if (seenStep !== step) {
    setStepMotion(step > seenStep ? 'anim-step-next' : 'anim-step-back');
    setSeenStep(step);
  }
  const [values, setValues] = useState<AdvisorRequestInput>({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [status, setStatus] = useState(initialStatus);
  const [serverError, setServerError] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const [sent, setSent] = useState<AdvisorRequestInput | null>(
    initialStatus === 'success' ? { ...emptyValues, ...initialValues } : null,
  );
  const details = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const successPanel = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Move focus to the new step's heading (or the success message), but not on first render.
  const showingSuccess = status === 'success' && sent !== null;
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    if (showingSuccess) successPanel.current?.focus();
    else heading.current?.focus();
  }, [step, showingSuccess]);

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
        <WhenToTalk />
        <AdvisorTeam />
        <section aria-label={copy.flow.sectionLabel} className={styles.flow}>
          {success ? (
            <div ref={successPanel} tabIndex={-1} className={styles.panel}>
              {success}
            </div>
          ) : (
            <div className={styles.stepFlow}>
              <StepLabel current={step + 1} total={steps.length} />
              <div key={step} className={stepMotion}>
                <h2 ref={heading} tabIndex={-1} className={styles.stepTitle}>
                  {steps[step]?.label}
                </h2>
                {step === 0 ? (
                  <ChannelChoice
                    legend={copy.flow.channelLegend}
                    value={values.channel}
                    onChange={(v) => {
                      if (isChannel(v)) {
                        set('channel', v);
                        setErrors((e) => ({ ...e, contact: undefined }));
                      }
                    }}
                  />
                ) : (
                  <div className={styles.detailsRow}>
                    <div ref={details} className={styles.form}>
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
              </div>
              <div className={styles.actions}>
                {step > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => Math.max(firstStep, s - 1))}
                  >
                    {copy.flow.back}
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  onClick={onNext}
                  loading={status === 'submitting'}
                  loadingLabel={copy.flow.sending}
                >
                  {step === steps.length - 1 ? copy.flow.submit : copy.flow.next}
                </Button>
              </div>
            </div>
          )}
        </section>
      </PageContainer>
    </>
  );
}
