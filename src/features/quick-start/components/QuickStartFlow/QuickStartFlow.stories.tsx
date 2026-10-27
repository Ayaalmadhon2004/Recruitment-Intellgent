import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Answer } from '@/domain/types';
import { QuickStartFlow } from './QuickStartFlow';

const known = (questionId: Answer['questionId'], value: string | number | boolean): Answer => ({
  kind: 'known',
  questionId,
  value,
  evidence: 'estimate',
  confidence: 'low',
});

/** Illustrative answers for story states only. Nothing is stored or scored here. */
const allAnswered: Answer[] = [
  known('A1', 'public-university'),
  known('B1', 9),
  known('C1', '30-40k'),
  known('D1', true),
  { kind: 'unknown', questionId: 'F1' },
];

const meta = {
  title: 'features/quick-start/QuickStartFlow',
  component: QuickStartFlow,
  parameters: { layout: 'fullscreen' },
  args: { initialAnswers: [] },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuickStartFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

export const FirstStepDesktop: Story = { globals: desktop };
export const FirstStepMobile: Story = { globals: mobile };

export const MiddleStepDesktop: Story = {
  args: { initialStep: 2, initialAnswers: allAnswered.slice(0, 3) },
  globals: desktop,
};
export const MiddleStepMobile: Story = {
  args: { initialStep: 2, initialAnswers: allAnswered.slice(0, 3) },
  globals: mobile,
};

export const LastStepDesktop: Story = {
  args: { initialStep: 4, initialAnswers: allAnswered },
  globals: desktop,
};
export const LastStepMobile: Story = {
  args: { initialStep: 4, initialAnswers: allAnswered },
  globals: mobile,
};

export const SubmittingDesktop: Story = {
  args: { initialStep: 4, initialAnswers: allAnswered, initialStatus: 'submitting' },
  globals: desktop,
};
export const SubmittingMobile: Story = {
  args: { initialStep: 4, initialAnswers: allAnswered, initialStatus: 'submitting' },
  globals: mobile,
};

export const ErrorDesktop: Story = {
  args: { initialStep: 4, initialAnswers: allAnswered, initialStatus: 'network' },
  globals: desktop,
};
export const ErrorMobile: Story = {
  args: { initialStep: 4, initialAnswers: allAnswered, initialStatus: 'server' },
  globals: mobile,
};
