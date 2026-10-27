import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { scoringConfig, tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { costSample } from '@/fixtures/costSample';
import { CostCalculator } from './CostCalculator';

const renderSample = (): ReturnType<typeof render> =>
  render(<CostCalculator initial={costSample.start} peers={costSample.peers} />);

const net = (): string => screen.getByTestId('net-cost').textContent ?? '';
const here = (): HTMLElement => {
  const item = screen
    .getAllByRole('listitem')
    .find((li) => li.getAttribute('data-here') === 'true');
  if (!item) throw new Error('no current band');
  return item;
};

describe('CostCalculator', () => {
  it('shows the net cost from the starting numbers', () => {
    renderSample();
    expect(net()).toBe('$37,000');
    expect(here()).toHaveTextContent('$30-40k');
    expect(here()).toHaveTextContent(en.costCalc.bands.yourBand);
    expect(screen.getByText('Four years: $148,000')).toBeInTheDocument();
  });

  it('updates the result when the inputs change', async () => {
    const user = userEvent.setup();
    renderSample();
    const tuition = screen.getByLabelText(en.costCalc.inputs.tuition);
    await user.clear(tuition);
    await user.type(tuition, '20000');
    expect(net()).toBe('$23,000');
    expect(here()).toHaveTextContent('$20-30k');
    const living = screen.getByLabelText(en.costCalc.inputs.living);
    await user.clear(living);
    await user.type(living, '0');
    expect(net()).toBe('$14,000');
    expect(here()).toHaveTextContent('Under $20k');
  });

  it('leaves living costs out when the switch is turned off', async () => {
    const user = userEvent.setup();
    renderSample();
    const sw = screen.getByRole('switch', { name: en.costCalc.inputs.includeLiving });
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(net()).toBe('$28,000');
    expect(screen.getByText(en.costCalc.result.livingExcluded)).toBeInTheDocument();
  });

  it('changes the net cost and the band marker with the scholarship slider', () => {
    renderSample();
    const slider = screen.getByRole('slider', { name: en.costCalc.inputs.scholarship });
    expect(slider).toHaveAttribute('max', '34000');
    fireEvent.change(slider, { target: { value: '0' } });
    expect(net()).toBe('$43,000');
    expect(here()).toHaveTextContent('$40-50k');
    fireEvent.change(slider, { target: { value: '34000' } });
    expect(net()).toBe('$9,000');
    expect(here()).toHaveTextContent('Under $20k');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles empty tuition without NaN', () => {
    render(<CostCalculator />);
    expect(net()).toBe('$0');
    expect(here()).toHaveTextContent('Under $20k');
    expect(screen.getByRole('slider')).toHaveAttribute('max', '500');
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });

  it('flags a negative amount and counts it as zero', async () => {
    const user = userEvent.setup();
    render(<CostCalculator initial={{ tuition: '10000' }} />);
    const tuition = screen.getByLabelText(en.costCalc.inputs.tuition);
    await user.clear(tuition);
    await user.type(tuition, '-5');
    expect(screen.getByRole('alert')).toHaveTextContent(en.costCalc.inputs.amountError);
    expect(net()).toBe('$0');
  });

  it('shows the sample badge, the note and text values in the peer chart', () => {
    renderSample();
    expect(screen.getByText(en.costCalc.peers.sampleBadge)).toBeInTheDocument();
    const list = screen.getByRole('list', { name: en.costCalc.peers.listLabel });
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent('You$37,000');
    expect(rows[1]).toHaveTextContent('Peer A (sample)$27,000');
    expect(screen.getByText(/lower than 1 of 3 sample peers/)).toBeInTheDocument();
    expect(screen.getByText(/not real institutions/)).toBeInTheDocument();
  });

  it('hides the peer chart when there are no peers', () => {
    render(<CostCalculator initial={costSample.start} />);
    expect(screen.queryByText(en.costCalc.peers.sampleBadge)).not.toBeInTheDocument();
  });

  it('shows the VND amount as to be confirmed and uses no rate', () => {
    expect(tbcConfig.vndExchangeRate).toBeNull();
    renderSample();
    const group = screen.getByRole('group', { name: en.costCalc.inputs.vnd });
    expect(group).toHaveTextContent(en.status.tbc);
    expect(group.querySelector('[data-tbc="true"]')).not.toBeNull();
  });

  it('lists the six Affordability weights from config and no score', () => {
    renderSample();
    const list = screen.getByRole('list', { name: en.costCalc.weights.listLabel });
    expect(within(list).getAllByRole('listitem')).toHaveLength(6);
    expect(list).toHaveTextContent('Net annual cost30%');
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(en.costCalc.weights.mappingLabel).textContent).toContain(en.status.tbc);
  });

  it('follows the config: changed bands move the marker with no code change', () => {
    const [first, second, ...rest] = scoringConfig.priceBands;
    const config = {
      affordabilityWeights: scoringConfig.affordabilityWeights,
      priceBands: [
        { ...first!, maxUsd: 40000 },
        { ...second!, minUsd: 40000, maxUsd: 45000 },
        ...rest.map((b, i) => ({ ...b, minUsd: 45000 + i * 1000 })),
      ],
    };
    render(<CostCalculator initial={costSample.start} config={config} />);
    expect(net()).toBe('$37,000');
    expect(here()).toHaveTextContent('Under $20k');
  });

  it('links to the score detail and the report', () => {
    render(<CostCalculator detailHref="/detail" reportHref="/rep" />);
    expect(screen.getByRole('link', { name: en.costCalc.cta.detail })).toHaveAttribute(
      'href',
      '/detail',
    );
    expect(screen.getByRole('link', { name: en.costCalc.cta.back })).toHaveAttribute(
      'href',
      '/rep',
    );
  });

  it('works with the keyboard alone', async () => {
    const user = userEvent.setup();
    renderSample();
    await user.tab();
    await user.tab();
    expect(screen.getByLabelText(en.costCalc.inputs.tuition)).toHaveFocus();
    await user.keyboard('{Control>}a{/Control}30000');
    expect(net()).toBe('$33,000');
    await user.tab();
    await user.tab();
    expect(screen.getByRole('switch')).toHaveFocus();
    await user.keyboard(' ');
    expect(net()).toBe('$24,000');
    await user.tab();
    expect(screen.getByRole('slider')).toHaveFocus();
  });
});
