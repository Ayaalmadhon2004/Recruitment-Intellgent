import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyAudits } from './EmptyAudits';

const meta = {
  title: 'features/accounts/EmptyAudits',
  component: EmptyAudits,
  args: { total: 24, onStart: () => undefined },
} satisfies Meta<typeof EmptyAudits>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
