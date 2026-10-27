'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Tabs.module.css';

export type TabItem = {
  id: string;
  label: string;
  /** Short text shown on the tab, for example a score. */
  badge?: string;
  content: ReactNode;
};

export type TabsProps = {
  tabs: readonly TabItem[];
  /** Accessible name of the tab list. */
  label: string;
  orientation?: 'horizontal' | 'vertical';
  defaultTabId?: string;
  onChange?: (id: string) => void;
};

/** WAI-ARIA tabs with automatic activation: arrow keys, Home and End move and select. */
export function Tabs({
  tabs,
  label,
  orientation = 'horizontal',
  defaultTabId,
  onChange,
}: TabsProps): ReactNode {
  const base = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
    onChange?.(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const vertical = orientation === 'vertical';
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    let target: number | null = null;
    if (e.key === next) target = (index + 1) % tabs.length;
    else if (e.key === prev) target = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = tabs.length - 1;
    if (target === null) return;
    e.preventDefault();
    const item = tabs[target];
    if (item) select(item.id);
  };

  const active = tabs.find((t) => t.id === activeId);

  return (
    <div className={cx(styles.root, orientation === 'vertical' && styles.vertical)}>
      <div role="tablist" aria-label={label} aria-orientation={orientation} className={styles.list}>
        {tabs.map((t, i) => {
          const selected = t.id === activeId;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              role="tab"
              type="button"
              id={`${base}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              className={cx(styles.tab, selected && styles.selected)}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span>{t.label}</span>
              {t.badge ? <span className={styles.badge}>{t.badge}</span> : null}
            </button>
          );
        })}
      </div>
      {active ? (
        <div
          role="tabpanel"
          id={`${base}-panel-${active.id}`}
          aria-labelledby={`${base}-tab-${active.id}`}
          tabIndex={0}
          className={styles.panel}
        >
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
