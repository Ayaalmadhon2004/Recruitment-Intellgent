import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FlowShell } from './FlowShell';
import type { FlowShellLabels } from './FlowShell';

const steps = [
  { id: 'a', label: 'Choose a channel' },
  { id: 'b', label: 'A few details' },
];
const labels: FlowShellLabels = {
  stepperLabel: 'Steps',
  stateLabels: { done: 'Complete', current: 'Now', upcoming: 'Next' },
  back: 'Back',
  next: 'Continue',
  submit: 'Send request',
  announce: (n, total, label) => `Step ${n} of ${total}: ${label}`,
  loading: 'Sending',
};

function Harness({ onSubmit = () => {} }: { onSubmit?: () => void }): React.ReactNode {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  return (
    <FlowShell
      steps={steps}
      current={current}
      labels={labels}
      onBack={() => setCurrent((c) => c - 1)}
      onNext={() => {
        if (current === steps.length - 1) {
          onSubmit();
          setDone(true);
        } else setCurrent((c) => c + 1);
      }}
      success={done ? <p>Thank you</p> : undefined}
    >
      <p>Content of step {current + 1}</p>
    </FlowShell>
  );
}

describe('FlowShell', () => {
  it('shows the first step with no back button', () => {
    render(<Harness />);
    expect(screen.getByText('Content of step 1')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Choose a channel');
  });

  it('goes forward and back and swaps the label to submit on the last step', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Content of step 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send request' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Content of step 1')).toBeInTheDocument();
  });

  it('announces each step to screen readers', async () => {
    render(<Harness />);
    expect(screen.getByText('Step 1 of 2: Choose a channel')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Step 2 of 2: A few details')).toBeInTheDocument();
  });

  it('moves focus to the new step but not on first render', async () => {
    render(<Harness />);
    expect(document.body).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Content of step 2').parentElement).toHaveFocus();
  });

  it('submits on the last step and shows the success state with focus on it', async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Thank you').parentElement).toHaveFocus();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('can disable next and show loading while submitting', () => {
    render(
      <FlowShell
        steps={steps}
        current={1}
        labels={labels}
        onBack={() => {}}
        onNext={() => {}}
        nextDisabled
        submitting
      >
        x
      </FlowShell>,
    );
    const send = screen.getByRole('button', { name: /Send request/ });
    expect(send).toBeDisabled();
    expect(send).toHaveAttribute('aria-busy', 'true');
  });

  it('is keyboard operable end to end', async () => {
    render(<Harness />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Content of step 2')).toBeInTheDocument();
  });

  it('lists a final step and keeps the stepper on the success state', async () => {
    render(
      <FlowShell
        steps={steps}
        current={1}
        labels={labels}
        onBack={() => {}}
        onNext={() => {}}
        finalStep={{ id: 'z', label: 'Done' }}
        success={<p>Thank you</p>}
      >
        x
      </FlowShell>,
    );
    const list = screen.getByRole('list', { name: 'Steps' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(within(list).getByRole('listitem', { current: 'step' })).toHaveTextContent('Done');
    expect(screen.getByText('Thank you')).toBeInTheDocument();
  });
});
