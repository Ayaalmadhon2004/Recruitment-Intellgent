import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('is a native select with a real label and options', async () => {
    render(<Select label="Time" options={options} placeholder="Choose one" />);
    const select = screen.getByLabelText('Time');
    await userEvent.selectOptions(select, 'b');
    expect(select).toHaveValue('b');
    expect(screen.getByRole('option', { name: 'Choose one' })).toBeInTheDocument();
  });

  it('shows an error with role alert', () => {
    render(<Select label="Time" options={options} error="Pick one." />);
    expect(screen.getByLabelText('Time')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Pick one.');
  });
});
