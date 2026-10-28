import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleAdvisorRequest } from './api/handler';
import { stubAdvisorRequestSink } from './api/sink';
import { AdvisorRequest } from './AdvisorRequest';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn((url: string, init: RequestInit) =>
    handleAdvisorRequest(new Request(`http://localhost${url}`, init), stubAdvisorRequestSink),
  );
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const next = (): Promise<void> => userEvent.click(screen.getByRole('button', { name: 'Continue' }));
const send = (): Promise<void> =>
  userEvent.click(screen.getByRole('button', { name: /Send request/ }));

async function fillAndSend(): Promise<void> {
  await next();
  await userEvent.type(screen.getByLabelText('Name'), 'Linh Tran');
  await userEvent.type(screen.getByLabelText('WhatsApp number'), '+84 90 123 4567');
  await send();
}

describe('AdvisorRequest', () => {
  it('shows the three reasons, the channels and TBC placeholders (no invented contact details)', () => {
    render(<AdvisorRequest />);
    expect(screen.getByRole('heading', { name: 'When to talk to a person' })).toBeInTheDocument();
    expect(screen.getByText('Your scores look mixed')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByText('[WHATSAPP NUMBER TO BE CONFIRMED WITH CAPSTONE]')).toBeInTheDocument();
    expect(screen.getByText('[EMAIL ADDRESS TO BE CONFIRMED WITH CAPSTONE]')).toBeInTheDocument();
    expect(screen.getByText('[CALL DETAILS TO BE CONFIRMED WITH CAPSTONE]')).toBeInTheDocument();
  });

  it('shows the advisor card with TBC photo, name and reply time on step 2', async () => {
    render(<AdvisorRequest />);
    await next();
    const aside = screen.getByRole('complementary', { name: 'Your advisor' });
    expect(within(aside).getByRole('img', { name: '[ADVISOR PHOTO]' })).toBeInTheDocument();
    expect(within(aside).getByText('[ADVISOR NAME]')).toBeInTheDocument();
    expect(within(aside).getByText('[TO BE CONFIRMED WITH CAPSTONE]')).toBeInTheDocument();
  });

  it('changes the contact field label, type and autocomplete with the channel', async () => {
    render(<AdvisorRequest />);
    await userEvent.click(screen.getByRole('radio', { name: /Email/ }));
    await next();
    const email = screen.getByLabelText('Email address');
    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAttribute('autocomplete', 'email');
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('radio', { name: /Request a call/ }));
    await next();
    const phone = screen.getByLabelText('Phone number');
    expect(phone).toHaveAttribute('type', 'tel');
    expect(phone).toHaveAttribute('autocomplete', 'tel');
  });

  it('offers the three Vietnam-time windows', async () => {
    render(<AdvisorRequest />);
    await next();
    const select = screen.getByLabelText('Preferred time (Vietnam time)');
    expect(
      within(select)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['Morning, 9:00 to 12:00', 'Afternoon, 13:00 to 17:00', 'Evening, 18:00 to 20:00']);
  });

  it('shows per-field alerts, keeps the step and focuses the first error', async () => {
    render(<AdvisorRequest />);
    await next();
    await send();
    const alerts = screen.getAllByRole('alert');
    expect(alerts.map((a) => a.textContent)).toEqual([
      'Please add your name.',
      'Please add a way to reach you.',
    ]);
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows a channel-specific contact error and clears it when typing', async () => {
    render(<AdvisorRequest />);
    await userEvent.click(screen.getByRole('radio', { name: /Email/ }));
    await next();
    await userEvent.type(screen.getByLabelText('Name'), 'Linh');
    await userEvent.type(screen.getByLabelText('Email address'), 'nope');
    await send();
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email address.');
    expect(screen.getByLabelText('Email address')).toHaveFocus();
    await userEvent.type(screen.getByLabelText('Email address'), 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('posts a valid request and shows the success state with the first name and chips', async () => {
    render(<AdvisorRequest />);
    await fillAndSend();
    expect(await screen.findByRole('heading', { name: 'Thank you, Linh' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/advisor-request');
    expect(JSON.parse(init.body as string)).toMatchObject({
      channel: 'whatsapp',
      name: 'Linh Tran',
      contact: '+84 90 123 4567',
      time: 'morning',
    });
    expect(screen.getByText('Channel: WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Time: Morning, 9:00 to 12:00')).toBeInTheDocument();
    expect(screen.getByText('You hear back by WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('[TIMING TO BE CONFIRMED WITH CAPSTONE]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to my report' })).toHaveAttribute('href', '/report');
    const panel = screen
      .getByRole('heading', { name: 'Thank you, Linh' })
      .closest('[tabindex="-1"]');
    expect(panel).toHaveFocus();
  });

  it('resets everything on "Send another"', async () => {
    render(<AdvisorRequest />);
    await fillAndSend();
    await userEvent.click(await screen.findByRole('button', { name: 'Send another' }));
    expect(screen.getByRole('radio', { name: /WhatsApp/ })).toBeChecked();
    await next();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('WhatsApp number')).toHaveValue('');
  });

  it('shows an error alert when the request cannot be sent', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'));
    render(<AdvisorRequest />);
    await fillAndSend();
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'We could not send your request. Please try again in a moment.',
      ),
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Linh Tran');
  });

  it('can be completed by keyboard alone', async () => {
    const user = userEvent.setup();
    render(<AdvisorRequest />);
    // Radio group, then the Continue button.
    await user.tab();
    expect(screen.getByRole('radio', { name: /WhatsApp/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /Email/ })).toBeChecked();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByLabelText('Name')).toHaveFocus();
    await user.keyboard('Linh');
    await user.tab();
    expect(screen.getByLabelText('Institution')).toHaveFocus();
    await user.tab();
    await user.keyboard('linh@example.edu');
    await user.tab();
    expect(screen.getByLabelText('Preferred time (Vietnam time)')).toHaveFocus();
    await user.tab();
    await user.keyboard('A short note');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Back' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: /Send request/ })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('heading', { name: 'Thank you, Linh' })).toBeInTheDocument();
    expect(screen.getByText('Time: Morning, 9:00 to 12:00')).toBeInTheDocument();
  });

  it('shows the submitting state from props', () => {
    render(<AdvisorRequest initialStep={1} initialStatus="submitting" />);
    expect(screen.getByRole('button', { name: /Send request/ })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});
