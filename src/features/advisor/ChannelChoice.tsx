import type { ReactNode } from 'react';
import { TbcValue } from '@/patterns';
import { en } from '@/domain/copy';
import { Icon } from '@/ui';
import { channels } from './channels';
import type { ChannelId } from './validate';
import styles from './AdvisorRequest.module.css';

export type ChannelChoiceProps = {
  legend: string;
  value: ChannelId;
  onChange: (id: ChannelId) => void;
};

/** The one decision of step 1: how to talk. Plain radio rows separated by thin lines, no boxes. */
export function ChannelChoice({ legend, value, onChange }: ChannelChoiceProps): ReactNode {
  return (
    <fieldset className={styles.choice}>
      <legend className={styles.choiceLegend}>{legend}</legend>
      {channels.map((c) => (
        <label key={c.id} className={styles.option}>
          <input
            type="radio"
            name="channel"
            value={c.id}
            checked={value === c.id}
            onChange={() => onChange(c.id)}
            className={styles.radio}
          />
          <span className={styles.optionIcon}>
            <Icon name={c.icon} size={22} />
          </span>
          <span className={styles.optionText}>
            <span className={styles.optionName}>{c.copy.name}</span>
            <span className={styles.optionLine}>{c.copy.line}</span>
            <span className={styles.optionDetail}>
              <TbcValue value={c.confirmed} placeholder={c.copy.detailTbc} label={en.status.pending} />
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
