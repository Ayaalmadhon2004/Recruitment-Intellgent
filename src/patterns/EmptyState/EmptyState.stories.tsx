import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Kite } from '@/ui';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'patterns/EmptyState',
  component: EmptyState,
  args: {
    label: 'No saved audits',
    eyebrow: 'NOTHING SAVED YET',
    title: 'Your first audit starts here',
    body: 'Start whenever you like. Your answers save as you go.',
    visual: <Kite size="lg" />,
    children: (
      <>
        <Button>Start your first audit</Button>
        <Button variant="outline">Try the Quick Start</Button>
      </>
    ),
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WholePage: Story = { args: { headingLevel: 1, eyebrow: undefined } };
