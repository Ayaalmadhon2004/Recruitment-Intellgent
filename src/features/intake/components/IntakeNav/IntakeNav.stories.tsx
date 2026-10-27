import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IntakeNav } from './IntakeNav';

const meta = {
  title: 'features/intake/IntakeNav',
  component: IntakeNav,
  parameters: { layout: 'fullscreen' },
  args: { next: 'B', onPrevious: () => undefined, onNext: () => undefined, reportHref: '#report' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IntakeNav>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

export const FirstSectionDesktop: Story = { globals: desktop };
export const FirstSectionMobile: Story = { globals: mobile };
export const MiddleSectionDesktop: Story = { args: { previous: 'B', next: 'D' }, globals: desktop };
export const MiddleSectionMobile: Story = { args: { previous: 'B', next: 'D' }, globals: mobile };
export const LastSectionDesktop: Story = {
  args: { previous: 'E', next: undefined },
  globals: desktop,
};
export const LastSectionMobile: Story = {
  args: { previous: 'E', next: undefined },
  globals: mobile,
};
