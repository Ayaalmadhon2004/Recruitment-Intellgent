import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button';
import { ToastProvider, useToast } from './Toast';
import type { ToastStatus } from './Toast';

function Trigger({ status }: { status: ToastStatus }) {
  const toast = useToast();
  return (
    <Button onClick={() => toast.show({ message: 'Your answers were saved.', status })}>
      Show {status} toast
    </Button>
  );
}

const meta = {
  title: 'ui/Toast',
  decorators: [(Story) => <ToastProvider>{Story()}</ToastProvider>],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { render: () => <Trigger status="info" /> };
export const Success: Story = { render: () => <Trigger status="success" /> };
export const Error: Story = { render: () => <Trigger status="error" /> };
