import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/ui';
import type { AccountsRuntime } from '../../runtime';
import { createMemoryRuntime } from '../../memory-runtime';
import { signedInRuntime } from '../../test-helpers';
import { AccountAuditFlow } from './AccountAuditFlow';

const meta = {
  title: 'features/accounts/AccountAuditFlow',
  component: AccountAuditFlow,
  parameters: { layout: 'fullscreen' },
  args: {
    signInHref: '#sign-in',
    phaseHref: (phase) => `#${phase}`,
    onPhaseChange: () => undefined,
    reportHref: '#report',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ padding: 'var(--space-6)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof AccountAuditFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

function SignedInDemo(args: React.ComponentProps<typeof AccountAuditFlow>): React.ReactNode {
  const [runtime, setRuntime] = useState<AccountsRuntime>();
  useEffect(() => {
    void signedInRuntime().then(setRuntime);
  }, []);
  return runtime ? <AccountAuditFlow {...args} runtime={runtime} /> : null;
}

/** Signed in: the first Quick Start question. */
export const SignedIn: Story = { render: (args) => <SignedInDemo {...args} /> };

/** Not signed in: the waiting skeleton shows while the person is sent to sign in. */
export const SignedOut: Story = {
  render: (args) => <AccountAuditFlow {...args} runtime={createMemoryRuntime()} />,
};
