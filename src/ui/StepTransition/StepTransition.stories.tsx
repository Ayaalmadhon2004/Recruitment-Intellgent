import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Button } from '../Button';
import { StepTransition } from './StepTransition';

const meta = { title: 'ui/StepTransition', component: StepTransition } satisfies Meta<
  typeof StepTransition
>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo(): ReactElement {
  const [n, setN] = useState(1);
  const [dir, setDir] = useState<'forward' | 'back'>('forward');
  return (
    <div>
      <StepTransition stepKey={n} direction={dir}>
        <p style={{ padding: 'var(--space-6)' }}>Question {n}</p>
      </StepTransition>
      <Button
        variant="outline"
        onClick={() => {
          setDir('back');
          setN(Math.max(1, n - 1));
        }}
      >
        Back
      </Button>{' '}
      <Button
        onClick={() => {
          setDir('forward');
          setN(n + 1);
        }}
      >
        Next
      </Button>
    </div>
  );
}

export const ForwardAndBack: Story = {
  args: { stepKey: 1, children: null },
  render: () => <Demo />,
};
