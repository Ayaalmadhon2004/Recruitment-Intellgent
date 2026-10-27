import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { ConfidenceMeter } from './ConfidenceMeter';

const meta = {
  title: 'patterns/ConfidenceMeter',
  component: ConfidenceMeter,
  args: { level: 'high', label: en.confidence.label, levelLabel: en.confidence.high },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConfidenceMeter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = {};
export const Medium: Story = { args: { level: 'medium', levelLabel: en.confidence.medium } };
export const Low: Story = { args: { level: 'low', levelLabel: en.confidence.low } };
export const NoneYet: Story = { args: { level: 'none', levelLabel: en.confidence.none } };
