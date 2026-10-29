import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WaveDivider } from './WaveDivider';

const meta = {
  title: 'shell/WaveDivider',
  component: WaveDivider,
  args: { from: 'card', to: 'page' },
} satisfies Meta<typeof WaveDivider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CardToPage: Story = {};
export const PageToWarm: Story = { args: { from: 'page', to: 'warm' } };
export const WarmToCard: Story = { args: { from: 'warm', to: 'card' } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
