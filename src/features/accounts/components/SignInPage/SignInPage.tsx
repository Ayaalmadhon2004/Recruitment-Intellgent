'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { accountsConfig, routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { PageContainer } from '@/shell';
import { Button, Card, Field, Icon, PhotoBox, Stepper } from '@/ui';
import { isValidEmail } from '../../email';
import { getDefaultRuntime } from '../../runtime';
import type { AccountsRuntime } from '../../runtime';
import { isAccountError } from '../../service/errors';
import { DevAccountsNotice } from '../DevAccountsNotice';
import { LinkSent } from '../LinkSent';
import styles from './SignInPage.module.css';

const copy = en.accounts.signIn;
const ONE_SECOND = 1000;

type Problem = 'invalid' | 'unavailable';

export type SignInPageProps = {
  /** Where the account service, device and Quick Start copies live. Defaults to this browser. Keep stable. */
  runtime?: AccountsRuntime;
  /** Where a finished sign-in goes. */
  nextHref?: string;
  /** For stories and tests: where the page starts. */
  initialStep?: 'enter' | 'sent';
  initialEmail?: string;
  initialProblem?: Problem;
};

const steps = [
  { id: 'enter', label: copy.steps.enter },
  { id: 'open', label: copy.steps.open },
  { id: 'start', label: copy.steps.start },
];

/** Email, then a one-time link. The account service decides what "link" means; today it is a development stand-in. */
export function SignInPage({
  runtime: runtimeProp,
  nextHref = routes.dashboard,
  initialStep = 'enter',
  initialEmail = '',
  initialProblem,
}: SignInPageProps): ReactNode {
  const router = useRouter();
  const [runtime] = useState(() => runtimeProp ?? getDefaultRuntime());
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [problem, setProblem] = useState<Problem | undefined>(initialProblem);
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState<string>();
  const [remaining, setRemaining] = useState<number>(accountsConfig.resendCooldownSeconds);
  const [opening, setOpening] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    headingRef.current?.focus();
  }, [step]);

  // One tick per second while a new link cannot be asked for yet.
  useEffect(() => {
    if (step !== 'sent' || remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((n) => Math.max(0, n - 1)), ONE_SECOND);
    return () => clearTimeout(timer);
  }, [step, remaining]);

  const requestLink = async (address: string): Promise<boolean> => {
    setSending(true);
    setProblem(undefined);
    try {
      const result = await runtime.service.requestSignInLink(address);
      setEmail(result.email);
      setToken(result.developmentToken);
      setRemaining(accountsConfig.resendCooldownSeconds);
      setOpenFailed(false);
      return true;
    } catch (error) {
      setProblem(isAccountError(error, 'invalid-email') ? 'invalid' : 'unavailable');
      return false;
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setProblem('invalid');
      return;
    }
    if (await requestLink(email)) {
      moveFocus.current = true;
      setStep('sent');
    }
  };

  const onOpenLink = async (): Promise<void> => {
    if (token === undefined) return;
    setOpening(true);
    setOpenFailed(false);
    try {
      await runtime.service.completeSignIn(token);
      router.push(nextHref);
    } catch {
      setOpenFailed(true);
      setOpening(false);
    }
  };

  const sent = step === 'sent';
  return (
    <PageContainer className={styles.page}>
      <div className={styles.column}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 ref={headingRef} tabIndex={-1} className={styles.title}>
            {sent ? copy.titleSent : copy.titleEnter}
          </h1>
          <p className={styles.lead}>{copy.lead}</p>
        </div>

        <Stepper
          steps={steps}
          current={sent ? 1 : 0}
          label={copy.stepsLabel}
          stateLabels={copy.stateLabels}
        />

        <Card radius="lg" className={styles.card}>
          {sent ? (
            <LinkSent
              email={email}
              remaining={remaining}
              cooldown={accountsConfig.resendCooldownSeconds}
              onResend={() => void requestLink(email)}
              onChangeEmail={() => {
                moveFocus.current = true;
                setStep('enter');
                setProblem(undefined);
              }}
              development={
                token === undefined
                  ? undefined
                  : { onOpen: () => void onOpenLink(), opening, failed: openFailed }
              }
            />
          ) : (
            <form className={styles.form} noValidate onSubmit={(e) => void onSubmit(e)}>
              {problem !== undefined ? (
                <div role="alert" className={styles.problem}>
                  <Icon name="concern" size={22} strokeWidth={2.2} />
                  <span>
                    <strong>{copy.problem}</strong>{' '}
                    {problem === 'invalid' ? copy.invalidEmail : copy.unavailable}
                  </span>
                </div>
              ) : null}
              <Field
                label={copy.emailLabel}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={copy.emailPlaceholder}
                hint={copy.emailHint}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                invalid={problem === 'invalid'}
              />
              <Button type="submit" size="lg" loading={sending} loadingLabel={copy.sending}>
                {problem === undefined ? copy.cta : copy.ctaRetry}
                <Icon name="arrow-right" size={20} strokeWidth={2.4} />
              </Button>
            </form>
          )}
          <p className={styles.privacy}>
            <Icon name="lock" size={18} strokeWidth={2.2} />
            <span>{copy.privacy}</span>
          </p>
        </Card>

        {runtime.isDevelopment ? <DevAccountsNotice /> : null}
      </div>

      <div className={styles.visual}>
        <PhotoBox
          shape="arch"
          width={300}
          height={400}
          src="/temp-assets/temp-graduate.jpg"
          alt={copy.photoAlt}
          className={styles.photo}
        />
        <div className={`${styles.chip} anim-float`}>
          <span className={styles.chipIcon} aria-hidden="true">
            <Icon name="check" size={20} strokeWidth={2.4} />
          </span>
          <span className={styles.chipText}>
            {copy.savedTitle}
            <span className={styles.chipBody}>{copy.savedBody}</span>
          </span>
        </div>
      </div>
    </PageContainer>
  );
}
