import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AdvisorRequest } from './AdvisorRequest';
import { validateAdvisorRequest } from './validate';
import type { FieldErrors } from './validate';

const desktop = { viewport: { value: 'desktop', isRotated: false } };
const mobile = { viewport: { value: 'mobile', isRotated: false } };

const filled = {
  name: 'Linh Tran',
  institution: 'Northbridge University',
  contact: '+84 90 123 4567',
  message: 'We would like to talk about agent shortlists.',
};

const emptyErrors: FieldErrors = (() => {
  const r = validateAdvisorRequest({ channel: 'whatsapp', time: 'morning' });
  return r.ok ? {} : r.errors;
})();

const meta = {
  title: 'features/advisor/AdvisorRequest',
  component: AdvisorRequest,
  globals: desktop,
} satisfies Meta<typeof AdvisorRequest>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DefaultMobile: Story = { globals: mobile };

export const Step2: Story = { args: { initialStep: 1 } };
export const Step2Mobile: Story = { args: { initialStep: 1 }, globals: mobile };

export const ChannelEmail: Story = {
  args: { initialStep: 1, initialValues: { channel: 'email', contact: 'linh@example.edu' } },
};
export const ChannelEmailMobile: Story = { ...ChannelEmail, globals: mobile };

export const ChannelCall: Story = {
  args: { initialStep: 1, initialValues: { channel: 'call', time: 'evening' } },
};
export const ChannelCallMobile: Story = { ...ChannelCall, globals: mobile };

export const Errors: Story = { args: { initialStep: 1, initialErrors: emptyErrors } };
export const ErrorsMobile: Story = { ...Errors, globals: mobile };

export const Submitting: Story = {
  args: { initialStep: 1, initialValues: filled, initialStatus: 'submitting' },
};
export const SubmittingMobile: Story = { ...Submitting, globals: mobile };

export const Success: Story = {
  args: { initialStep: 1, initialValues: filled, initialStatus: 'success' },
};
export const SuccessMobile: Story = { ...Success, globals: mobile };

export const SuccessEmail: Story = {
  args: {
    initialStep: 1,
    initialValues: { ...filled, channel: 'email', time: 'afternoon' },
    initialStatus: 'success',
  },
};
