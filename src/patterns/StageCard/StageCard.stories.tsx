import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { stagesConfig } from '@/domain/config';
import { notScorable } from '@/domain/scoring';
import { rangeLabels, stageCardLabels } from '@/fixtures/labels';
import { StageCard } from './StageCard';

const meta = {
  title: 'patterns/StageCard',
  component: StageCard,
  args: {
    eyebrow: 'WHERE YOU ARE',
    stages: stagesConfig.stages,
    rangeLabels,
    labels: stageCardLabels,
    result: { kind: 'staged', stage: 'building' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StageCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Starting: Story = { args: { result: { kind: 'staged', stage: 'starting' } } };
export const Building: Story = {};
export const Established: Story = { args: { result: { kind: 'staged', stage: 'established' } } };
export const NotScorable: Story = { args: { result: notScorable('missing-answers', ['B1']) } };
