import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FirstReadPage } from './FirstReadPage';

const meta = {
  title: 'features/quick-start/FirstReadPage',
  component: FirstReadPage,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FirstReadPage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

export const LoadingDesktop: Story = { args: { previewState: 'loading' }, globals: desktop };
export const LoadingMobile: Story = { args: { previewState: 'loading' }, globals: mobile };

export const ErrorDesktop: Story = { args: { previewState: 'error' }, globals: desktop };
export const ErrorMobile: Story = { args: { previewState: 'error' }, globals: mobile };

export const NoAnswersDesktop: Story = { args: { previewState: 'empty' }, globals: desktop };
export const NoAnswersMobile: Story = { args: { previewState: 'empty' }, globals: mobile };
