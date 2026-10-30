import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Kite } from './Kite';

const meta = { title: 'ui/Kite', component: Kite } satisfies Meta<typeof Kite>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = { args: { wings: 'open', size: 'lg' } };
export const Closed: Story = { args: { wings: 'closed', size: 'lg' } };
export const LeftWing: Story = { args: { wings: 'left', size: 'lg' } };
export const RightWing: Story = { args: { wings: 'right', size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
export const Labelled: Story = { args: { title: 'Paper kite', size: 'md' } };
