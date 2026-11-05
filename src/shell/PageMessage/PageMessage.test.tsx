import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageMessage } from './PageMessage';

describe('PageMessage', () => {
  it('has one h1, the body and the way out', () => {
    render(
      <PageMessage title="Not here" body="Try the home page.">
        <button type="button">Home</button>
      </PageMessage>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Not here' })).toBeInTheDocument();
    expect(screen.getByText('Try the home page.')).not.toHaveAttribute('role');
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it('announces itself when it is an error', () => {
    render(
      <PageMessage title="Broke" body="It broke." alert>
        <button type="button">Home</button>
      </PageMessage>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('It broke.');
  });
});
