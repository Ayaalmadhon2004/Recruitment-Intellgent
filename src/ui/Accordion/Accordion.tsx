'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Icon } from '../Icon';
import styles from './Accordion.module.css';

export type AccordionItem = {
  id: string;
  title: string;
  /** Small line under the title, for example an effort estimate. */
  subtitle?: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: readonly AccordionItem[];
  /** Allow several panels open at once. Default is one at a time. */
  multiple?: boolean;
  defaultOpenIds?: readonly string[];
};

export function Accordion({
  items,
  multiple = false,
  defaultOpenIds = [],
}: AccordionProps): ReactNode {
  const base = useId();
  const [open, setOpen] = useState<readonly string[]>(defaultOpenIds);

  const toggle = (id: string): void => {
    setOpen((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      return multiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={styles.root}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const buttonId = `${base}-btn-${item.id}`;
        const panelId = `${base}-panel-${item.id}`;
        return (
          <div key={item.id} className={cx(styles.item, 'hover-lift')}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={styles.trigger}
              onClick={() => toggle(item.id)}
            >
              <span className={styles.heading}>
                <span className={styles.title}>{item.title}</span>
                {item.subtitle ? <span className={styles.subtitle}>{item.subtitle}</span> : null}
              </span>
              <span className={cx(styles.chevron, isOpen && styles.chevronOpen)}>
                <Icon name="chevron-down" size={20} strokeWidth={2.6} />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={styles.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
