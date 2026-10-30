import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CONFIG_VERSION, questionsConfig } from '@/domain/config';
import type { Answer } from '@/domain/types';
import { ToastProvider } from '@/ui';
import { createMemoryStore } from '../../store';
import type { StoredAudit } from '../../store';
import { AuditFlow } from './AuditFlow';

const meta = {
  title: 'features/intake/AuditFlow',
  component: AuditFlow,
  parameters: { layout: 'fullscreen' },
  args: {
    store: createMemoryStore(null),
    onPhaseChange: () => undefined,
    phaseHref: (phase) => `#${phase}`,
    reportHref: '#report',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ padding: 'var(--space-6)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof AuditFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

const notSure = (quickStart: boolean): Answer[] =>
  questionsConfig
    .filter((q) => q.quickStart === quickStart)
    .map((q): Answer => ({ kind: 'unknown', questionId: q.id }));

const saved = (answers: Answer[], sectionIndex = 0): StoredAudit => ({
  configVersion: CONFIG_VERSION,
  answers,
  confirmedTagIds: [],
  sectionIndex,
});

/** A fresh store each render, so stories do not leak into one another. */
const withSaved = (
  stored: StoredAudit | null,
  phase?: 'questions' | 'read' | 'sections',
): Story['render'] =>
  function Render(args) {
    return <AuditFlow {...args} phase={phase} store={createMemoryStore(stored)} />;
  };

const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** Question 1 of the Quick Start questions, nothing answered yet. */
export const FirstQuestion: Story = { render: withSaved(null) };
export const FirstQuestionMobile: Story = {
  render: withSaved(null),
  parameters: { viewport: mobile.viewport },
};
/** Quick Start questions marked Not sure, the remaining sections open. */
export const Sections: Story = { render: withSaved(saved(notSure(true)), 'sections') };
export const SectionsMobile: Story = {
  render: withSaved(saved(notSure(true)), 'sections'),
  parameters: { viewport: mobile.viewport },
};
/** Resumes in the sections when later answers exist. */
export const Resumed: Story = {
  render: withSaved(saved([...notSure(true), ...notSure(false).slice(0, 2)], 2)),
};
