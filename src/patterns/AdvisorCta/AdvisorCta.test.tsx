import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { AdvisorCta } from './AdvisorCta';

const base = {
  title: 'Talk it through with a person',
  body: 'An advisor will walk you through.',
  tbcText: en.status.tbc,
  pendingText: en.status.pending,
};

describe('AdvisorCta', () => {
  it('shows a labelled placeholder, not a link, for a channel that is not confirmed', () => {
    render(
      <AdvisorCta
        {...base}
        photo={{ placeholder: '[ADVISOR PHOTO]' }}
        channels={[
          { id: 'wa', label: 'WhatsApp', href: null },
          { id: 'mail', label: 'Email', href: null },
        ]}
      />,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getAllByText(en.status.pending)).toHaveLength(2);
    expect(screen.getByRole('img', { name: '[ADVISOR PHOTO]' })).toBeInTheDocument();
  });

  it('renders a real link once a channel is confirmed', () => {
    render(
      <AdvisorCta
        {...base}
        photo={{ src: '/temp-assets/temp-graduate.jpg', alt: 'Advisor' }}
        channels={[
          { id: 'wa', label: 'WhatsApp', href: 'https://wa.me/0' },
          { id: 'mail', label: 'Email', href: null },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/0',
    );
    expect(screen.getAllByText(en.status.pending)).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Advisor' })).toBeInTheDocument();
  });
});
