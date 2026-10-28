import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TbcValue } from '@/patterns';
import { UnlockedDone } from './UnlockedDone';

const meta = {
  title: 'features/unlock/UnlockedDone',
  component: UnlockedDone,
  args: {
    option: <TbcValue value={null} placeholder="[UNLOCK PATH 1: TO BE CONFIRMED WITH CAPSTONE]" />,
    reportHref: '#report',
    pdfHref: '#pdf',
  },
} satisfies Meta<typeof UnlockedDone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
