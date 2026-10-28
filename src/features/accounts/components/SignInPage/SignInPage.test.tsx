import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { createMemoryRuntime } from '../../memory-runtime';
import { SignInPage } from './SignInPage';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const copy = en.accounts.signIn;
const email = (): HTMLElement => screen.getByLabelText(copy.emailLabel);

beforeEach(() => push.mockClear());

describe('SignInPage', () => {
  it('asks for an email with a real label, a hint and one h1', () => {
    render(<SignInPage runtime={createMemoryRuntime()} />);
    expect(screen.getByRole('heading', { level: 1, name: copy.titleEnter })).toBeInTheDocument();
    expect(email()).toHaveAccessibleDescription(copy.emailHint);
    expect(screen.getByRole('list', { name: copy.stepsLabel })).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(en.accounts.dev.heading);
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('says what is wrong with an email that does not look right, and asks nothing of the service', async () => {
    const runtime = createMemoryRuntime();
    const spy = vi.spyOn(runtime.service, 'requestSignInLink');
    render(<SignInPage runtime={runtime} />);
    await userEvent.type(email(), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: copy.cta }));
    expect(screen.getByRole('alert')).toHaveTextContent(copy.invalidEmail);
    expect(email()).toHaveAttribute('aria-invalid', 'true');
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: copy.ctaRetry })).toBeInTheDocument();
  });

  it('sends the link, shows the inbox step and lets the person go back', async () => {
    render(<SignInPage runtime={createMemoryRuntime()} />);
    await userEvent.type(email(), ' Admissions@Uni.Example ');
    await userEvent.click(screen.getByRole('button', { name: copy.cta }));
    expect(
      await screen.findByRole('heading', { level: 1, name: copy.titleSent }),
    ).toBeInTheDocument();
    expect(screen.getByText('admissions@uni.example')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.resend })).toBeDisabled();
    expect(screen.getByText('You can ask for a new link in 0:30.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: copy.useDifferent }));
    expect(screen.getByRole('heading', { level: 1, name: copy.titleEnter })).toBeInTheDocument();
  });

  it('signs in through the development link and goes to the dashboard', async () => {
    const runtime = createMemoryRuntime();
    render(<SignInPage runtime={runtime} />);
    await userEvent.type(email(), 'a@uni.example');
    await userEvent.click(screen.getByRole('button', { name: copy.cta }));
    await userEvent.click(await screen.findByRole('button', { name: copy.dev.open }));
    await waitFor(() => expect(push).toHaveBeenCalledWith(routes.dashboard));
    expect((await runtime.service.currentUser())?.email).toBe('a@uni.example');
  });

  it('shows a problem when the service cannot send the link', async () => {
    const runtime = createMemoryRuntime();
    vi.spyOn(runtime.service, 'requestSignInLink').mockRejectedValue(new Error('down'));
    render(<SignInPage runtime={runtime} />);
    await userEvent.type(email(), 'a@uni.example');
    await userEvent.click(screen.getByRole('button', { name: copy.cta }));
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.unavailable);
    expect(screen.getByRole('heading', { level: 1, name: copy.titleEnter })).toBeInTheDocument();
  });

  it('says so when the development link cannot be used', async () => {
    const runtime = createMemoryRuntime();
    vi.spyOn(runtime.service, 'completeSignIn').mockRejectedValue(new Error('used'));
    render(<SignInPage runtime={runtime} />);
    await userEvent.type(email(), 'a@uni.example');
    await userEvent.click(screen.getByRole('button', { name: copy.cta }));
    await userEvent.click(await screen.findByRole('button', { name: copy.dev.open }));
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.dev.failed);
    expect(push).not.toHaveBeenCalled();
  });

  it('starts in the states stories ask for', () => {
    render(
      <SignInPage runtime={createMemoryRuntime()} initialProblem="invalid" initialEmail="oops" />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(copy.invalidEmail);
  });
});
