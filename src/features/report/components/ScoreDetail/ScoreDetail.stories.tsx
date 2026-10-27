import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  affordabilityArea,
  emptyEvidenceArea,
  missingAnswersArea,
  noFormulaArea,
  questionHref,
  recommendations,
  scoredArea,
} from './fixtures';
import { ScoreDetail } from './ScoreDetail';

const meta = {
  title: 'features/report/ScoreDetail',
  component: ScoreDetail,
  parameters: { layout: 'fullscreen' },
  args: {
    area: scoredArea,
    recommendations: [],
    questionHref,
    backHref: '#report',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScoreDetail>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** Scored area. Its build is not defined yet, so it shows the to-be-confirmed placeholder. */
export const ScoredDesktop: Story = { globals: desktop };
export const ScoredMobile: Story = { globals: mobile };

export const NotScorableNoFormulaDesktop: Story = {
  args: { area: noFormulaArea },
  globals: desktop,
};
export const NotScorableNoFormulaMobile: Story = {
  args: { area: noFormulaArea },
  globals: mobile,
};

export const NotScorableMissingAnswersDesktop: Story = {
  args: { area: missingAnswersArea },
  globals: desktop,
};
export const NotScorableMissingAnswersMobile: Story = {
  args: { area: missingAnswersArea },
  globals: mobile,
};

export const AffordabilityBreakdownDesktop: Story = {
  args: { area: affordabilityArea },
  globals: desktop,
};
export const AffordabilityBreakdownMobile: Story = {
  args: { area: affordabilityArea },
  globals: mobile,
};

export const EmptyEvidenceDesktop: Story = {
  args: { area: emptyEvidenceArea },
  globals: desktop,
};
export const EmptyEvidenceMobile: Story = {
  args: { area: emptyEvidenceArea },
  globals: mobile,
};

export const WithRecommendationsDesktop: Story = {
  args: { recommendations },
  globals: desktop,
};
export const WithRecommendationsMobile: Story = {
  args: { recommendations },
  globals: mobile,
};

export const SampleDesktop: Story = {
  args: { sample: true, recommendations },
  globals: desktop,
};
export const SampleMobile: Story = {
  args: { sample: true, recommendations },
  globals: mobile,
};
