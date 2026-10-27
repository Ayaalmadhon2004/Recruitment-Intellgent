import type { ReactNode } from 'react';
import { Button, PhotoBox } from '@/ui';
import { TbcValue } from '../TbcValue';
import styles from './AdvisorCta.module.css';

export type AdvisorChannel = {
  id: string;
  label: string;
  /** Null until Capstone confirms the channel. Then it renders as a labelled placeholder, not a link. */
  href: string | null;
};

export type AdvisorCtaProps = {
  title: string;
  body: string;
  /** Advisor photo, or a labelled placeholder until it is supplied. */
  photo: { src: string; alt: string } | { placeholder: string };
  channels: readonly AdvisorChannel[];
  /** "[TO BE CONFIRMED WITH CAPSTONE]" */
  tbcText: string;
};

export function AdvisorCta({ title, body, photo, channels, tbcText }: AdvisorCtaProps): ReactNode {
  const photoProps = { width: 88, height: 88, shape: 'round' as const };
  return (
    <section className={styles.band} aria-label={title}>
      <div className={styles.who}>
        {'src' in photo ? (
          <PhotoBox {...photoProps} src={photo.src} alt={photo.alt} />
        ) : (
          <PhotoBox {...photoProps} placeholder={photo.placeholder} />
        )}
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.body}>{body}</p>
        </div>
      </div>
      <ul className={styles.channels}>
        {channels.map((c, i) => (
          <li key={c.id}>
            {c.href !== null ? (
              <Button href={c.href} variant={i === 0 ? 'inverse' : 'inverse-outline'}>
                {c.label}
              </Button>
            ) : (
              <span className={styles.pending}>
                <span className={styles.pendingLabel}>{c.label}</span>
                <TbcValue value={null} placeholder={tbcText} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
