import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/ui';
import { PageMessage } from './PageMessage';

const meta = {
  title: 'shell/PageMessage',
  component: PageMessage,
  args: {
    title: 'We could not find that page',
    body: 'The link may be old or mistyped.',
    children: <Button href="/">Back to the home page</Button>,
  },
} satisfies Meta<typeof PageMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {};
export const Failure: Story = { args: { alert: true, title: 'Something went wrong on this page' } };
