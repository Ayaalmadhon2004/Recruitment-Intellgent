import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { sampleAudits } from '../../fixtures';
import { AuditCard } from './AuditCard';

const [inProgress, olderVersion, complete] = sampleAudits;
if (!inProgress || !olderVersion || !complete) throw new Error('sampleAudits changed');

const meta = {
  title: 'features/accounts/AuditCard',
  component: AuditCard,
  args: { audit: inProgress, onOpen: () => undefined },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380, padding: 'var(--space-4)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuditCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {};
export const Complete: Story = { args: { audit: complete } };
/** Saved under an earlier config version: answers are kept and a note says scores use the current one. */
export const OlderConfigVersion: Story = { args: { audit: olderVersion } };
export const StageNotScorable: Story = { args: { audit: complete } };
export const StageUnavailable: Story = {
  args: { audit: { ...inProgress, stage: { kind: 'unavailable' } } },
};
/** No institution name is stored yet. */
export const Untitled: Story = { args: { audit: { ...inProgress, name: null, sample: false } } };
export const Opening: Story = { args: { opening: true } };
export const OpenFailed: Story = { args: { failed: true } };
