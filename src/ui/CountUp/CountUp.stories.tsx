import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CountUp } from './CountUp';

const meta = { title: 'ui/CountUp', component: CountUp } satisfies Meta<typeof CountUp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OnChange: Story = { args: { value: 72 } };
export const FromZeroWhenSeen: Story = { args: { value: 87, from: 0, duration: 800 } };
export const Currency: Story = {
  args: { value: 12400, format: (n: number) => `$${Math.round(n).toLocaleString('en-US')}` },
};
