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
      expect(
        within(table).getByText(/The number in brackets shows how much each factor counts/),
      ).toBeInTheDocument();
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

    it('has no selected-average row and no inline summary box', () => {
      setup();
      expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens a sheet with the weighted score, strength and weakness when an agent is clicked', async () => {
      const user = userEvent.setup();
      setup();
      await user.click(screen.getByRole('button', { name: /Strengths and weaknesses of Agent A/ }));
      const dialog = screen.getByRole('dialog', { name: 'Agent A' });
      expect(dialog).toHaveTextContent('3.86 / 5');
      expect(within(dialog).getByText('Strength').parentElement).toHaveTextContent(
        'Counselling (5)',
      );
      expect(within(dialog).getByText('Weakness').parentElement).toHaveTextContent(
        'Market presence (3)',
      );
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /of Agent A/ })).toHaveFocus();

      await user.click(screen.getByRole('button', { name: /of Agent C/ }));
      const other = screen.getByRole('dialog', { name: 'Agent C' });
      expect(other).toHaveTextContent('3.61 / 5');
      expect(other).toHaveTextContent('Student fit (5)');
      expect(other).toHaveTextContent('Market presence (2)');
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('recomputes scores from a changed config with no code edit', async () => {
      const user = userEvent.setup();
      const heavier: AgentsConfig = {
        ...agentsConfig,
        factors: agentsConfig.factors.map((f, i) => ({
          ...f,
          weight: [38, 0, 15, 14, 13, 10, 10][i]!,
        })),
      };
      setup({ config: heavier });
      await user.click(screen.getByRole('button', { name: /of Agent A/ }));
      expect(screen.getByRole('dialog')).toHaveTextContent('4.04 / 5');
    });
  });

  describe('pilot kite', () => {
    it('is a slider over the pilot months, spelled out, driven by config', async () => {
      const user = userEvent.setup();
      setup();
      const slider = screen.getByRole('slider', { name: 'Pilot month' });
      expect(slider).toHaveAttribute('aria-valuemin', '1');
      expect(slider).toHaveAttribute('aria-valuemax', '6');
      expect(slider).toHaveAttribute('aria-valuenow', '1');
      expect(slider).toHaveAttribute('aria-valuetext', 'Month one');
      expect(screen.getByText(/Pick 3\./)).toBeInTheDocument();

      slider.focus();
      await user.keyboard('{ArrowRight}');
      expect(slider).toHaveAttribute('aria-valuetext', 'Month two');
      expect(screen.getByText(/Use the 10-15% commission benchmark/)).toBeInTheDocument();
      await user.keyboard('{End}');
      expect(slider).toHaveAttribute('aria-valuetext', 'Month six');
      expect(screen.getByText('Month 6 - Review')).toBeInTheDocument();
      expect(screen.getByText(copy.pilot.months.m6.body)).toBeInTheDocument();
      await user.keyboard('{Home}');
      expect(slider).toHaveAttribute('aria-valuenow', '1');
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

    it('gives the progress ring a text equivalent that follows the inputs', async () => {
      const user = userEvent.setup();
      setup();
      expect(screen.getByText('14% of applications')).toBeInTheDocument();
      const apps = screen.getByLabelText(copy.forecast.fields.applications.label);
      await user.clear(apps);
      expect(screen.getByText('0% of applications')).toBeInTheDocument();
    });

    it('marks the steps 1 to 4 with a screen-reader label and keeps the multiply signs decorative', () => {
      setup();
      for (const n of [1, 2, 3, 4]) expect(screen.getByText(`STEP ${n}`)).toBeInTheDocument();
      const form = screen.getByText(copy.forecast.sampleNote).closest('div')!;
      expect(within(form).queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows the result as a live region that follows the inputs', async () => {
      const user = userEvent.setup();
      setup();
      const live = screen.getByRole('status', { name: 'Live result' });
      expect(live).toHaveTextContent('16.8');
      const apps = screen.getByLabelText(copy.forecast.fields.applications.label);
      await user.clear(apps);
      await user.type(apps, '200');
      expect(live).toHaveTextContent('28.1');
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

  it('no longer repeats the advisor call to action', () => {
    setup();
    expect(screen.queryByText(copy.cta.title)).not.toBeInTheDocument();
  });

  it('can be operated with the keyboard alone', async () => {
    const user = userEvent.setup();
    setup();
    const legendButton = screen.getByRole('button', { name: /Student fit/ });
    legendButton.focus();
    await user.keyboard('{Enter}');
    expect(legendButton).toHaveAttribute('aria-pressed', 'true');

    const agentB = screen.getByRole('button', { name: /of Agent B/ });
    agentB.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('dialog', { name: 'Agent B' })).toBeInTheDocument();
    await user.keyboard('{Escape}');

    const slider = screen.getByRole('slider', { name: 'Pilot month' });
    slider.focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByText('Month 3 - Run')).toBeInTheDocument();

    const apps = screen.getByLabelText(copy.forecast.fields.applications.label);
    apps.focus();
    await user.keyboard('{Control>}a{/Control}200');
    expect(screen.getByText('Start: 200')).toBeInTheDocument();
  });
});
