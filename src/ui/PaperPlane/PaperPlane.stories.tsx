import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button';
import { PaperPlane } from './PaperPlane';
import { PaperPlaneProvider } from './PaperPlaneProvider';

const meta = {
  title: 'ui/PaperPlane',
  component: PaperPlane,
} satisfies Meta<typeof PaperPlane>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Still: Story = {
  render: () => (
    <div style={{ width: 120 }}>
      <PaperPlane />
    </div>
  ),
};

/** Press the button: the plane flies out of it, then the (stubbed) page opens. */
export const InFlight: Story = {
  render: () => (
    <PaperPlaneProvider navigate={(href) => console.info('open', href)}>
      <div style={{ padding: 'var(--space-9)' }}>
        <Button href="/quick-start" size="lg">
          Start the audit
        </Button>
      </div>
    </PaperPlaneProvider>
  ),
};
