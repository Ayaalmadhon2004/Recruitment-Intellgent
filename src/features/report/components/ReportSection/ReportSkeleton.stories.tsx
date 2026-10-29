import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReportSkeleton } from './ReportSkeleton';

const meta = {
  title: 'features/report/ReportSkeleton',
  component: ReportSkeleton,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
