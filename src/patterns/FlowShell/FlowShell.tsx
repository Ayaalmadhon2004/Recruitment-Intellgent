'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button, Stepper } from '@/ui';
import styles from './FlowShell.module.css';

export type FlowStep = { id: string; label: string };

export type FlowShellLabels = {
  stepperLabel: string;
  stateLabels: { done: string; current: string; upcoming: string };
  back: string;
  next: string;
  /** Shown instead of "next" on the last step. */
  submit: string;
  /** Announced to screen readers when the step changes, for example "Step 2 of 3: Details". */
  announce: (position: number, total: number, label: string) => string;
  loading?: string;
};

export type FlowShellProps = {
  steps: readonly FlowStep[];
  /** Zero-based index of the current step. */
  current: number;
  /** The current step's content. */
  children: ReactNode;
  labels: FlowShellLabels;
  onBack: () => void;
  /** Called on "next", and on "submit" at the last step. */
  onNext: () => void;
  nextDisabled?: boolean;
  submitting?: boolean;
  /** When given, replaces the steps with the success state. */
  success?: ReactNode;
  /**
   * An extra last step that is only the success state, for example "Done". When given, the stepper
   * lists it after the real steps and, once `success` shows, keeps the stepper above the success state.
   */
  finalStep?: FlowStep;
};

/** Generic multi-step flow: steps, back and next, a success state. No knowledge of any feature. */
export function FlowShell({
  steps,
  current,
  children,
  labels,
  onBack,
  onNext,
  nextDisabled,
  submitting,
  success,
  finalStep,
}: FlowShellProps): ReactNode {
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const showingSuccess = success !== undefined;

  // Move focus to the new step or the success message, but not on first render.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    panel.current?.focus();
  }, [current, showingSuccess]);

  const last = current === steps.length - 1;
  const step = steps[current];

  const stepperSteps = finalStep ? [...steps, finalStep] : steps;
  const stepper = (
    <Stepper
      steps={stepperSteps}
      current={showingSuccess && finalStep ? steps.length : current}
      label={labels.stepperLabel}
      stateLabels={labels.stateLabels}
    />
  );

  if (showingSuccess) {
    return (
      <div className={styles.shell}>
        {finalStep ? stepper : null}
        <div ref={panel} tabIndex={-1} className={styles.panel}>
          {success}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {stepper}
      <p className="visually-hidden" aria-live="polite">
        {step ? labels.announce(current + 1, steps.length, step.label) : null}
      </p>
      <div ref={panel} tabIndex={-1} className={styles.panel}>
        {children}
      </div>
      <div className={styles.actions}>
        {current > 0 ? (
          <Button variant="secondary" onClick={onBack}>
            {labels.back}
          </Button>
        ) : (
          <span />
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          loading={submitting}
          loadingLabel={labels.loading}
        >
          {last ? labels.submit : labels.next}
        </Button>
      </div>
    </div>
  );
}
