import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { notScorable, scored } from '@/domain/scoring';
import { questionText, scoreCardLabels } from '@/fixtures/labels';
import { ScoreCard } from './ScoreCard';

const meta = {
  title: 'patterns/ScoreCard',
  component: ScoreCard,
  args: {
    name: 'Readiness',
    labels: scoreCardLabels,
    result: scored(68, 'developing', 'medium'),
    reason: 'Good start. Visa and offer steps need writing down.',
    evidence: 'institution-reported',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Strong: Story = {
  args: {
    name: 'Digital Visibility',
    result: scored(78, 'strong', 'high'),
    evidence: 'verified',
    reason: 'Fast replies support your enquiry funnel.',
  },
};
export const Developing: Story = {};
export const NeedsAttention: Story = {
  args: {
    name: 'Trust Network',
    result: scored(49, 'needs-attention', 'low'),
    evidence: 'judgement',
    reason: 'Few alumni references families can contact.',
  },
};
export const NotScorableNoFormula: Story = {
  args: { name: 'Competitiveness', result: notScorable('no-formula', []) },
};
export const NotScorableMissingAnswers: Story = {
  args: {
    name: 'Community Influence',
    result: notScorable('missing-answers', ['E1', 'E2']),
    questionLabel: questionText,
    questionHref: (id) => '#' + id,
  },
};
