import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LockedArea } from './LockedArea';

const meta = {
  title: 'features/report/LockedArea',
  component: LockedArea,
  args: { name: 'Trust Network', unlockHref: '#unlock' },
} satisfies Meta<typeof LockedArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithUnlockLink: Story = {};
/** Print: the lock and the word, no button. */
export const PrintNoLink: Story = { args: { unlockHref: undefined } };
