import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { AnswerValue, KnownEvidenceTag } from '@/domain/types';
import { questionCardLabels, sampleQuestions } from '@/fixtures/questionCard';
import { QuestionCard } from './QuestionCard';
import type { QuestionView } from './QuestionCard';

type DemoProps = {
  type: QuestionView['type'];
  initial?: AnswerValue;
  initialUnsure?: boolean;
  withEvidence?: boolean;
  initialEvidence?: KnownEvidenceTag;
};

function Demo({
  type,
  initial,
  initialUnsure = false,
  withEvidence = false,
  initialEvidence,
}: DemoProps): React.ReactNode {
  const [value, setValue] = useState<AnswerValue | undefined>(initial);
  const [unsure, setUnsure] = useState(initialUnsure);
  const [tag, setTag] = useState<KnownEvidenceTag | undefined>(initialEvidence);
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '900px' }}>
      <QuestionCard
        question={sampleQuestions[type]}
        value={value}
        unsure={unsure}
        onChange={(v) => {
          setValue(v);
          setUnsure(false);
        }}
        onUnsure={() => setUnsure((u) => !u)}
        evidence={withEvidence ? { value: tag, onChange: setTag } : undefined}
        labels={questionCardLabels}
      />
    </div>
  );
}

const SAMPLE_STUDENTS = 120;

const meta = {
  title: 'patterns/QuestionCard',
  component: QuestionCard,
} satisfies Meta<typeof QuestionCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const story = (props: DemoProps): Story => ({
  args: {} as Story['args'] & object,
  render: () => <Demo {...props} />,
});

export const SelectTodo = story({ type: 'select' });
export const SelectAnswered = story({ type: 'select', initial: 'private-university' });
export const SelectUnknown = story({ type: 'select', initialUnsure: true });
export const SelectWithEvidence = story({
  type: 'select',
  initial: 'private-university',
  withEvidence: true,
});

export const RadioTodo = story({ type: 'radio' });
export const RadioAnswered = story({ type: 'radio', initial: 'two' });
export const RadioUnknown = story({ type: 'radio', initialUnsure: true });
export const RadioWithEvidence = story({
  type: 'radio',
  initial: 'two',
  withEvidence: true,
  initialEvidence: 'estimate',
});

export const ChipsTodo = story({ type: 'chips' });
export const ChipsAnswered = story({ type: 'chips', initial: ['bachelor', 'master'] });
export const ChipsUnknown = story({ type: 'chips', initialUnsure: true });
export const ChipsWithEvidence = story({
  type: 'chips',
  initial: ['bachelor'],
  withEvidence: true,
});

export const NumberTodo = story({ type: 'number' });
export const NumberAnswered = story({ type: 'number', initial: SAMPLE_STUDENTS });
export const NumberUnknown = story({ type: 'number', initialUnsure: true });
export const NumberWithEvidence = story({
  type: 'number',
  initial: SAMPLE_STUDENTS,
  withEvidence: true,
  initialEvidence: 'institution-reported',
});

export const ToggleTodo = story({ type: 'toggle' });
export const ToggleAnswered = story({ type: 'toggle', initial: true });
export const ToggleUnknown = story({ type: 'toggle', initialUnsure: true });
export const ToggleWithEvidence = story({
  type: 'toggle',
  initial: false,
  withEvidence: true,
  initialEvidence: 'verified',
});
