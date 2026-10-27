import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './RadioCard.module.css';

export type RadioCardOption = {
  value: string;
  label: string;
  description?: string;
  detail?: string;
  icon?: IconName;
};

export type RadioCardGroupProps = {
  /** Visible group label. Becomes the fieldset legend. */
  legend: string;
  name: string;
  options: readonly RadioCardOption[];
  value: string | null;
  onChange: (value: string) => void;
};

/** Native radio inputs inside labelled cards: arrow keys, grouping and selection come from the browser. */
export function RadioCardGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: RadioCardGroupProps): ReactNode {
  const base = useId();
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.grid}>
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cx(styles.card, selected && styles.selected, 'hover-lift')}
            >
              <span className={styles.row}>
                {o.icon ? (
                  <span className={styles.badge}>
                    <Icon name={o.icon} size={22} />
                  </span>
                ) : (
                  <span />
                )}
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={selected}
                  onChange={() => onChange(o.value)}
                  className={styles.radio}
                />
              </span>
              <span className={styles.label}>{o.label}</span>
              {o.description ? <span className={styles.description}>{o.description}</span> : null}
              {o.detail ? <span className={styles.detail}>{o.detail}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
