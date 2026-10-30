import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { known, unknown } from '@/fixtures/builders';
import { lockedPreviewModel, realCaseModel, sampleModel, scoredModel } from '../test-models';
import { ReportSection } from './ReportSection';

const meta = {
  title: 'features/report/ReportSection',
  component: ReportSection,
  parameters: { layout: 'fullscreen' },
  args: {
    model: realCaseModel(),
    mode: 'interactive',
    links: {
      continueHref: '#continue',
      changeAnswersHref: '#change',
      unlockHref: '#unlock',
      pdfHref: '#pdf',
      agentStrategyHref: '#agents',
      advisorHref: '#advisor',
      questionHref: (id) => `#question-${id}`,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportSection>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** What the server returns today: a stage and six areas that cannot be scored yet. */
export const InteractiveRealCaseDesktop: Story = { globals: desktop };
export const InteractiveRealCaseMobile: Story = { globals: mobile };

/** Synthetic numbers, for layout only. */
export const InteractiveScoredDesktop: Story = {
  args: { model: scoredModel() },
  globals: desktop,
};
export const InteractiveScoredMobile: Story = {
  args: { model: scoredModel() },
  globals: mobile,
};

export const InteractiveSampleDesktop: Story = {
  args: { model: sampleModel() },
  globals: desktop,
};
export const InteractiveSampleMobile: Story = {
  args: { model: sampleModel() },
  globals: mobile,
};

export const PreviewRealCaseDesktop: Story = { args: { mode: 'preview' }, globals: desktop };
export const PreviewRealCaseMobile: Story = { args: { mode: 'preview' }, globals: mobile };

export const PreviewScoredDesktop: Story = {
  args: { mode: 'preview', model: scoredModel() },
  globals: desktop,
};
export const PreviewScoredMobile: Story = {
  args: { mode: 'preview', model: scoredModel() },
  globals: mobile,
};

/** Three areas are hidden: they show a lock and the word Locked, never a result. */
export const PreviewLockedDesktop: Story = {
  args: { mode: 'preview', model: lockedPreviewModel() },
  globals: desktop,
};
export const PreviewLockedMobile: Story = {
  args: { mode: 'preview', model: lockedPreviewModel() },
  globals: mobile,
};

export const PreviewSampleDesktop: Story = {
  args: { mode: 'preview', model: sampleModel() },
  globals: desktop,
};
export const PreviewSampleMobile: Story = {
  args: { mode: 'preview', model: sampleModel() },
  globals: mobile,
};

export const PrintRealCaseDesktop: Story = { args: { mode: 'print' }, globals: desktop };
export const PrintRealCaseMobile: Story = { args: { mode: 'print' }, globals: mobile };

export const PrintScoredDesktop: Story = {
  args: { mode: 'print', model: scoredModel() },
  globals: desktop,
};
export const PrintScoredMobile: Story = {
  args: { mode: 'print', model: scoredModel() },
  globals: mobile,
};

export const PrintSampleDesktop: Story = {
  args: { mode: 'print', model: sampleModel() },
  globals: desktop,
};
export const PrintSampleMobile: Story = {
  args: { mode: 'print', model: sampleModel() },
  globals: mobile,
};

/** Locked areas in the interactive report: tabs say Locked, the panel links to the unlock options. No radar. */
export const InteractiveLockedDesktop: Story = {
  args: { model: lockedPreviewModel() },
  globals: desktop,
};
export const InteractiveLockedMobile: Story = {
  args: { model: lockedPreviewModel() },
  globals: mobile,
};

/** Unlocked, but no formula exists: every area still says Not yet scorable. */
export const PreviewUnlockedNotScorableDesktop: Story = {
  args: { mode: 'preview', model: { ...realCaseModel(), unlocked: true } },
  globals: desktop,
};
export const PreviewUnlockedNotScorableMobile: Story = {
  args: { mode: 'preview', model: { ...realCaseModel(), unlocked: true } },
  globals: mobile,
};

/** Synthetic answers for the banner's kite: strong, medium, weak (low confidence) and Not sure cells. */
const kiteAnswers = [
  known('A1', 'private-university'),
  { ...known('A2', 'building'), confidence: 'medium' as const },
  { ...known('A3', 'x'), confidence: 'low' as const },
  unknown('A4'),
  known('B1', 9),
];
export const InteractiveKiteFilledDesktop: Story = {
  args: { model: scoredModel(), answers: kiteAnswers },
  globals: desktop,
};
export const InteractiveKiteFilledMobile: Story = {
  args: { model: scoredModel(), answers: kiteAnswers },
  globals: mobile,
};
/** Nothing answered yet: every cell is empty. */
export const InteractiveKiteEmptyDesktop: Story = {
  args: { model: realCaseModel(), answers: [] },
  globals: desktop,
};
