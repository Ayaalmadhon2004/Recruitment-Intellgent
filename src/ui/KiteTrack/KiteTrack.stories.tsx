import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { KiteTrack } from './KiteTrack';

const meta = {
  title: 'ui/KiteTrack',
  component: KiteTrack,
  args: { label: 'Audit sections', current: 'Programmes', previous: 'Profile', next: 'Pricing' },
  decorators: [
    (Story) => <div style={{ maxWidth: 560, padding: 'var(--space-6)' }}>{Story()}</div>,
  ],
} satisfies Meta<typeof KiteTrack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = { args: { progress: 0 } };
export const Halfway: Story = { args: { progress: 0.5 } };
export const Complete: Story = { args: { progress: 1 } };
export const FirstStop: Story = {
  args: { previous: undefined, current: 'Profile', next: 'Programmes' },
};
export const LastStop: Story = { args: { next: undefined, progress: 1 } };
