import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { scoringConfig } from '@/domain/config';
import { PriceBandLine } from './PriceBandLine';

const meta = {
  title: 'features/cost-calc/PriceBandLine',
  component: PriceBandLine,
  args: { bands: scoringConfig.priceBands, current: '30-40k', net: 37000 },
} satisfies Meta<typeof PriceBandLine>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {};
export const LowestBand: Story = { args: { current: 'under-20k', net: 14000 } };
export const OpenTopEnd: Story = { args: { current: '50k-plus', net: 52000 } };
