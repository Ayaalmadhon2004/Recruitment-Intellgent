import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { scored, scoredGauge } from '@/domain/scoring';
import { ScoreRing } from './ScoreRing';

const meta = {
  title: 'patterns/ScoreRing',
  component: ScoreRing,
  args: { caption: 'out of 100', ariaLabel: 'Score', result: scored(78, 'strong', 'high') },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreRing>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Strong: Story = {
  args: {
    result: scored(78, 'strong', 'high'),
    ariaLabel: 'Digital Visibility score 78 out of 100',
  },
};
export const Developing: Story = {
  args: { result: scored(68, 'developing', 'medium'), ariaLabel: 'Readiness score 68 out of 100' },
};
export const NeedsAttention: Story = {
  args: {
    result: scored(49, 'needs-attention', 'low'),
    ariaLabel: 'Trust Network score 49 out of 100',
  },
};
export const Gauge: Story = {
  args: {
    result: scoredGauge(7, 'medium'),
    caption: 'out of 10',
    ariaLabel: 'School Fit 7.0 out of 10',
  },
};
export const Small: Story = { args: { size: 92, caption: '' } };
export const Zero: Story = {
  args: { result: scored(0, 'needs-attention', 'low'), ariaLabel: 'Score 0 out of 100' },
};
