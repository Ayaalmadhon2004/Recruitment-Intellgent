import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { LandingPage } from './LandingPage';

const copy = en.landing;
const THREE = copy.how.steps.length;
const counts = { quickStart: auditScope.quickStartQuestions, total: auditScope.totalQuestions };

describe('LandingPage question counts', () => {
  it('quote the same totals the Quick Start and Intake use, from config', () => {
    render(<LandingPage />);
    expect(screen.getByText(`${auditScope.totalQuestions} questions, at your own pace`)).toBeInTheDocument();
    expect(screen.queryByText(/\b40 questions/)).not.toBeInTheDocument();
  });
});

describe('LandingPage hero', () => {
  it('shows the headline and real links for both calls to action', () => {
    render(<LandingPage />);
    expect(screen.getByRole('heading', { level: 1, name: copy.hero.title })).toBeInTheDocument();
    expect(screen.getByText(fill(copy.hero.lead, counts))).toBeInTheDocument();
    const hero = screen.getByRole('region', { name: copy.hero.title });
    expect(within(hero).getByRole('link', { name: copy.hero.primaryCta })).toHaveAttribute(
      'href',
      '/quick-start',
    );
    expect(within(hero).getByRole('link', { name: copy.hero.secondaryCta })).toHaveAttribute(
      'href',
      '#how',
    );
  });

  it('uses a custom start link when given', () => {
    render(<LandingPage startHref="/start-here" />);
    const hero = screen.getByRole('region', { name: copy.hero.title });
    expect(within(hero).getByRole('link', { name: copy.hero.primaryCta })).toHaveAttribute(
      'href',
      '/start-here',
    );
  });

  it('labels the sample score chip as sample data and the photo as temporary', () => {
    render(<LandingPage />);
    const hero = screen.getByRole('region', { name: copy.hero.title });
    expect(within(hero).getByText(copy.hero.chipLabel)).toBeInTheDocument();
    expect(within(hero).getByText(copy.hero.chipScore)).toBeInTheDocument();
    expect(within(hero).getByRole('img', { name: copy.hero.photoAlt })).toBeInTheDocument();
  });
});

describe('LandingPage sections', () => {
  it('has the anchors the navigation points to', () => {
    const { container } = render(<LandingPage />);
    ['get', 'how', 'compare'].forEach((id) => {
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    });
  });

  it('labels the illustrations once, at section level, as sample data', () => {
    render(<LandingPage />);
    const get = screen.getByRole('region', { name: copy.get.title });
    expect(within(get).getAllByText(en.status.sample)).toHaveLength(1);
  });

  it('lists the three steps in order', () => {
    render(<LandingPage />);
    const steps = within(screen.getByRole('list', { name: copy.how.listLabel })).getAllByRole(
      'listitem',
    );
    expect(steps).toHaveLength(THREE);
    copy.how.steps.forEach((step, i) => {
      expect(within(steps[i]!).getByRole('heading', { name: fill(step.title, counts) })).toBeInTheDocument();
      expect(steps[i]).toHaveTextContent(String(i + 1));
    });
  });

  it('shows the privacy line with the placeholder policy', () => {
    render(<LandingPage />);
    const strip = screen.getByRole('region', { name: copy.privacy.label });
    expect(within(strip).getByText(copy.privacy.policyPlaceholder)).toBeInTheDocument();
  });

  it('links the privacy policy once it is confirmed', () => {
    render(<LandingPage privacyPolicyUrl="/privacy" />);
    expect(screen.getByRole('link', { name: copy.privacy.policyLink })).toHaveAttribute(
      'href',
      '/privacy',
    );
  });

  it('ends with the final call to action', () => {
    render(<LandingPage />);
    const band = screen.getByRole('region', { name: copy.finalCta.title });
    expect(within(band).getByRole('link', { name: copy.finalCta.primary })).toHaveAttribute(
      'href',
      '/quick-start',
    );
    expect(within(band).getByRole('link', { name: copy.finalCta.secondary })).toHaveAttribute(
      'href',
      en.site.url,
    );
  });
});

describe('Free or full switch', () => {
  const rows = (): HTMLElement[] =>
    within(screen.getByRole('list', { name: copy.compare.listLabel })).getAllByRole('listitem');

  it('starts on the free report with included and locked rows stated in words', () => {
    render(<LandingPage />);
    expect(screen.getByRole('button', { name: copy.compare.free.tab })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: copy.compare.full.tab })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    const items = rows();
    expect(items).toHaveLength(copy.compare.free.items.length);
    copy.compare.free.items.forEach((item, i) => {
      expect(items[i]).toHaveTextContent(item.label);
      expect(items[i]).toHaveTextContent(
        item.included ? copy.compare.included : copy.compare.locked,
      );
    });
    expect(screen.getByText(copy.compare.free.price)).toBeInTheDocument();
  });

  it('switches to the full report with the pricing placeholder', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);
    await user.click(screen.getByRole('button', { name: copy.compare.full.tab }));
    expect(screen.getByRole('button', { name: copy.compare.full.tab })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('heading', { name: copy.compare.full.title, level: 3 })).toBeVisible();
    expect(rows()).toHaveLength(copy.compare.full.items.length);
    expect(screen.getByText(copy.compare.pricePlaceholder)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: copy.compare.full.cta })).toHaveAttribute(
      'href',
      '/quick-start',
    );
  });

  it('shows a confirmed price instead of the placeholder', async () => {
    const user = userEvent.setup();
    render(<LandingPage pricing="Example price" />);
    await user.click(screen.getByRole('button', { name: copy.compare.full.tab }));
    expect(screen.getByText('Example price')).toBeInTheDocument();
    expect(screen.queryByText(copy.compare.pricePlaceholder)).not.toBeInTheDocument();
  });

  it('can be operated with the keyboard alone', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);
    const full = screen.getByRole('button', { name: copy.compare.full.tab });
    full.focus();
    await user.keyboard('{Enter}');
    expect(full).toHaveAttribute('aria-pressed', 'true');
    screen.getByRole('button', { name: copy.compare.free.tab }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: copy.compare.free.tab })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(full).toHaveAttribute('aria-pressed', 'false');
  });
});
