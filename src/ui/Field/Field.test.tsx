import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Field } from './Field';

describe('Field', () => {
  it('has a real label tied to the input', async () => {
    render(<Field label="Work email" />);
    const input = screen.getByLabelText('Work email');
    await userEvent.type(input, 'a@b.test');
    expect(input).toHaveValue('a@b.test');
  });

  it('links hint and error to the input and flags it invalid', () => {
    render(<Field label="Name" hint="As on your passport" error="Please add your name." />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const described = input.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(described.split(' ')[0] ?? '')).toHaveTextContent(
      'As on your passport',
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Please add your name.');
  });

  it('renders a textarea when multiline', () => {
    render(<Field label="Message" multiline />);
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });

  it('marks the field invalid without a message of its own', () => {
    render(<Field label="Work email" invalid />);
    expect(screen.getByLabelText('Work email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
