import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '../internal/cx';
import { describedBy, FieldShell } from './FieldShell';
import styles from './Field.module.css';

type Shared = {
  label: string;
  hint?: string;
  error?: string;
  /** Extra class on the hint text. */
  hintClassName?: string;
  /** Marks the field invalid (red border, aria-invalid) when the message is shown elsewhere, for example in a banner. */
  invalid?: boolean;
};

export type FieldProps =
  | (Shared &
      Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { multiline?: false; id?: string })
  | (Shared &
      Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & { multiline: true; id?: string });

export function Field(props: FieldProps): ReactNode {
  const autoId = useId();
  const id = props.id ?? autoId;
  const { label, hint, error, invalid, hintClassName } = props;

  if (props.multiline) {
    const { label: _l, hint: _h, error: _e, invalid: _v, hintClassName: _c, multiline: _m, id: _i, className, ...rest } = props;
    return (
      <FieldShell id={id} label={label} hint={hint} error={error} hintClassName={hintClassName}>
        <textarea
          {...rest}
          id={id}
          rows={rest.rows ?? 4}
          className={cx(styles.control, className)}
          aria-invalid={error || invalid ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
        />
      </FieldShell>
    );
  }

  const { label: _l, hint: _h, error: _e, invalid: _v, hintClassName: _c, multiline: _m, id: _i, className, ...rest } = props;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} hintClassName={hintClassName}>
      <input
        {...rest}
        id={id}
        className={cx(styles.control, className)}
        aria-invalid={error || invalid ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
      />
    </FieldShell>
  );
}
