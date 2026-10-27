import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EvidenceHelp } from './EvidenceHelp';

const meta = {
  title: 'features/intake/EvidenceHelp',
  component: EvidenceHelp,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EvidenceHelp>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

export const ClosedDesktop: Story = { globals: desktop };
export const ClosedMobile: Story = { globals: mobile };
