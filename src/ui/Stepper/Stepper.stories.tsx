import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stepper } from './Stepper';

const steps = [
  { id: 'choose', label: 'Choose' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'done', label: 'Done' },
];
const stateLabels = { done: 'Complete', current: 'Now', upcoming: 'Next' };
const meta = {
  title: 'ui/Stepper',
  component: Stepper,
  args: { steps, stateLabels, label: 'Unlock steps', current: 0 },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStep: Story = {};
export const MiddleStep: Story = { args: { current: 1 } };
export const AllDone: Story = { args: { current: 3 } };
export const FourSteps: Story = {
  args: { steps: [...steps, { id: 'extra', label: 'Extra' }], current: 2 },
};
