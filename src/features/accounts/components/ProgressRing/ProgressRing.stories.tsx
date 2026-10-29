import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressRing } from './ProgressRing';

const meta = {
  title: 'features/accounts/ProgressRing',
  component: ProgressRing,
  args: { percent: 70, tone: 'navy', ariaLabel: 'Sample audit 70 percent complete' },
} satisfies Meta<typeof ProgressRing>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {};
export const Empty: Story = { args: { percent: 0, ariaLabel: 'Sample audit 0 percent complete' } };
export const Complete: Story = {
  args: { percent: 100, tone: 'strong', ariaLabel: 'Sample audit 100 percent complete' },
};
