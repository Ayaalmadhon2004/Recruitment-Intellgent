import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { questionsConfig } from '@/domain/config';
import { IntakeOverview } from './IntakeOverview';

const total = questionsConfig.length;

const meta = {
  title: 'features/intake/IntakeOverview',
  component: IntakeOverview,
  parameters: { layout: 'fullscreen' },
  args: { handled: 0, total, unsure: 0, saveStatus: 'idle', onSaveNow: () => undefined },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IntakeOverview>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;
const partly = { handled: Math.round(total / 2), unsure: 3 } as const;

export const EmptyDesktop: Story = { globals: desktop };
export const EmptyMobile: Story = { globals: mobile };

export const SavingDesktop: Story = { args: { ...partly, saveStatus: 'saving' }, globals: desktop };
export const SavingMobile: Story = { args: { ...partly, saveStatus: 'saving' }, globals: mobile };

export const SavedResumedDesktop: Story = {
  args: { ...partly, saveStatus: 'saved', resumedSection: 'C' },
  globals: desktop,
};
export const SavedResumedMobile: Story = {
  args: { ...partly, saveStatus: 'saved', resumedSection: 'C' },
  globals: mobile,
};

export const AllCompleteDesktop: Story = {
  args: { handled: total, saveStatus: 'saved' },
  globals: desktop,
};
export const AllCompleteMobile: Story = {
  args: { handled: total, saveStatus: 'saved' },
  globals: mobile,
};

/** The saved audit was made under an older config version. */
export const VersionNoticeDesktop: Story = {
  args: { ...partly, saveStatus: 'saved', resumedSection: 'C', versionChanged: true },
  globals: desktop,
};
export const VersionNoticeMobile: Story = {
  args: { ...partly, saveStatus: 'saved', resumedSection: 'C', versionChanged: true },
  globals: mobile,
};
