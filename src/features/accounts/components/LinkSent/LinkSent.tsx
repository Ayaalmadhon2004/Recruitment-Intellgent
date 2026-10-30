import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { TbcValue } from '@/patterns';
import { Button, Icon } from '@/ui';
import styles from './LinkSent.module.css';

export type LinkSentProps = {
  email: string;
  /** Seconds left before a new link can be asked for. */
  remaining: number;
  /** Seconds of the whole wait, for the bar. */
  cooldown: number;
  onResend: () => void;
  onChangeEmail: () => void;
  /** Present only with the development service: opens the link without email. */
  development?: { onOpen: () => void; opening: boolean; failed: boolean };
};

const copy = en.accounts.signIn;
const SECONDS_PER_MINUTE = 60;

/** 0:30 style countdown. */
export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const rest = seconds % SECONDS_PER_MINUTE;
  return `${minutes}:${rest < 10 ? '0' : ''}${rest}`;
}

const [bodyBefore = '', bodyAfter = ''] = copy.sentBody.split('{expiry}');

/** Step 2: the link was asked for. Resend is off until the wait is over. */
export function LinkSent({
  email,
  remaining,
  cooldown,
  onResend,
  onChangeEmail,
  development,
}: LinkSentProps): ReactNode {
  const waiting = remaining > 0;
  const done = cooldown > 0 ? Math.round(((cooldown - remaining) / cooldown) * 100) : 100;
  return (
    <div className={`${styles.sent} anim-up`}>
      <div className={styles.who}>
        <span className={styles.mail} aria-hidden="true">
          <Icon name="mail" size={30} strokeWidth={2} />
        </span>
        <div className={styles.address}>
          <span className={styles.caption}>{copy.linkSentTo}</span>
          <span className={styles.email}>{email}</span>
        </div>
      </div>
      <p className={styles.body}>
        {bodyBefore}
        <TbcValue
          value={tbcConfig.signInLinkExpiry}
          placeholder={copy.expiryPlaceholder}
          label={en.status.pending}
        />
        {bodyAfter}
      </p>
      <div className={styles.resend}>
        <Button variant={waiting ? 'secondary' : 'primary'} disabled={waiting} onClick={onResend}>
          {copy.resend}
        </Button>
        <span className={styles.countdown}>
          {waiting ? fill(copy.resendIn, { time: formatCountdown(remaining) }) : copy.resendReady}
        </span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <div className={styles.barFill} style={{ width: `${done}%` }} />
      </div>
      {development ? (
        <div className={styles.dev}>
          <strong>{copy.dev.heading}</strong>
          <p className={styles.devBody}>{copy.dev.body}</p>
          {development.failed ? (
            <p role="alert" className={styles.devError}>
              <Icon name="concern" size={16} strokeWidth={2.4} />
              {copy.dev.failed}
            </p>
          ) : null}
          <Button
            size="sm"
            variant="secondary"
            onClick={development.onOpen}
            loading={development.opening}
          >
            {copy.dev.open}
          </Button>
        </div>
      ) : null}
      <button type="button" className={styles.change} onClick={onChangeEmail}>
        {copy.useDifferent}
      </button>
    </div>
  );
}
