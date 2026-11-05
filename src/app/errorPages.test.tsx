import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import ErrorPage from './error';
import NotFoundPage from './not-found';

describe('error page', () => {
  it('shows friendly copy, retries and links home without leaking the error', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('secret stack detail')} reset={reset} />);
    expect(
      screen.getByRole('heading', { level: 1, name: en.errorPages.error.title }),
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('secret stack detail');
    fireEvent.click(screen.getByRole('button', { name: en.errorPages.error.retry }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: en.errorPages.error.home })).toHaveAttribute(
      'href',
      routes.home,
    );
  });
});

describe('not-found page', () => {
  it('explains the page is missing and links home and to the audit', () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: en.errorPages.notFound.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: en.errorPages.notFound.home })).toHaveAttribute(
      'href',
      routes.home,
    );
    expect(screen.getByRole('link', { name: en.errorPages.notFound.start })).toHaveAttribute(
      'href',
      routes.quickStart,
    );
  });
});
