import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DevAccountsNotice } from './DevAccountsNotice';

const meta = {
  title: 'features/accounts/DevAccountsNotice',
  component: DevAccountsNotice,
} satisfies Meta<typeof DevAccountsNotice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
