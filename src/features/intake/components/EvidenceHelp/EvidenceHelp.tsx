import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { evidenceTags } from '@/domain/types';
import { EvidenceTag } from '@/patterns';
import { Accordion } from '@/ui';
import styles from './EvidenceHelp.module.css';

const help = en.intake.evidenceHelp;

/** Collapsible explainer of the evidence tags. Every tag is named by word and icon, never colour. */
export function EvidenceHelp(): ReactNode {
  return (
    <Accordion
      items={[
        {
          id: 'evidence-help',
          title: help.title,
          content: (
            <dl className={styles.list}>
              {evidenceTags.map((tag) => (
                <div key={tag} className={styles.item}>
                  <dt>
                    <EvidenceTag tag={tag} label={en.evidenceTags[tag]} />
                  </dt>
                  <dd className={styles.text}>{help[tag]}</dd>
                </div>
              ))}
            </dl>
          ),
        },
      ]}
    />
  );
}
