import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createMemoryRuntime } from '../../memory-runtime';
import { SignInPage } from './SignInPage';

const meta = {
  title: 'features/accounts/SignInPage',
  component: SignInPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SignInPage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** A new memory runtime each render, so stories do not touch browser storage or leak into one another. */
const render: Story['render'] = (args) => <SignInPage {...args} runtime={createMemoryRuntime()} />;

export const EnterEmailDesktop: Story = { render, globals: desktop };
export const EnterEmailMobile: Story = { render, globals: mobile };

/** The email does not look right: message under the field, button reads "Try again". */
export const InvalidEmailDesktop: Story = {
  render,
  args: { initialProblem: 'invalid', initialEmail: 'admissions@northbridge' },
  globals: desktop,
};
export const InvalidEmailMobile: Story = {
  render,
  args: { initialProblem: 'invalid', initialEmail: 'admissions@northbridge' },
  globals: mobile,
};

/** The service could not send the link. */
export const ServiceUnavailableDesktop: Story = {
  render,
  args: { initialProblem: 'unavailable', initialEmail: 'admissions@northbridge.example' },
  globals: desktop,
};

/** Link sent. The link lifetime is not confirmed, so it shows the placeholder. */
export const LinkSentDesktop: Story = {
  render,
  args: { initialStep: 'sent', initialEmail: 'admissions@northbridge.example' },
  globals: desktop,
};
export const LinkSentMobile: Story = {
  render,
  args: { initialStep: 'sent', initialEmail: 'admissions@northbridge.example' },
  globals: mobile,
};
