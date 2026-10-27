import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Switch.module.css';

export type SwitchProps = {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible words for the two states, so the state is never shown by colour alone. */
  onLabel: string;
  offLabel: string;
  disabled?: boolean;
  className?: string;
};

/** A real switch: a button with role="switch", a visible label and a visible On/Off word. */
export function Switch({
  id: idProp,
  label,
  checked,
  onChange,
  onLabel,
  offLabel,
  disabled,
  className,
}: SwitchProps): ReactNode {
  const autoId = useId();
  const id = idProp ?? autoId;
  const labelId = `${id}-label`;
  return (
    <div className={cx(styles.row, className)}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <span className={styles.control}>
        <span className={styles.state} aria-hidden="true">
          {checked ? onLabel : offLabel}
        </span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          disabled={disabled}
          className={cx(styles.button, checked && styles.on)}
          onClick={() => onChange(!checked)}
        >
          <span className={styles.track}>
            <span className={styles.knob} />
          </span>
        </button>
      </span>
    </div>
  );
}
