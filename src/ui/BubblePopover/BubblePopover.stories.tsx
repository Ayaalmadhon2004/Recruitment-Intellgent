import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BubblePopover } from './BubblePopover';

const meta = {
  title: 'ui/BubblePopover',
  component: BubblePopover,
  args: { children: 'A short explanation that appears next to the question.' },
  decorators: [(Story) => <div style={{ padding: 'var(--space-9)' }}>{Story()}</div>],
} satisfies Meta<typeof BubblePopover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const WithLabel: Story = { args: { label: 'About this question' } };
