import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { cx } from '../internal/cx';
import { describedBy, FieldShell } from '../Field/FieldShell';
import fieldStyles from '../Field/Field.module.css';

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'children'> & {
  id?: string;
  label: string;
  options: readonly SelectOption[];
  /** Text of the empty first option. Omit for no empty option. */
  placeholder?: string;
  hint?: string;
  error?: string;
};

export function Select({
  id: idProp,
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  ...rest
}: SelectProps): ReactNode {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        {...rest}
        id={id}
        className={cx(fieldStyles.control, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
