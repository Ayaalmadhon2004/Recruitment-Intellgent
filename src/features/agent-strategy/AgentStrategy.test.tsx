import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { sampleAgentStrategy } from '@/fixtures/agentStrategy';
import { agentsConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import type { AgentsConfig } from '@/domain/types';
import { AgentStrategy } from './AgentStrategy';

const copy = en.agentStrategy;

const setup = (props: Partial<Parameters<typeof AgentStrategy>[0]> = {}) =>
  render(
    <AgentStrategy
      agents={sampleAgentStrategy.agents}
      initialForecast={sampleAgentStrategy.forecastValues}
      {...props}
    />,
  );

describe('AgentStrategy', () => {
  it('labels sample data and sample weights', () => {
    setup();
    expect(screen.getByText(en.status.sample)).toBeInTheDocument();
    expect(screen.queryByText(copy.matrix.sampleBadge)).not.toBeInTheDocument();
    expect(screen.queryByText(copy.forecast.sampleBadge)).not.toBeInTheDocument();
    expect(screen.getByText(copy.weights.sampleWeights)).toBeInTheDocument();
  });

  it('takes the pilot terms from config', () => {
    setup();
    const chips = screen.getByRole('list', { name: copy.hero.chipsLabel });
    expect(within(chips).getByText('6-month pilot')).toBeInTheDocument();
    expect(within(chips).getByText('3 agents')).toBeInTheDocument();
    expect(within(chips).getByText('Non-exclusive')).toBeInTheDocument();
    expect(within(chips).getByText('10-15% commission benchmark')).toBeInTheDocument();
  });

  describe('factor donut', () => {
    it('highlights a factor with aria-pressed and shows its weight in the centre', async () => {
      const user = userEvent.setup();
      setup();
      const legend = screen.getByRole('list', { name: copy.weights.legendLabel });
      const button = within(legend).getByRole('button', { name: /Counselling/ });
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(within(legend).getAllByRole('button')).toHaveLength(7);
      expect(screen.getByText(copy.weights.totalWeight)).toBeInTheDocument();

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText('14')).toBeInTheDocument();
      expect(screen.queryByText(copy.weights.totalWeight)).not.toBeInTheDocument();

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByText(copy.weights.totalWeight)).toBeInTheDocument();
    });

    it('lists every weight as text', () => {
      setup();
      const legend = screen.getByRole('list', { name: copy.weights.legendLabel });
      expect(within(legend).getByRole('button', { name: /Student fit.*20%/ })).toBeInTheDocument();
      expect(within(legend).getAllByRole('button').at(-1)).toHaveTextContent('10%');
    });
  });

  describe('matrix', () => {
    it('is a real table with a caption and headers', () => {
      setup();
      const table = screen.getByRole('table');
      expect(within(table).getByText(/The number in brackets shows how much each factor counts/)).toBeInTheDocument();
      expect(within(table).getAllByRole('columnheader')).toHaveLength(9);
      expect(
        within(table).getByRole('columnheader', { name: 'Student fit (20)' }),
      ).toBeInTheDocument();
      expect(within(table).getAllByRole('rowheader')).toHaveLength(3);
      expect(screen.getByRole('region', { name: copy.matrix.regionLabel })).toHaveAttribute(
        'tabindex',
        '0',
      );
    });

    it('shows the weighted score and updates the summary when another agent is selected', async () => {
      const user = userEvent.setup();
      setup();
      const summary = screen.getAllByRole('status')[0]!;
      expect(summary).toHaveTextContent('Agent A - 3.86 out of 5');
      expect(summary).toHaveTextContent(
        'Strongest: Counselling (5). Weakest: Market presence (3).',
      );

      await user.click(screen.getByRole('button', { name: /Agent C/ }));
      expect(screen.getByRole('button', { name: /Agent C/ })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('button', { name: /Agent A/ })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(summary).toHaveTextContent('Agent C - 3.61 out of 5');
      expect(summary).toHaveTextContent(
        'Strongest: Student fit (5). Weakest: Market presence (2).',
      );
      expect(screen.getByText('Selected')).toBeInTheDocument();
    });

    it('recomputes scores from a changed config with no code edit', () => {
      const heavier: AgentsConfig = {
        ...agentsConfig,
        factors: agentsConfig.factors.map((f, i) => ({
          ...f,
          weight: [38, 0, 15, 14, 13, 10, 10][i]!,
        })),
      };
      setup({ config: heavier });
      expect(screen.getAllByRole('status')[0]).toHaveTextContent('Agent A - 4.04 out of 5');
    });
  });

  describe('pilot timeline', () => {
    it('selects a month and updates the panel, with numbers from config', async () => {
      const user = userEvent.setup();
      setup();
      const list = screen.getByRole('list', { name: copy.pilot.listLabel });
      expect(within(list).getAllByRole('button')).toHaveLength(6);
      expect(within(list).getByRole('button', { name: 'Month 1: Shortlist' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByText(/Pick 3\./)).toBeInTheDocument();

      await user.click(within(list).getByRole('button', { name: 'Month 2: Sign terms' }));
      expect(screen.getByText(/Use the 10-15% commission benchmark/)).toBeInTheDocument();
      await user.click(within(list).getByRole('button', { name: 'Month 6: Decide' }));
      expect(screen.getByText('Month 6 - Review')).toBeInTheDocument();
      expect(screen.getByText(copy.pilot.months.m6.body)).toBeInTheDocument();
      expect(within(list).getByRole('button', { name: 'Month 6: Decide' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });

  describe('forecast', () => {
    it('shows each step and the result for the sample inputs', () => {
      setup();
      expect(screen.getByText('Start: 120')).toBeInTheDocument();
      expect(screen.getByText('Offers: 66.0')).toBeInTheDocument();
      expect(screen.getByText('Enrolled: 19.8')).toBeInTheDocument();
      expect(screen.getByText('Kept: 16.8')).toBeInTheDocument();
      expect(screen.getByText('About 17 students from the sample pilot')).toBeInTheDocument();
      expect(screen.getByText('120 x 55% x 30% x 85% = 16.8')).toBeInTheDocument();
    });

    it('converts percents to ratios and updates every step when an input changes', async () => {
      const user = userEvent.setup();
      setup();
      const offer = screen.getByLabelText(copy.forecast.fields.offerRate.label);
      await user.clear(offer);
      await user.type(offer, '50');
      expect(screen.getByText('Offers: 60.0')).toBeInTheDocument();
      expect(screen.getByText('Enrolled: 18.0')).toBeInTheDocument();
      expect(screen.getByText('Kept: 15.3')).toBeInTheDocument();
    });

    it('clamps percents above 100 and treats empty input as zero', async () => {
      const user = userEvent.setup();
      setup();
      const yieldField = screen.getByLabelText(copy.forecast.fields.enrolmentYield.label);
      await user.clear(yieldField);
      await user.type(yieldField, '400');
      expect(screen.getByText('Enrolled: 66.0')).toBeInTheDocument();
      expect(screen.getByText(/x 100% x 85%/)).toBeInTheDocument();
      await user.clear(screen.getByLabelText(copy.forecast.fields.applications.label));
      expect(screen.getByText('Start: 0')).toBeInTheDocument();
      expect(screen.getByText('About 0 students from the sample pilot')).toBeInTheDocument();
    });
  });

  it('shows advisor channels as to-be-confirmed, not links', () => {
    setup();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getAllByText(en.status.tbc).length).toBeGreaterThanOrEqual(3);
  });

  it('can be operated with the keyboard alone', async () => {
    const user = userEvent.setup();
    setup();
    const legendButton = screen.getByRole('button', { name: /Student fit/ });
    legendButton.focus();
    await user.keyboard('{Enter}');
    expect(legendButton).toHaveAttribute('aria-pressed', 'true');

    const agentB = screen.getByRole('button', { name: /Agent B/ });
    agentB.focus();
    await user.keyboard(' ');
    expect(agentB).toHaveAttribute('aria-pressed', 'true');

    const month3 = screen.getByRole('button', { name: /Month 3/ });
    month3.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Month 3 - Run')).toBeInTheDocument();

    const apps = screen.getByLabelText(copy.forecast.fields.applications.label);
    apps.focus();
    await user.keyboard('{Control>}a{/Control}200');
    expect(screen.getByText('Start: 200')).toBeInTheDocument();
  });
});
