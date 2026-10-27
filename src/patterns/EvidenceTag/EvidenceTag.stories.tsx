import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { evidenceTags } from '@/domain/types';
import { EvidenceTag } from './EvidenceTag';

const meta = {
  title: 'patterns/EvidenceTag',
  component: EvidenceTag,
  args: { tag: 'verified', label: en.evidenceTags.verified },
} satisfies Meta<typeof EvidenceTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Verified: Story = {};
export const InstitutionReported: Story = {
  args: { tag: 'institution-reported', label: en.evidenceTags['institution-reported'] },
};
export const Estimate: Story = { args: { tag: 'estimate', label: en.evidenceTags.estimate } };
export const Judgement: Story = { args: { tag: 'judgement', label: en.evidenceTags.judgement } };
export const Unknown: Story = { args: { tag: 'unknown', label: en.evidenceTags.unknown } };
export const AllFive: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
        padding: 'var(--space-6)',
      }}
    >
      {evidenceTags.map((t) => (
        <EvidenceTag key={t} tag={t} label={en.evidenceTags[t]} />
      ))}
    </div>
  ),
};
