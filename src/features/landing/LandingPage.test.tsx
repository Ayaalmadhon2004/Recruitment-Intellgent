import { flight, intro } from '@/design/motion';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { auditScope } from '@/domain/config';
import { uiCopy } from '@/design/ui-copy';
import { en, fill } from '@/domain/copy';
import { INTRO_STORAGE_KEY } from './components/Hero/Hero';
import { LandingPage } from './LandingPage';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

function mockReducedMotion(reduce: boolean): void {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  window.sessionStorage.clear();
  push.mockReset();
  mockReducedMotion(false);
});

afterEach(() => {
  vi.useRealTimers();
});

const copy = en.landing;
const THREE = copy.how.steps.length;
const counts = { quickStart: auditScope.quickStartQuestions, total: auditScope.totalQuestions };

describe('LandingPage question counts', () => {
  it('quote the same totals the Quick Start and Intake use, from config', () => {
    render(<LandingPage />);
    expect(
      screen.getByText(`${auditScope.totalQuestions} questions, at your own pace`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\b40 questions/)).not.toBeInTheDocument();
  });
});

describe('LandingPage hero and intro', () => {
  it('has the headline and lead as real text from the start, with real links', () => {
    render(<LandingPage />);
    expect(screen.getByRole('heading', { level: 1, name: copy.hero.title })).toBeInTheDocument();
    expect(
      screen.getByText(fill(uiCopy.home.introLead, { quickStart: auditScope.quickStartQuestions })),
    ).toBeInTheDocument();
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

  it('shows no sample preview card and no stock photo', () => {
    const { container } = render(<LandingPage />);
    expect(screen.queryByText(en.status.sample)).not.toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });

  it('plays the intro with a skip button, then remembers it for the visit', async () => {
    const user = userEvent.setup();
    const hero = (): HTMLElement => screen.getByRole('region', { name: copy.hero.title });
    const { unmount } = render(<LandingPage />);
    expect(hero()).toHaveAttribute('data-phase', 'playing');
    await user.click(screen.getByRole('button', { name: uiCopy.home.skipIntro }));
    expect(hero()).toHaveAttribute('data-phase', 'done');
    expect(screen.queryByRole('button', { name: uiCopy.home.skipIntro })).not.toBeInTheDocument();
    expect(within(hero()).getByRole('link', { name: copy.hero.primaryCta })).toHaveFocus();
    expect(window.sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1');
    unmount();
    render(<LandingPage />);
    expect(hero()).toHaveAttribute('data-phase', 'done');
    expect(screen.queryByRole('button', { name: uiCopy.home.skipIntro })).not.toBeInTheDocument();
  });

  it('finishes by itself after about three seconds', () => {
    vi.useFakeTimers();
    render(<LandingPage />);
    expect(screen.getByRole('region', { name: copy.hero.title })).toHaveAttribute(
      'data-phase',
      'playing',
    );
    act(() => {
      vi.advanceTimersByTime(intro.doneAt + 100);
    });
    expect(screen.getByRole('region', { name: copy.hero.title })).toHaveAttribute(
      'data-phase',
      'done',
    );
  });

  it('skips the intro for reduced motion', () => {
    mockReducedMotion(true);
    render(<LandingPage />);
    expect(screen.getByRole('region', { name: copy.hero.title })).toHaveAttribute(
      'data-phase',
      'done',
    );
    expect(screen.queryByRole('button', { name: uiCopy.home.skipIntro })).not.toBeInTheDocument();
  });

  it('still plays when sessionStorage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<LandingPage />);
    expect(screen.getByRole('region', { name: copy.hero.title })).toHaveAttribute(
      'data-phase',
      'playing',
    );
    vi.restoreAllMocks();
  });
});

describe('LandingPage sections', () => {
  it('has the anchors the navigation points to', () => {
    const { container } = render(<LandingPage />);
    ['get', 'how', 'compare'].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });

  it('has exactly one wave, between the hero and the rest of the page', () => {
    const { container } = render(<LandingPage />);
    expect(container.querySelectorAll('svg[preserveAspectRatio="none"]')).toHaveLength(1);
  });

  it('shows three outcomes as plain figures with their labels', () => {
    render(<LandingPage />);
    const get = screen.getByRole('region', { name: copy.get.title });
    expect(within(get).getAllByRole('listitem')).toHaveLength(3);
    [copy.get.scores, copy.get.stage, copy.get.steps].forEach((item) => {
      expect(within(get).getByRole('heading', { name: item.title })).toBeInTheDocument();
      expect(within(get).getByText(item.body)).toBeInTheDocument();
    });
  });

  it('draws the three steps as one kite drawn a third at a time, in order, without numerals', () => {
    render(<LandingPage />);
    const steps = within(screen.getByRole('list', { name: copy.how.listLabel })).getAllByRole(
      'listitem',
    );
    expect(steps).toHaveLength(THREE);
    const labels = uiCopy.home.kiteSteps;
    copy.how.steps.forEach((step, i) => {
      expect(
        within(steps[i]!).getByRole('heading', { name: fill(step.title, counts) }),
      ).toBeInTheDocument();
      const kite = within(steps[i]!).getByRole('img', { name: labels[i] });
      expect(kite).toHaveAttribute('data-progress', String(i + 1));
      expect(steps[i]).not.toHaveTextContent(new RegExp(`^${i + 1}\\b`));
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
});

describe('Final call to action', () => {
  const region = (): HTMLElement => screen.getByRole('region', { name: copy.finalCta.title });

  it('is plain text with a real link and no filled band', () => {
    render(<LandingPage />);
    expect(within(region()).getByRole('link', { name: copy.finalCta.primary })).toHaveAttribute(
      'href',
      '/quick-start',
    );
    expect(within(region()).getByRole('link', { name: copy.finalCta.secondary })).toHaveAttribute(
      'href',
      en.site.url,
    );
  });

  it('lifts the kite, then opens the audit after the short flight', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { container } = render(<LandingPage />);
    await user.click(within(region()).getByRole('link', { name: copy.finalCta.primary }));
    expect(container.querySelector('[data-flying="true"]')).not.toBeNull();
    expect(push).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(flight + 50);
    });
    expect(push).toHaveBeenCalledWith('/quick-start');
  });

  it('does not delay navigation for reduced motion', async () => {
    mockReducedMotion(true);
    const user = userEvent.setup();
    const { container } = render(<LandingPage />);
    await user.click(within(region()).getByRole('link', { name: copy.finalCta.primary }));
    expect(container.querySelector('[data-flying="true"]')).toBeNull();
    expect(push).not.toHaveBeenCalled();
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
