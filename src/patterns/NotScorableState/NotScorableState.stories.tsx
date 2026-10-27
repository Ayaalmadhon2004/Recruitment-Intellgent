import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { notScorable } from '@/domain/scoring';
import { notScorableLabels, questionText } from '@/fixtures/labels';
import { NotScorableState } from './NotScorableState';

const meta = {
  title: 'patterns/NotScorableState',
  component: NotScorableState,
  args: { labels: notScorableLabels, result: notScorable('no-formula', []) },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotScorableState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoFormula: Story = {};
export const MissingAnswers: Story = {
  args: { result: notScorable('missing-answers', ['E1', 'E2', 'E3']), questionLabel: questionText },
};
export const MissingWithLinks: Story = {
  args: {
    result: notScorable('missing-answers', ['E1', 'E2']),
    questionLabel: questionText,
    questionHref: (id) => '#' + id,
  },
};
export const InvalidAnswer: Story = {
  args: { result: notScorable('invalid-answer', ['B1']), questionLabel: questionText },
};
