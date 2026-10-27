import type { ChangeEvent, ReactNode } from 'react';
import { en, fill } from '@/domain/copy';
import { Icon, Select, cx } from '@/ui';
import type { SectionProgress } from '../../state';
import styles from './SectionNav.module.css';

export type SectionNavProps = {
  sections: readonly SectionProgress[];
  /** Zero-based index of the section being shown. */
  current: number;
  onSelect: (index: number) => void;
};

const copy = en.intake;

const countText = (s: SectionProgress): string =>
  fill(copy.sectionCount, { done: s.handled, total: s.total });

/**
 * Six section cards with a progress bar each on wide screens, one select on phones. Both are in the
 * markup; CSS shows one. They drive the same `onSelect`.
 */
export function SectionNav({ sections, current, onSelect }: SectionNavProps): ReactNode {
  return (
    <nav aria-label={copy.sectionsLabel} className={styles.root}>
      <div role="group" aria-label={copy.sectionsGroup} className={styles.cards}>
        {sections.map((s, i) => {
          const isCurrent = i === current;
          const name = en.sections[s.id];
          const pct = s.total > 0 ? (s.handled / s.total) * 100 : 0;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isCurrent}
              aria-label={fill(copy.sectionAria, {
                key: s.id,
                name,
                done: s.handled,
                total: s.total,
              })}
              className={cx(styles.card, isCurrent && styles.current)}
              onClick={() => onSelect(i)}
            >
              <span className={styles.top}>
                <span className={cx(styles.dot, s.complete && styles.dotDone)} aria-hidden="true">
                  {s.complete ? <Icon name="check" size={18} strokeWidth={2.8} /> : s.id}
                </span>
                <span className={styles.name}>{name}</span>
              </span>
              <span className={styles.bar} aria-hidden="true">
                <span className={styles.fill} style={{ width: `${pct}%` }} />
              </span>
              <span className={styles.meta}>
                <span>{countText(s)}</span>
                {s.complete ? (
                  <span className={cx(styles.state, styles.stateDone)}>
                    <Icon name="check-circle" size={14} strokeWidth={2.6} />
                    {copy.stepStates.done}
                  </span>
                ) : null}
                {isCurrent ? (
                  <span className={styles.state}>
                    <Icon name="arrow-right" size={14} strokeWidth={2.6} />
                    {copy.stepStates.current}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.select}>
        <Select
          label={copy.sectionSelect}
          value={String(current)}
          options={sections.map((s, i) => ({
            value: String(i),
            label: fill(copy.sectionOption, {
              key: s.id,
              name: en.sections[s.id],
              done: s.handled,
              total: s.total,
            }),
          }))}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onSelect(Number(e.target.value))}
        />
      </div>
    </nav>
  );
}
