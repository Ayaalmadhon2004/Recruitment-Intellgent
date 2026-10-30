import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { KiteBob } from './KiteBob';

const meta = { title: 'ui/KiteBob', component: KiteBob } satisfies Meta<typeof KiteBob>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { label: 'Loading' } };
export const Decorative: Story = {};
