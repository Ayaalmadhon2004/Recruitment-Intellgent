import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FreeVsFull } from './FreeVsFull';

const meta = {
  title: 'features/unlock/FreeVsFull',
  component: FreeVsFull,
  args: { unlocked: false },
} satisfies Meta<typeof FreeVsFull>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Locked: Story = {};
export const Unlocked: Story = { args: { unlocked: true } };
