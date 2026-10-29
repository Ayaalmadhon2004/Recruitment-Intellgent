import type { ReactNode } from 'react';
import { SampleDataBadge } from '@/patterns';
import { en } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import { Card, Icon } from '@/ui';
import { channelById, fill } from './channels';
import { sampleAdvisors } from './sampleAdvisors';
import styles from './AdvisorRequest.module.css';

const copy = en.advisor.team;

/** "Meet our advisors": who you would be talking to, before you pick a channel. */
export function AdvisorTeam(): ReactNode {
  return (
    <section aria-labelledby="advisor-team" className={styles.block}>
      <SectionHeader id="advisor-team" eyebrow={copy.eyebrow} title={copy.title} />
      <p className={styles.teamLead}>
        {copy.lead} <SampleDataBadge label={copy.sampleNote} variant="outline" />
      </p>
      <ul className={styles.team}>
        {sampleAdvisors.map((a) => (
          <li key={a.id} className={styles.teamItem}>
            <Card as="article" tone="open" radius="lg" className={styles.advisor}>
              <span
                role="img"
                aria-label={fill(copy.avatarLabel, { name: a.name })}
                className={styles.avatar}
              >
                <span aria-hidden="true">{a.initials}</span>
              </span>
              <h3 className={styles.advisorName}>{a.name}</h3>
              <p className={styles.advisorTitle}>{a.title}</p>
              <p className={styles.advisorBio}>{a.specialisation}</p>
              <p className={styles.availability}>
                <Icon name={channelById(a.availability).icon} size={18} />
                <span className="visually-hidden">{copy.availabilityLabel}: </span>
                {copy.availability[a.availability]}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
