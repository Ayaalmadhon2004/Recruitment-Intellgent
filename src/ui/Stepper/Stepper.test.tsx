import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './Stepper';

const steps = [
  { id: 'a', label: 'Choose' },
  { id: 'b', label: 'Confirm' },
  { id: 'c', label: 'Done' },
];
const stateLabels = { done: 'Complete', current: 'Now', upcoming: 'Next' };

describe('Stepper', () => {
  it('is a labelled ordered list with aria-current on the current step', () => {
    render(<Stepper steps={steps} current={1} stateLabels={stateLabels} label="Unlock steps" />);
    const list = screen.getByRole('list', { name: 'Unlock steps' });
    const items = within(list)
      .getAllByRole('listitem')
      .filter((li) => li.textContent);
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  it('states done, current and upcoming in words, not colour alone', () => {
    render(<Stepper steps={steps} current={1} stateLabels={stateLabels} label="Unlock steps" />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
