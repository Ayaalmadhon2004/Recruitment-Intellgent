import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DevUnlockNotice } from './DevUnlockNotice';

const meta = {
  title: 'features/unlock/DevUnlockNotice',
  component: DevUnlockNotice,
} satisfies Meta<typeof DevUnlockNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
