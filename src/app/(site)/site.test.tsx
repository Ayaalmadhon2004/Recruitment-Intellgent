import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import SiteLayout from './layout';
import CostCalcPage from './cost-calc/page';
import HomePage from './page';
import QuickStartPage from './quick-start/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const pageFile = (route: string): string =>
  join(__dirname, route === '/' ? '' : route, 'page.tsx');

describe('site wiring', () => {
  it('serves the landing feature at the home route and has no separate /landing page', () => {
    expect(existsSync(pageFile('/'))).toBe(true);
    expect(existsSync(pageFile('/landing'))).toBe(false);
    render(
      <SiteLayout>
        <HomePage />
      </SiteLayout>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it.each([
    ['home', HomePage],
    ['quick start', QuickStartPage],
    ['cost calculator', CostCalcPage],
  ])('renders exactly one main landmark on the %s page', (_name, Page) => {
    render(
      <SiteLayout>
        <Page />
      </SiteLayout>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('links header and footer navigation to real routes, labelled from copy', () => {
    render(
      <SiteLayout>
        <div />
      </SiteLayout>,
    );
    const expected = [
      [en.nav.items.home, routes.home],
      [en.nav.items.quickStart, routes.quickStart],
      [en.nav.items.intake, routes.intake],
      [en.nav.items.report, routes.report],
      [en.nav.items.costCalc, routes.costCalc],
    ] as const;
    const navs = screen.getAllByRole('navigation');
    expect(navs).toHaveLength(2);
    for (const nav of navs) {
      for (const [label, href] of expected) {
        expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', href);
        expect(existsSync(pageFile(href))).toBe(true);
      }
    }
    expect(screen.getByRole('link', { name: en.header.cta })).toHaveAttribute(
      'href',
      routes.quickStart,
    );
  });

  it('points cost calculator back-links at the report', () => {
    render(<CostCalcPage />);
    const back = screen.getAllByRole('link', { name: en.costCalc.cta.back });
    for (const link of back) expect(link).toHaveAttribute('href', routes.report);
    expect(screen.getByRole('link', { name: en.costCalc.cta.detail })).toHaveAttribute(
      'href',
      routes.reportArea('affordability'),
    );
  });
});
