import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { realCaseModel } from '../test-models';
import { ScoreDetailPage } from './ScoreDetailPage';

const meta = {
  title: 'features/report/ScoreDetailPage',
  component: ScoreDetailPage,
  parameters: { layout: 'fullscreen' },
  args: { area: 'readiness', previewModel: realCaseModel() },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreDetailPage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

export const ReadinessDesktop: Story = { globals: desktop };
export const ReadinessMobile: Story = { globals: mobile };
export const AffordabilityDesktop: Story = { args: { area: 'affordability' }, globals: desktop };
