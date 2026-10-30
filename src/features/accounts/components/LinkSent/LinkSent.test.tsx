import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { en } from '@/domain/copy';
import { formatCountdown, LinkSent } from './LinkSent';

const copy = en.accounts.signIn;
const base = { email: 'a@uni.example', cooldown: 30, onResend: vi.fn(), onChangeEmail: vi.fn() };

describe('LinkSent', () => {
  it('shows the address, the countdown and a disabled resend while waiting', () => {
    render(<LinkSent {...base} remaining={30} />);
    expect(screen.getByText('a@uni.example')).toBeInTheDocument();
    expect(screen.getByText('You can ask for a new link in 0:30.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.resend })).toBeDisabled();
  });

  it('enables resend when the wait is over', async () => {
    const onResend = vi.fn();
    render(<LinkSent {...base} remaining={0} onResend={onResend} />);
    expect(screen.getByText(copy.resendReady)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: copy.resend }));
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  it('does not state a link lifetime nobody has confirmed', () => {
    render(<LinkSent {...base} remaining={0} />);
    expect(screen.getByText(copy.expiryPlaceholder).closest('[data-tbc]')).toHaveAttribute(
      'data-tbc',
      'true',
    );
    expect(screen.queryByText(/15 minutes/)).not.toBeInTheDocument();
  });

  it('offers the development link only when given', () => {
    const { rerender } = render(<LinkSent {...base} remaining={0} />);
    expect(screen.queryByRole('button', { name: copy.dev.open })).not.toBeInTheDocument();
    rerender(
      <LinkSent
        {...base}
        remaining={0}
        development={{ onOpen: vi.fn(), opening: false, failed: true }}
      />,
    );
    expect(screen.getByRole('button', { name: copy.dev.open })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(copy.dev.failed);
  });
});

describe('formatCountdown', () => {
  it('pads seconds', () => {
    expect(formatCountdown(30)).toBe('0:30');
    expect(formatCountdown(5)).toBe('0:05');
    expect(formatCountdown(65)).toBe('1:05');
  });
});
