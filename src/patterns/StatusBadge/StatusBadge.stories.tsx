import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { bandTone } from '../internal/tone';
import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'patterns/StatusBadge',
  component: StatusBadge,
  args: { tone: 'strong', label: 'Strong' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Strong: Story = { args: { tone: bandTone('strong'), label: en.bands.strong } };
export const Developing: Story = {
  args: { tone: bandTone('developing'), label: en.bands.developing },
};
export const NeedsAttention: Story = {
  args: { tone: bandTone('needs-attention'), label: en.bands['needs-attention'] },
};
export const Info: Story = { args: { tone: 'info', label: en.evidenceTags.unknown } };
