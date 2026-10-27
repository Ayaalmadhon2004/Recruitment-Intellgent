import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Icon } from '../Icon';
import styles from './Stepper.module.css';

export type StepperStep = { id: string; label: string };

export type StepperProps = {
  steps: readonly StepperStep[];
  /** Zero-based index of the current step. */
  current: number;
  /** Words shown under each step so state is never colour alone. */
  stateLabels: { done: string; current: string; upcoming: string };
  /** Accessible name of the list. */
  label: string;
};

export function Stepper({ steps, current, stateLabels, label }: StepperProps): ReactNode {
  const fill =
    steps.length > 1 ? (Math.min(current, steps.length - 1) / (steps.length - 1)) * 100 : 0;
  return (
    <ol aria-label={label} className={styles.list} style={{ ['--steps' as string]: steps.length }}>
      <li aria-hidden="true" className={styles.track}>
        <span className={styles.fill} style={{ width: `${fill}%` }} />
      </li>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <li
            key={step.id}
            className={styles.step}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className={cx(styles.node, styles[state])}>
              {state === 'done' ? <Icon name="check" size={18} strokeWidth={2.8} /> : i + 1}
            </span>
            <span className={styles.label}>{step.label}</span>
            <span className={styles.state}>{stateLabels[state]}</span>
          </li>
        );
      })}
    </ol>
  );
}
