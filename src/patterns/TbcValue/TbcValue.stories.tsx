import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { TbcValue } from './TbcValue';

const meta = {
  title: 'patterns/TbcValue',
  component: TbcValue,
  args: { placeholder: en.status.tbc },
} satisfies Meta<typeof TbcValue>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NotConfirmed: Story = { args: { value: null } };
export const Confirmed: Story = { args: { value: '+84 000 000 000' } };
export const ConfirmedNumberZero: Story = { args: { value: 0 } };
