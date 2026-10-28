import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/ui';
import { SectionPeek } from './SectionPeek';

const meta = {
  title: 'features/unlock/SectionPeek',
  component: SectionPeek,
  args: { unlocked: false, action: <Button>See unlock options</Button> },
} satisfies Meta<typeof SectionPeek>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Locked: Story = {};
export const Unlocked: Story = { args: { unlocked: true, action: undefined } };
/** Nothing to unlock yet. */
export const EmptyNoAudit: Story = {
  args: {
    note: 'An unlock opens the full report for your audit. Answer the Quick Start first, then come back.',
    action: <Button href="#quick-start">Start the Quick Start</Button>,
  },
};
