import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WhenToTalk } from './WhenToTalk';

const meta = {
  title: 'features/advisor/WhenToTalk',
  component: WhenToTalk,
  globals: { viewport: { value: 'desktop', isRotated: false } },
} satisfies Meta<typeof WhenToTalk>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const ClosedMobile: Story = {
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
