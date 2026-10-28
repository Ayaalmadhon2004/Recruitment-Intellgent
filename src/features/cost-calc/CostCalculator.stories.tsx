import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { costSample } from '@/fixtures/costSample';
import { CostCalculator } from './CostCalculator';

const desktop = { viewport: { value: 'desktop', isRotated: false } };
const mobile = { viewport: { value: 'mobile', isRotated: false } };

const meta = {
  title: 'features/cost-calc/CostCalculator',
  component: CostCalculator,
  args: { initial: costSample.start, peers: costSample.peers },
  decorators: [
    (Story) => (
      <main>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof CostCalculator>;
export default meta;
type Story = StoryObj<typeof meta>;

const start = costSample.start;
const scholarshipZero = { ...start, scholarship: 0 };
const fullScholarship = { ...start, scholarship: 34000 };
const livingOff = { ...start, includeLiving: false };
const topBand = { tuition: '52000', living: '14000', scholarship: 2000, includeLiving: true };
const emptyTuition = { tuition: '', living: '', scholarship: 0, includeLiving: true };

export const Default: Story = { globals: desktop };
export const DefaultMobile: Story = { globals: mobile };
export const ScholarshipZero: Story = { args: { initial: scholarshipZero }, globals: desktop };
export const ScholarshipZeroMobile: Story = { args: { initial: scholarshipZero }, globals: mobile };
export const FullScholarship: Story = { args: { initial: fullScholarship }, globals: desktop };
export const FullScholarshipMobile: Story = { args: { initial: fullScholarship }, globals: mobile };
export const LivingCostsOff: Story = { args: { initial: livingOff }, globals: desktop };
export const LivingCostsOffMobile: Story = { args: { initial: livingOff }, globals: mobile };
export const TopBand: Story = { args: { initial: topBand }, globals: desktop };
export const TopBandMobile: Story = { args: { initial: topBand }, globals: mobile };
export const EmptyTuition: Story = { args: { initial: emptyTuition }, globals: desktop };
export const EmptyTuitionMobile: Story = { args: { initial: emptyTuition }, globals: mobile };
export const NoPeers: Story = { args: { peers: [] }, globals: desktop };
