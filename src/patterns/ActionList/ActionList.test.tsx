import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ActionList } from './ActionList';

const items = [
  { id: 'a', title: 'Document your visa timeline', effort: 'Quick win', body: 'One clear page.' },
  {
    id: 'b',
    title: 'Publish a scholarship guide',
    effort: '2-4 weeks',
    body: 'Show real examples.',
  },
  { id: 'c', title: 'Start a pilot', body: 'Three agents.' },
];

describe('ActionList', () => {
  it('is a labelled ordered list in the given rank order', () => {
    render(<ActionList items={items} label="Next steps" />);
    const list = screen.getByRole('list', { name: 'Next steps' });
    const buttons = Array.from(list.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons[0]).toContain('Document your visa timeline');
    expect(buttons[2]).toContain('Start a pilot');
    expect(list.querySelectorAll('li[class*="item"]')).toHaveLength(3);
  });

  it('opens the first step and lets the others open and close', async () => {
    render(<ActionList items={items} label="Next steps" />);
    expect(screen.getByRole('button', { name: /Document your visa timeline/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const second = screen.getByRole('button', { name: /Publish a scholarship guide/ });
    expect(second).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Show real examples.')).toBeVisible();
  });

  it('can start fully collapsed', () => {
    render(<ActionList items={items} label="Next steps" openFirst={false} />);
    expect(screen.getByRole('button', { name: /Document your visa timeline/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('shows a step without a body as a plain row with no expand button', () => {
    render(<ActionList items={[{ id: 'x', title: 'Only a title' }]} label="Next steps" />);
    expect(screen.getByText('Only a title')).toBeVisible();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
