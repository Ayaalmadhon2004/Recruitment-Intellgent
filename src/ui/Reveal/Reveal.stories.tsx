import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Reveal } from './Reveal';

const meta = { title: 'ui/Reveal', component: Reveal } satisfies Meta<typeof Reveal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InView: Story = {
  args: {
    children: (
      <p style={{ padding: 'var(--space-6)' }}>
        Fades up once when it enters the viewport. No animation under reduced motion.
      </p>
    ),
  },
};
export const Staggered: Story = {
  args: { index: 3, children: <p style={{ padding: 'var(--space-6)' }}>Fourth in a stagger.</p> },
};
