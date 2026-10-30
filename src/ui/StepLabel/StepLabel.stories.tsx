import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { StepLabel } from './StepLabel';

const meta = { title: 'ui/StepLabel', component: StepLabel, args: { current: 2 } } satisfies Meta<
  typeof StepLabel
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Step: Story = {};
export const Question: Story = { args: { word: 'Question', current: 3, total: 5 } };
function Demo() {
  const [n, setN] = useState(1);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
      <StepLabel current={n} total={5} />
      <Button size="sm" onClick={() => setN((v) => (v % 5) + 1)}>
        Next
      </Button>
    </div>
  );
}
export const Interactive: Story = { render: () => <Demo /> };
