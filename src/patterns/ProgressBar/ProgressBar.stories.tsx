import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'patterns/ProgressBar',
  component: ProgressBar,
  args: { value: 28, max: 40, label: 'Audit completeness', valueText: '28 of 40' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Navy: Story = { args: { tone: 'navy' } };
export const Complete: Story = {
  args: { value: 40, tone: 'strong', valueText: '40 of 40 - Complete' },
};
export const Empty: Story = { args: { value: 0, valueText: '0 of 40' } };
export const Large: Story = { args: { size: 'lg' } };
export const OnDark: Story = {
  render: (args) => (
    <div style={{ background: 'var(--color-navy-deep)', padding: 'var(--space-6)', maxWidth: 420 }}>
      <ProgressBar {...args} tone="inverse" />
    </div>
  ),
};
