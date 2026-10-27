import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

const tabs = [
  { id: 'a', label: 'Readiness', badge: '68', content: 'Readiness panel' },
  { id: 'b', label: 'Affordability', badge: '62', content: 'Affordability panel' },
  { id: 'c', label: 'Trust', content: 'Trust panel' },
];

describe('Tabs', () => {
  it('exposes tablist, tabs and a labelled tabpanel', () => {
    render(<Tabs tabs={tabs} label="Score areas" />);
    expect(screen.getByRole('tablist', { name: 'Score areas' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    const first = screen.getByRole('tab', { name: /Readiness/ });
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName(/Readiness/);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Readiness panel');
  });

  it('uses a roving tabindex', () => {
    render(<Tabs tabs={tabs} label="Score areas" />);
    expect(screen.getByRole('tab', { name: /Readiness/ })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: /Affordability/ })).toHaveAttribute('tabindex', '-1');
  });

  it('moves and selects with ArrowRight, ArrowLeft, Home and End, wrapping around', async () => {
    render(<Tabs tabs={tabs} label="Score areas" />);
    screen.getByRole('tab', { name: /Readiness/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Affordability/ })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Affordability panel');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: /Trust/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Readiness/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /Trust/ })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: /Readiness/ })).toHaveFocus();
  });

  it('uses up and down arrows when vertical', async () => {
    render(<Tabs tabs={tabs} label="Score areas" orientation="vertical" />);
    screen.getByRole('tab', { name: /Readiness/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: /Affordability/ })).toHaveFocus();
  });
});
