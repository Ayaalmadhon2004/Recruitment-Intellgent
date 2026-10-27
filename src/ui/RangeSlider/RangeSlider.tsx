import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './RangeSlider.module.css';

export type RangeSliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'type' | 'value' | 'min' | 'max' | 'onChange'
> & {
  id?: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  /** Turns the number into the visible and spoken value, for example "$6,000". */
  formatValue: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
};

export function RangeSlider({
  id: idProp,
  label,
  min,
  max,
  value,
  onChange,
  formatValue,
  minLabel,
  maxLabel,
  ...rest
}: RangeSliderProps): ReactNode {
  const autoId = useId();
  const id = idProp ?? autoId;
  const shown = formatValue(value);
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <output htmlFor={id} className={styles.value}>
          {shown}
        </output>
      </div>
      <input
        {...rest}
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        aria-valuetext={shown}
        className={styles.range}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
      {minLabel || maxLabel ? (
        <div className={styles.ends}>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
