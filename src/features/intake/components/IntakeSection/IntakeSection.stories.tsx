import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { domainConfig } from '@/domain/config';
import type { SectionId } from '@/domain/types';
import { allNotSure, partlyAnswered } from '../../fixtures';
import {
  answerQuestion,
  confirmEvidence,
  emptyIntakeState,
  questionsInSection,
  sectionProgress,
  toggleNotSure,
} from '../../state';
import type { IntakeState } from '../../state';
import { IntakeSection } from './IntakeSection';

const section: SectionId = 'A';
const questions = questionsInSection(domainConfig.questions, section);

const stateOf = (stored: {
  answers: IntakeState['answers'];
  confirmedTagIds: IntakeState['confirmedTagIds'];
}): IntakeState => ({
  answers: stored.answers,
  confirmedTagIds: stored.confirmedTagIds,
  sectionIndex: 0,
});

const meta = {
  title: 'features/intake/IntakeSection',
  component: IntakeSection,
  parameters: { layout: 'fullscreen' },
  args: {
    progress: sectionProgress(emptyIntakeState, domainConfig.questions)[0]!,
    questions,
    state: emptyIntakeState,
    onAnswer: () => undefined,
    onNotSure: () => undefined,
    onEvidence: () => undefined,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IntakeSection>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

const answered = stateOf(partlyAnswered);
const answeredArgs = {
  state: answered,
  progress: sectionProgress(answered, domainConfig.questions)[0]!,
};
const notSure = stateOf(allNotSure);
const notSureArgs = {
  state: notSure,
  progress: sectionProgress(notSure, domainConfig.questions)[0]!,
};

export const EmptyDesktop: Story = { globals: desktop };
export const EmptyMobile: Story = { globals: mobile };

/** Section complete: every answer has its tag picked. */
export const CompleteDesktop: Story = { args: answeredArgs, globals: desktop };
export const CompleteMobile: Story = { args: answeredArgs, globals: mobile };

/** Answers carry the stand-in default tag, so each card still asks "Pick one tag". */
export const TagNotConfirmedDesktop: Story = {
  args: (() => {
    const state = questions.reduce(
      (s, q) => (q.type === 'toggle' ? answerQuestion(s, q.id, true, domainConfig) : s),
      emptyIntakeState,
    );
    return { state, progress: sectionProgress(state, domainConfig.questions)[0]! };
  })(),
  globals: desktop,
};

export const AllNotSureDesktop: Story = { args: notSureArgs, globals: desktop };
export const AllNotSureMobile: Story = { args: notSureArgs, globals: mobile };

function InteractiveSection(args: ComponentProps<typeof IntakeSection>): ReactNode {
  const [state, setState] = useState<IntakeState>(emptyIntakeState);
  return (
    <IntakeSection
      {...args}
      state={state}
      progress={sectionProgress(state, domainConfig.questions)[0]!}
      onAnswer={(id, value) => setState((s) => answerQuestion(s, id, value, domainConfig))}
      onNotSure={(id) => setState((s) => toggleNotSure(s, id))}
      onEvidence={(id, tag) => setState((s) => confirmEvidence(s, id, tag, domainConfig))}
    />
  );
}

/** Fully working: answer, mark Not sure and pick tags. */
export const Interactive: Story = {
  globals: desktop,
  render: (args) => <InteractiveSection {...args} />,
};
