import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'First step', subtitle: 'Quick win', content: 'First body' },
  { id: 'b', title: 'Second step', content: 'Second body' },
];

describe('Accordion', () => {
  it('starts collapsed with aria-expanded false and hidden panels', () => {
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: /First step/ });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('First body')).not.toBeVisible();
  });

  it('toggles with click, Enter and Space', async () => {
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: /First step/ });
    await userEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('First body')).toBeVisible();
    first.focus();
    await userEvent.keyboard('{Enter}');
    expect(first).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard(' ');
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens one panel at a time by default', async () => {
    render(<Accordion items={items} defaultOpenIds={['a']} />);
    await userEvent.click(screen.getByRole('button', { name: /Second step/ }));
    expect(screen.getByRole('button', { name: /First step/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: /Second step/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('allows several open panels when multiple', async () => {
    render(<Accordion items={items} multiple defaultOpenIds={['a']} />);
    await userEvent.click(screen.getByRole('button', { name: /Second step/ }));
    expect(screen.getByRole('button', { name: /First step/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('labels each panel with its button', () => {
    render(<Accordion items={items} defaultOpenIds={['a']} />);
    expect(screen.getByRole('region', { name: /First step/ })).toHaveTextContent('First body');
  });
});
