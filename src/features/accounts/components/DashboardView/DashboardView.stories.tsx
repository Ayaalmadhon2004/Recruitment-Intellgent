import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { sampleAudits } from '../../fixtures';
import { DashboardView } from './DashboardView';

const meta = {
  title: 'features/accounts/DashboardView',
  component: DashboardView,
  parameters: { layout: 'fullscreen' },
  args: {
    email: 'admissions@northbridge.example',
    total: 24,
    audits: sampleAudits,
    onOpen: () => undefined,
    onStartNew: () => undefined,
    onSignOut: () => undefined,
    development: true,
  },
} satisfies Meta<typeof DashboardView>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** Three sample audits: in progress, older config version, complete with a stage that is not scorable. */
export const WithAuditsDesktop: Story = { globals: desktop };
export const WithAuditsMobile: Story = { globals: mobile };

/** "No audits yet". */
export const EmptyDesktop: Story = { args: { audits: [] }, globals: desktop };
export const EmptyMobile: Story = { args: { audits: [] }, globals: mobile };

/** One card is being opened: its buttons wait. */
export const OpeningAnAudit: Story = { args: { openingId: 'sample-1' }, globals: desktop };

/** Opening an audit failed. */
export const OpenFailed: Story = { args: { failedId: 'sample-2' }, globals: desktop };

export const SignOutFailed: Story = { args: { signOutFailed: true }, globals: desktop };
