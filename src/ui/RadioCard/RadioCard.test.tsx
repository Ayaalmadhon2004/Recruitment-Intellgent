import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { RadioCardGroup } from './RadioCard';

const options = [
  { value: 'a', label: 'WhatsApp', description: 'Quick chat' },
  { value: 'b', label: 'Email', description: 'Write at your pace' },
  { value: 'c', label: 'Call', description: 'We call you back' },
];

function Harness(): React.ReactNode {
  const [value, setValue] = useState<string | null>('a');
  return (
    <RadioCardGroup
      legend="Choose a channel"
      name="channel"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}

describe('RadioCardGroup', () => {
  it('is a labelled group of native radios', () => {
    render(<Harness />);
    expect(screen.getByRole('group', { name: 'Choose a channel' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /WhatsApp/ })).toBeChecked();
  });

  it('selects with the arrow keys', async () => {
    render(<Harness />);
    screen.getByRole('radio', { name: /WhatsApp/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /Email/ })).toBeChecked();
  });

  it('selects by clicking the card label', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByText('Call'));
    expect(screen.getByRole('radio', { name: /Call/ })).toBeChecked();
  });
});
