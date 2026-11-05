import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { Button } from '@/ui';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'shell/ErrorState',
  component: ErrorState,
  args: {
    eyebrow: en.errorPages.error.eyebrow,
    title: en.errorPages.error.title,
    body: en.errorPages.error.body,
    children: (
      <>
        <Button>{en.errorPages.error.retry}</Button>
        <Button href="/" variant="outline">
          {en.errorPages.error.home}
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NotFound: Story = {
  args: {
    eyebrow: en.errorPages.notFound.eyebrow,
    title: en.errorPages.notFound.title,
    body: en.errorPages.notFound.body,
    children: <Button href="/">{en.errorPages.notFound.home}</Button>,
  },
};
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
