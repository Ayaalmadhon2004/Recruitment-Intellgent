import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { nothingAnsweredResult, realCaseResult, threeScoredResult } from './fixtures';
import { FirstReadView } from './FirstReadView';

const meta = {
  title: 'features/quick-start/FirstReadView',
  component: FirstReadView,
  parameters: { layout: 'fullscreen' },
  args: {
    result: realCaseResult,
    changeAnswersHref: '#change',
    continueHref: '#continue',
    questionHref: (id) => `#question-${id}`,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FirstReadView>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** What the server returns today: a stage and six areas that cannot be scored yet. */
export const RealCaseDesktop: Story = { globals: desktop };
export const RealCaseMobile: Story = { globals: mobile };

export const NothingAnsweredDesktop: Story = {
  args: { result: nothingAnsweredResult },
  globals: desktop,
};
export const NothingAnsweredMobile: Story = {
  args: { result: nothingAnsweredResult },
  globals: mobile,
};

export const ThreeScoredDesktop: Story = {
  args: { result: threeScoredResult },
  globals: desktop,
};
export const ThreeScoredMobile: Story = {
  args: { result: threeScoredResult },
  globals: mobile,
};

export const SampleDataDesktop: Story = {
  args: { result: threeScoredResult, isSample: true },
  globals: desktop,
};
export const SampleDataMobile: Story = {
  args: { result: threeScoredResult, isSample: true },
  globals: mobile,
};

/** The audit is free: the route passes the link, so "Unlock full report" shows. Without it (unlocked) the action is absent. */
export const FreeAuditUnlockActionDesktop: Story = {
  args: { unlockHref: '#unlock' },
  globals: desktop,
};
export const FreeAuditUnlockActionMobile: Story = {
  args: { unlockHref: '#unlock' },
  globals: mobile,
};
