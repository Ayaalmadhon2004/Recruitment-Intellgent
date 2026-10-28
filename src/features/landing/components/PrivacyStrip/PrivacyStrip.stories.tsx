import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PrivacyStrip } from './PrivacyStrip';

const meta = {
  title: 'features/landing/PrivacyStrip',
  component: PrivacyStrip,
  args: { privacyPolicyUrl: null },
} satisfies Meta<typeof PrivacyStrip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TbcDesktop1440: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
};
export const TbcMobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
export const ConfirmedDesktop1440: Story = {
  args: { privacyPolicyUrl: '/privacy' },
  globals: { viewport: { value: 'desktop', isRotated: false } },
};
export const ConfirmedMobile390: Story = {
  args: { privacyPolicyUrl: '/privacy' },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
