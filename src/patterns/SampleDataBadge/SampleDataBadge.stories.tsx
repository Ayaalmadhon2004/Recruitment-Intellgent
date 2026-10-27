import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { SampleDataBadge } from './SampleDataBadge';

const meta = {
  title: 'patterns/SampleDataBadge',
  component: SampleDataBadge,
  args: { label: en.status.sample },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SampleDataBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
