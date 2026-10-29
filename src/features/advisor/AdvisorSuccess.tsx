import type { ReactNode } from 'react';
import { TbcValue } from '@/patterns';
import { tbcConfig } from '@/domain/config/tbc.config';
import { en } from '@/domain/copy';
import { Button, Icon } from '@/ui';
import { AdvisorName, AdvisorPhoto } from './AdvisorAside';
import { channelById, fill, timeLabel } from './channels';
import type { AdvisorRequestInput } from './validate';
import styles from './AdvisorRequest.module.css';

const copy = en.advisor.success;

export type AdvisorSuccessProps = {
  request: Pick<AdvisorRequestInput, 'name' | 'channel' | 'time'>;
  /** Destination of "Back to my report". */
  backHref: string;
  onAgain: () => void;
};

const firstName = (name: string): string => name.trim().split(/\s+/)[0] || copy.fallbackName;

export function AdvisorSuccess({ request, backHref, onAgain }: AdvisorSuccessProps): ReactNode {
  const channel = channelById(request.channel);
  const three = copy.steps.three;
  const steps = [
    { n: 1, title: copy.steps.one.title, body: <>{copy.steps.one.body}</> },
    { n: 2, title: copy.steps.two.title, body: <>{copy.steps.two.body}</> },
    {
      n: 3,
      title: fill(three.title, { channel: channel.copy.reply }),
      body: (
        <>
          {three.bodyBefore}{' '}
          <TbcValue value={tbcConfig.advisorReplyTime} placeholder={three.timingTbc} label={en.status.pending} />
          {three.bodyAfter}
        </>
      ),
    },
  ];
  return (
    <section aria-labelledby="advisor-sent" className={styles.success}>
      <div className={styles.successMain}>
        <div className={styles.sentHead}>
          <span className={styles.sentIcon}>
            <Icon name="check-circle" size={44} strokeWidth={2} />
          </span>
          <div className={styles.sentTitles}>
            <span className={styles.sentEyebrow}>{copy.eyebrow}</span>
            <h2 id="advisor-sent" className={styles.sentTitle}>
              {fill(copy.thanks, { name: firstName(request.name) })}
            </h2>
          </div>
        </div>
        <p className={styles.lead}>{copy.intro}</p>
        <ul className={styles.chips}>
          <li className={styles.chip}>{fill(copy.chipChannel, { value: channel.copy.name })}</li>
          <li className={styles.chip}>{fill(copy.chipTime, { value: timeLabel(request.time) })}</li>
        </ul>
        <div className={styles.who}>
          <AdvisorPhoto size={72} />
          <div className={styles.whoText}>
            <strong>
              <AdvisorName />
            </strong>
            <span className={styles.muted}>{copy.willBeInTouch}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <Button href={backHref}>{copy.backToReport}</Button>
          <Button variant="secondary" onClick={onAgain}>
            {copy.again}
          </Button>
        </div>
      </div>
      <div className={styles.successNext}>
        <h3 className={styles.nextTitle}>{copy.nextTitle}</h3>
        <ol className={styles.timeline}>
          {steps.map((s) => (
            <li key={s.n} className={styles.timelineItem}>
              <span className={styles.timelineNumber}>{s.n}</span>
              <div className={styles.timelineText}>
                <span className={styles.timelineTitle}>{s.title}</span>
                <span className={styles.muted}>{s.body}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
