import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { sampleAgentStrategy } from '@/fixtures/agentStrategy';
import { AgentStrategy } from './AgentStrategy';

const desktop = { viewport: { value: 'desktop', isRotated: false } };
const mobile = { viewport: { value: 'mobile', isRotated: false } };

const meta = {
  title: 'features/AgentStrategy',
  component: AgentStrategy,
  args: {
    agents: sampleAgentStrategy.agents,
    initialForecast: sampleAgentStrategy.forecastValues,
  },
} satisfies Meta<typeof AgentStrategy>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDesktop: Story = { globals: desktop };
export const DefaultMobile: Story = { globals: mobile };

export const FactorHighlightedDesktop: Story = {
  args: { initialFactorId: 'counselling' },
  globals: desktop,
};
export const FactorHighlightedMobile: Story = {
  args: { initialFactorId: 'counselling' },
  globals: mobile,
};

export const OtherAgentSelectedDesktop: Story = {
  args: { initialAgentId: 'agent-c' },
  globals: desktop,
};
export const OtherAgentSelectedMobile: Story = {
  args: { initialAgentId: 'agent-c' },
  globals: mobile,
};

export const Month6Desktop: Story = { args: { initialMonth: 6 }, globals: desktop };
export const Month6Mobile: Story = { args: { initialMonth: 6 }, globals: mobile };

const zero = { applications: '0', offerRate: '0', enrolmentYield: '0', visaRetention: '0' };
export const ForecastZeroInputsDesktop: Story = {
  args: { initialForecast: zero },
  globals: desktop,
};
export const ForecastZeroInputsMobile: Story = {
  args: { initialForecast: zero },
  globals: mobile,
};
