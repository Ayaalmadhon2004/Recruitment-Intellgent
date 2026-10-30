import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { TbcValue } from '../TbcValue';
import { CtaBand } from './CtaBand';

const meta = {
  title: 'patterns/CtaBand',
  component: CtaBand,
  args: {
    title: 'Finish the audit to see every score.',
    body: '19 more questions. Your 5 answers are kept.',
    eyebrow: 'NEXT STEP',
    actions: [
      { label: 'Complete the full audit', href: '#' },
      { label: 'Sign in to save', href: '#', variant: 'inverse-outline' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CtaBand>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithTwoActions: Story = {};
export const Panel: Story = { args: { tone: 'panel' } };
export const Inline: Story = { args: { tone: 'inline', eyebrow: undefined } };
export const OneAction: Story = {
  args: { actions: [{ label: 'Open score detail', href: '#' }], eyebrow: undefined },
};
export const WithTbcNote: Story = {
  args: { note: <TbcValue value={null} placeholder={en.status.tbc} /> },
};
