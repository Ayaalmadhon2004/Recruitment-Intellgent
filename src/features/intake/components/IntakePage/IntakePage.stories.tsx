import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { allAnswered, allNotSure, olderVersion, partlyAnswered } from '../../fixtures';
import { createMemoryStore } from '../../store';
import type { StoredAudit } from '../../store';
import { IntakePage } from './IntakePage';

const meta = {
  title: 'features/intake/IntakePage',
  component: IntakePage,
  parameters: { layout: 'fullscreen' },
  args: { reportHref: '#report', exitHref: '#exit' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IntakePage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** A new store each time the story renders, so stories do not leak into one another. */
const withSaved = (stored: StoredAudit | null): Story['render'] =>
  function Render(args) {
    return <IntakePage {...args} store={createMemoryStore(stored)} />;
  };

export const EmptyDesktop: Story = { render: withSaved(null), globals: desktop };
export const EmptyMobile: Story = { render: withSaved(null), globals: mobile };

export const ResumedPartlyAnsweredDesktop: Story = {
  render: withSaved(partlyAnswered),
  globals: desktop,
};
export const ResumedPartlyAnsweredMobile: Story = {
  render: withSaved(partlyAnswered),
  globals: mobile,
};

export const AllCompleteDesktop: Story = { render: withSaved(allAnswered), globals: desktop };
export const AllCompleteMobile: Story = { render: withSaved(allAnswered), globals: mobile };

export const AllNotSureDesktop: Story = { render: withSaved(allNotSure), globals: desktop };

/** Saved under an older config version: answers are kept and a notice is shown. */
export const VersionMismatchDesktop: Story = { render: withSaved(olderVersion), globals: desktop };
export const VersionMismatchMobile: Story = { render: withSaved(olderVersion), globals: mobile };
