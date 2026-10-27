import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'inverse-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: undefined;
    loading?: boolean;
    /** Announced to assistive tech while loading. */
    loadingLabel?: string;
  };

type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string };

export type ButtonProps = AsButton | AsLink;

export function Button(props: ButtonProps): ReactNode {
  const { variant = 'primary', size = 'md', fullWidth, children, className } = props;
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    'hover-nudge',
    className,
  );

  if (props.href !== undefined) {
    const { variant: _v, size: _s, fullWidth: _f, children: _c, className: _cn, ...rest } = props;
    return (
      <a {...rest} className={classes}>
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    fullWidth: _f,
    children: _c,
    className: _cn,
    loading,
    loadingLabel,
    disabled,
    type = 'button',
    ...rest
  } = props;
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
      {loading && loadingLabel ? <span className="visually-hidden">{loadingLabel}</span> : null}
    </button>
  );
}
