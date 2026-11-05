import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Kite } from '../Kite';
import { KiteBob } from '../KiteBob';
import { useReducedMotion } from '../motion';
import { isInternalHref, usePaperPlane } from '../PaperPlane';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'inverse' | 'inverse-outline';
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
    /** What shows while loading: a bobbing kite (default) or a kite flying across the pill. */
    loadingKite?: 'bob' | 'fly';
  };

type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string };

export type ButtonProps = AsButton | AsLink;

export function Button(props: ButtonProps): ReactNode {
  const reduced = useReducedMotion();
  const flyTo = usePaperPlane();
  const { variant = 'primary', size = 'md', fullWidth, children, className } = props;
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    className,
  );

  if (props.href !== undefined) {
    const {
      variant: _v,
      size: _s,
      fullWidth: _f,
      children: _c,
      className: _cn,
      onClick,
      ...rest
    } = props;
    // A plain click on a link to another page of this site sends the paper plane first; modified
    // clicks, new-tab and download links keep their normal browser behaviour.
    const onLinkClick = (event: MouseEvent<HTMLAnchorElement>): void => {
      onClick?.(event);
      const plain =
        event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
      const here = rest.target === undefined || rest.target === '_self';
      if (!flyTo || !plain || !here || rest.download !== undefined) return;
      if (event.defaultPrevented || !isInternalHref(props.href)) return;
      event.preventDefault();
      flyTo(props.href, event.currentTarget);
    };
    return (
      <a {...rest} className={classes} onClick={onLinkClick}>
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
    loadingKite = 'bob',
    disabled,
    type = 'button',
    ...rest
  } = props;
  const fly = loadingKite === 'fly' && !reduced;
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && !fly ? <KiteBob /> : null}
      {loading && fly ? (
        <span className={styles.flyTrack} aria-hidden="true">
          <span className="anim-fly">
            <Kite size="sm" wings="open" />
          </span>
        </span>
      ) : null}
      {children}
      {loading && loadingLabel ? <span className="visually-hidden">{loadingLabel}</span> : null}
    </button>
  );
}
