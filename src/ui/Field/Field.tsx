import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '../internal/cx';
import { describedBy, FieldShell } from './FieldShell';
import styles from './Field.module.css';

type Shared = { label: string; hint?: string; error?: string };

export type FieldProps =
  | (Shared &
      Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { multiline?: false; id?: string })
  | (Shared &
      Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & { multiline: true; id?: string });

export function Field(props: FieldProps): ReactNode {
  const autoId = useId();
  const id = props.id ?? autoId;
  const { label, hint, error } = props;

  if (props.multiline) {
    const { label: _l, hint: _h, error: _e, multiline: _m, id: _i, className, ...rest } = props;
    return (
      <FieldShell id={id} label={label} hint={hint} error={error}>
        <textarea
          {...rest}
          id={id}
          rows={rest.rows ?? 4}
          className={cx(styles.control, className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
        />
      </FieldShell>
    );
  }

  const { label: _l, hint: _h, error: _e, multiline: _m, id: _i, className, ...rest } = props;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        {...rest}
        id={id}
        className={cx(styles.control, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
      />
    </FieldShell>
  );
}
