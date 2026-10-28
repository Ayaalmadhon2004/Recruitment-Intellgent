import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Field } from '@/ui';
import { FlowShell } from './FlowShell';
import type { FlowShellLabels } from './FlowShell';

const steps = [
  { id: 'channel', label: 'Choose a channel' },
  { id: 'details', label: 'A few details' },
  { id: 'send', label: 'Send' },
];
const labels: FlowShellLabels = {
  stepperLabel: 'Request steps',
  stateLabels: { done: 'Complete', current: 'Now', upcoming: 'Next' },
  back: 'Back',
  next: 'Continue',
  submit: 'Send request',
  announce: (n, total, label) => `Step ${n} of ${total}: ${label}`,
  loading: 'Sending',
};

function Demo({
  start = 0,
  submitting = false,
  done = false,
  withFinalStep = false,
}: {
  start?: number;
  submitting?: boolean;
  done?: boolean;
  withFinalStep?: boolean;
}): React.ReactNode {
  const [current, setCurrent] = useState(start);
  const [finished, setFinished] = useState(done);
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 640 }}>
      <FlowShell
        steps={steps}
        current={current}
        labels={labels}
        submitting={submitting}
        finalStep={withFinalStep ? { id: 'done', label: 'Done' } : undefined}
        onBack={() => setCurrent((c) => Math.max(0, c - 1))}
        onNext={() => (current === steps.length - 1 ? setFinished(true) : setCurrent((c) => c + 1))}
        success={finished ? <h2>Request sent</h2> : undefined}
      >
        <Field label={`Field for step ${current + 1}`} />
      </FlowShell>
    </div>
  );
}

const meta = { title: 'patterns/FlowShell', component: FlowShell } satisfies Meta<typeof FlowShell>;
export default meta;
type Story = StoryObj<typeof FlowShell>;

export const FirstStep: Story = { render: () => <Demo /> };
export const MiddleStep: Story = { render: () => <Demo start={1} /> };
export const LastStep: Story = { render: () => <Demo start={2} /> };
export const Submitting: Story = { render: () => <Demo start={2} submitting /> };
export const Success: Story = { render: () => <Demo start={2} done /> };
/** The stepper lists a Done step and stays above the success state (the Unlock design). */
export const SuccessWithDoneStep: Story = { render: () => <Demo start={2} done withFinalStep /> };
