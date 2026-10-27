import Image from 'next/image';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './PhotoBox.module.css';

type Base = {
  shape?: 'arch' | 'round' | 'rounded';
  width: number;
  height: number;
  className?: string;
};

export type PhotoBoxProps = Base &
  (
    | { src: string; alt: string; placeholder?: undefined }
    /** Labelled placeholder, for example "[PHOTO: advisor. To be supplied by Capstone]". */
    | { src?: undefined; placeholder: string; alt?: undefined }
  );

export function PhotoBox({
  shape = 'rounded',
  width,
  height,
  className,
  ...rest
}: PhotoBoxProps): ReactNode {
  const classes = cx(styles.box, styles[shape], className);
  const size = { width, height };

  if (rest.src !== undefined) {
    return (
      <div className={classes} style={size}>
        <Image src={rest.src} alt={rest.alt} fill sizes={`${width}px`} className={styles.image} />
      </div>
    );
  }

  return (
    <div
      className={cx(classes, styles.placeholder)}
      style={size}
      role="img"
      aria-label={rest.placeholder}
    >
      <span aria-hidden="true">{rest.placeholder}</span>
    </div>
  );
}
