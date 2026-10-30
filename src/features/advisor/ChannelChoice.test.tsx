import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChannelChoice } from './ChannelChoice';

describe('ChannelChoice', () => {
  it('is one radio group with the three channels and TBC details', () => {
    render(<ChannelChoice legend="How?" value="whatsapp" onChange={() => undefined} />);
    expect(screen.getByRole('group', { name: 'How?' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /WhatsApp/ })).toBeChecked();
    expect(screen.getByText('[EMAIL ADDRESS TO BE CONFIRMED WITH CAPSTONE]')).toBeInTheDocument();
  });

  it('reports the chosen channel', async () => {
    const onChange = vi.fn();
    render(<ChannelChoice legend="How?" value="whatsapp" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: /Email/ }));
    expect(onChange).toHaveBeenCalledWith('email');
  });
});
