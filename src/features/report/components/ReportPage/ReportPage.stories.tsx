import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { realCaseModel } from '../test-models';
import { ReportPage } from './ReportPage';

const meta = {
  title: 'features/report/ReportPage',
  component: ReportPage,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportPage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

export const LoadingDesktop: Story = { args: { previewState: 'loading' }, globals: desktop };
export const LoadingMobile: Story = { args: { previewState: 'loading' }, globals: mobile };

export const ErrorDesktop: Story = { args: { previewState: 'error' }, globals: desktop };
export const ErrorMobile: Story = { args: { previewState: 'error' }, globals: mobile };

export const EmptyDesktop: Story = { args: { previewState: 'empty' }, globals: desktop };
export const EmptyMobile: Story = { args: { previewState: 'empty' }, globals: mobile };

/** What the server returns today: a stage and six areas that cannot be scored yet. */
export const ReadyDesktop: Story = { args: { previewModel: realCaseModel() }, globals: desktop };
export const ReadyMobile: Story = { args: { previewModel: realCaseModel() }, globals: mobile };

export const VersionNoticeDesktop: Story = {
  args: { previewModel: { ...realCaseModel(), configVersionMismatch: true } },
  globals: desktop,
};
