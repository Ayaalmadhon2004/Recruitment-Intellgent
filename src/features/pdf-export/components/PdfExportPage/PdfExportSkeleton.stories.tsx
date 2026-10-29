import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PdfExportSkeleton } from './PdfExportSkeleton';

const meta = {
  title: 'features/pdf-export/PdfExportSkeleton',
  component: PdfExportSkeleton,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PdfExportSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
