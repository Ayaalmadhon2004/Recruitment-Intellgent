import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinkSent } from './LinkSent';

const meta = {
  title: 'features/accounts/LinkSent',
  component: LinkSent,
  args: {
    email: 'admissions@northbridge.example',
    remaining: 24,
    cooldown: 30,
    onResend: () => undefined,
    onChangeEmail: () => undefined,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, padding: 'var(--space-4)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkSent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {};
export const CanResend: Story = { args: { remaining: 0 } };
export const WithDevelopmentLink: Story = {
  args: { remaining: 0, development: { onOpen: () => undefined, opening: false, failed: false } },
};
export const DevelopmentLinkFailed: Story = {
  args: { remaining: 0, development: { onOpen: () => undefined, opening: false, failed: true } },
};
