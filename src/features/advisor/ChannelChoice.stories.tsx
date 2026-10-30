import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChannelChoice } from './ChannelChoice';

const meta = {
  title: 'features/advisor/ChannelChoice',
  component: ChannelChoice,
  args: { legend: 'How would you like to talk?', value: 'whatsapp', onChange: () => undefined },
  globals: { viewport: { value: 'desktop', isRotated: false } },
} satisfies Meta<typeof ChannelChoice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WhatsApp: Story = {};
export const Email: Story = { args: { value: 'email' } };
export const Call: Story = { args: { value: 'call' } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
