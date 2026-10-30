import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SaveDot } from './SaveDot';

const meta = { title: 'ui/SaveDot', component: SaveDot } satisfies Meta<typeof SaveDot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = { args: { status: 'idle', label: 'Nothing to save yet' } };
export const Saving: Story = { args: { status: 'saving', label: 'Saving' } };
export const Saved: Story = { args: { status: 'saved', label: 'Saved on this device' } };
