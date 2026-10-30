import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { scoreAreaIds } from '@/domain/types';
import type { ReportMode, ReportModel } from '../../contract';
import { areaName } from '../../labels';
import { lockedPreviewModel, realCaseModel, sampleModel, scoredModel } from '../test-models';
import type { ReportLinks } from '../types';
import { ReportSection } from './ReportSection';

const modes: readonly ReportMode[] = ['interactive', 'preview', 'print'];

const links: ReportLinks = {
  continueHref: '/audit',
  changeAnswersHref: '/quick-start',
  unlockHref: '/unlock',
  pdfHref: '/report.pdf',
  questionHref: (id) => `/audit#${id}`,
};

const view = (model: ReportModel, mode: ReportMode, withLinks: ReportLinks = links): void => {
  render(<ReportSection model={model} mode={mode} links={withLinks} />);
};

describe('ReportSection: one model, three modes', () => {
  it.each(modes)('%s: shows the institution, the stage and the completeness', (mode) => {
    view(scoredModel(), mode);
    expect(screen.getByRole('heading', { level: 1, name: 'Example University' })).toBeVisible();
    expect(screen.getByText('Stage: Building')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: en.report.completenessLabel })).toHaveAttribute(
      'aria-valuenow',
      '18',
    );
    expect(screen.getByText('18 of 24 questions answered')).toBeVisible();
  });

  it.each(modes)('%s: every area shows its own score', (mode) => {
    view(scoredModel(), mode);
    for (const value of ['68', '54', '62', '78', '49'])
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
  });

  it('preview and print name all six areas and show each result word', () => {
    for (const mode of ['preview', 'print'] as const) {
      const { unmount } = render(<ReportSection model={scoredModel()} mode={mode} links={links} />);
      for (const id of scoreAreaIds)
        expect(screen.getByRole('article', { name: areaName(id) })).toBeVisible();
      expect(screen.getByText(en.bands.strong)).toBeVisible();
      expect(screen.getAllByText(en.bands.developing)).toHaveLength(2);
      expect(screen.getAllByText(en.bands['needs-attention'])).toHaveLength(2);
      expect(screen.getAllByText(en.status.notScorable)).toHaveLength(1);
      unmount();
    }
  });

  it('interactive shows the same result word for each area as its tab is picked', async () => {
    const user = userEvent.setup();
    view(scoredModel(), 'interactive');
    const expected: Record<string, string> = {
      Readiness: en.bands.developing,
      Competitiveness: en.bands['needs-attention'],
      'Affordability and ROI': en.bands.developing,
      'Digital Visibility': en.bands.strong,
      'Trust Network': en.bands['needs-attention'],
      'Community Influence': en.status.notScorable,
    };
    for (const [name, word] of Object.entries(expected)) {
      await user.click(screen.getByRole('tab', { name: new RegExp(`^${name}`) }));
      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByRole('heading', { level: 3, name })).toBeVisible();
      expect(within(panel).getByText(word)).toBeVisible();
    }
  });
});

describe('ReportSection: areas that cannot be scored', () => {
  it.each(['preview', 'print'] as const)(
    '%s: six areas say Not yet scorable, no numbers',
    (mode) => {
      view(realCaseModel(), mode);
      expect(screen.getAllByText(en.status.notScorable)).toHaveLength(mode === 'print' ? 8 : 6);
      expect(screen.queryByText(en.scoreCard.outOf)).not.toBeInTheDocument();
      expect(screen.queryByText('0')).not.toBeInTheDocument();
      for (const id of scoreAreaIds)
        expect(screen.getByRole('article', { name: areaName(id) })).toHaveAttribute(
          'data-notscorable',
        );
    },
  );

  it('interactive: every tab says Not yet scorable and never a number', async () => {
    const user = userEvent.setup();
    view(realCaseModel(), 'interactive');
    for (const id of scoreAreaIds) {
      const tab = screen.getByRole('tab', { name: new RegExp(`^${areaName(id)}`) });
      expect(tab).toHaveTextContent(en.report.tabNotScorable);
      await user.click(tab);
      expect(within(screen.getByRole('tabpanel')).getByText(en.status.notScorable)).toBeVisible();
    }
    expect(screen.queryByText(en.scoreCard.outOf)).not.toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('lists the missing questions and links them when asked to', () => {
    view(realCaseModel(), 'preview');
    const first = screen.getByRole('article', { name: areaName('readiness') });
    expect(within(first).getByRole('link', { name: en.questions.B2.text })).toHaveAttribute(
      'href',
      '/audit#B2',
    );
  });

  it.each(modes)('%s: both gauges say Not yet scorable when they cannot be read', (mode) => {
    view(realCaseModel(), mode);
    if (mode === 'preview') {
      expect(screen.queryByRole('article', { name: en.gauges['school-fit'] })).toBeNull();
      return;
    }
    for (const name of Object.values(en.gauges)) {
      const gauge = screen.getByRole('article', { name });
      expect(within(gauge).getByText(en.status.notScorable)).toBeVisible();
    }
  });

  it('a scored gauge shows its number out of 10', () => {
    view(scoredModel(), 'print');
    expect(screen.getByRole('img', { name: 'School Fit 7.0 out of 10' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Agent Attractiveness 5.5 out of 10' })).toBeVisible();
  });
});

describe('ReportSection: locked areas in the free preview', () => {
  it('shows the lock and the word Locked and none of the hidden results', () => {
    view(lockedPreviewModel(), 'preview');
    for (const id of ['competitiveness', 'trust-network', 'community-influence'] as const) {
      const card = screen.getByRole('article', { name: areaName(id) });
      expect(card).toHaveAttribute('data-locked');
      expect(within(card).getByText(en.report.locked.word)).toBeVisible();
      expect(within(card).queryByText(en.status.notScorable)).toBeNull();
      expect(within(card).queryByRole('img')).toBeNull();
    }
    expect(screen.getAllByText(en.report.locked.word)).toHaveLength(3);
    expect(screen.queryByText('54')).toBeNull();
    expect(screen.queryByText('49')).toBeNull();
    expect(screen.getByText('68')).toBeVisible();
  });

  it('has no tabs, carousel or radar', () => {
    view(lockedPreviewModel(), 'preview');
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByRole('region', { name: en.report.pilot.carouselLabel })).toBeNull();
    expect(screen.queryByRole('figure')).toBeNull();
  });

  it('offers to continue, to unlock and to change answers', () => {
    view(lockedPreviewModel(), 'preview');
    expect(screen.getByRole('link', { name: en.firstRead.ctaContinue })).toHaveAttribute(
      'href',
      '/audit',
    );
    expect(screen.getByRole('link', { name: en.report.unlock.cta })).toHaveAttribute(
      'href',
      '/unlock',
    );
    expect(screen.getByRole('link', { name: en.firstRead.ctaChange })).toHaveAttribute(
      'href',
      '/quick-start',
    );
  });
});

describe('ReportSection: sample data', () => {
  it.each(modes)('%s: shows the sample badge when the model is a sample', (mode) => {
    view(sampleModel(), mode);
    expect(screen.getByText(en.status.sample)).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: 'Northbridge University' })).toBeVisible();
  });

  it.each(modes)('%s: shows no badge for a real audit', (mode) => {
    view(realCaseModel(), mode);
    expect(screen.queryByText(en.status.sample)).toBeNull();
  });
});

describe('ReportSection: print', () => {
  it('is static: no tabs, buttons, carousel or links', () => {
    view(scoredModel(), 'print');
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(document.querySelector('[aria-roledescription="carousel"]')).toBeNull();
  });

  it('shows the whole pilot as plain text, with its numbers from the model', () => {
    view(scoredModel(), 'print');
    expect(screen.getByText('6 months')).toBeVisible();
    expect(screen.getByText('3 agents')).toBeVisible();
    expect(screen.getByText('Commission benchmark: 10-15%')).toBeVisible();
    for (const step of Object.values(en.report.pilot.steps)) {
      expect(screen.getByText(step.title)).toBeVisible();
      expect(screen.getByText(step.body)).toBeVisible();
    }
  });

  it('puts the report date through the placeholder because it is not confirmed', () => {
    view(scoredModel(), 'print');
    const date = screen.getByText(`${en.report.print.dateLabel}:`, { exact: false });
    expect(within(date).getByText(en.status.tbc)).toBeVisible();
  });
});

describe('ReportSection: interactive', () => {
  it('moves between area tabs with the arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    view(scoredModel(), 'interactive');
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    tabs[0]?.focus();
    await user.keyboard('{ArrowDown}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveFocus();
    expect(
      within(screen.getByRole('tabpanel')).getByRole('heading', {
        level: 3,
        name: areaName('competitiveness'),
      }),
    ).toBeVisible();
    await user.keyboard('{End}');
    expect(tabs[5]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('shows evidence tags and gaps ("Missing evidence") for the picked area', () => {
    view(scoredModel(), 'interactive');
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText(en.evidenceTags['institution-reported'])).toBeVisible();
    expect(within(panel).getByText(en.evidenceTags.estimate)).toBeVisible();
    expect(within(panel).getByRole('heading', { name: en.report.area.gapsHeading })).toBeVisible();
    expect(within(panel).getByRole('link', { name: en.questions.B2.text })).toHaveAttribute(
      'href',
      '/audit#B2',
    );
  });

  it('says so when no answer feeds an area yet', () => {
    view(realCaseModel(), 'interactive');
    expect(screen.getByText(en.report.area.noEvidence)).toBeVisible();
  });

  it('plots a radar of the six areas', () => {
    view(scoredModel(), 'interactive');
    expect(screen.getByRole('table', { name: en.report.radar.title })).toBeInTheDocument();
  });

  it('leaves the recommendations out when there are none', () => {
    view(realCaseModel(), 'interactive');
    expect(screen.queryByRole('heading', { name: en.report.recommendations.title })).toBeNull();
    expect(screen.queryByRole('list', { name: en.report.recommendations.listLabel })).toBeNull();
  });

  it('ranks recommendations by impact, most first', () => {
    view(scoredModel(), 'interactive');
    expect(screen.getByRole('heading', { name: en.report.recommendations.title })).toBeVisible();
    const list = screen.getByRole('list', { name: en.report.recommendations.listLabel });
    const titles = within(list)
      .getAllByRole('button')
      .map((b) => b.textContent);
    expect(titles).toEqual([en.areas.readiness, en.areas['trust-network']]);
  });

  it('browses the pilot carousel', async () => {
    const user = userEvent.setup();
    view(scoredModel(), 'interactive');
    const carousel = screen.getByRole('region', { name: en.report.pilot.carouselLabel });
    await user.click(within(carousel).getByRole('button', { name: en.report.pilot.next }));
    expect(within(carousel).getByText(en.report.pilot.steps.second.title)).toBeVisible();
  });

  it('asks to unlock and shows the unconfirmed path and price as placeholders', () => {
    view(scoredModel(), 'interactive');
    const band = screen.getByRole('region', { name: en.report.unlock.title });
    expect(within(band).getAllByText(en.status.tbc)).toHaveLength(2);
    expect(within(band).getByRole('link', { name: en.report.unlock.cta })).toHaveAttribute(
      'href',
      '/unlock',
    );
  });

  it('does not ask to unlock a report that is already unlocked', () => {
    view({ ...scoredModel(), unlocked: true }, 'interactive');
    expect(screen.queryByRole('region', { name: en.report.unlock.title })).toBeNull();
  });

  it('lists the advisor channels as placeholders, not links', () => {
    view(scoredModel(), 'interactive');
    const advisor = screen.getByRole('region', { name: en.report.advisor.title });
    expect(within(advisor).queryAllByRole('link')).toHaveLength(0);
    expect(within(advisor).getByText(en.report.advisor.whatsapp)).toBeVisible();
    expect(within(advisor).getAllByText(en.status.tbc)).toHaveLength(2);
  });

  it('links the PDF and the audit, and leaves a link out when none is given', () => {
    view(scoredModel(), 'interactive');
    expect(screen.getByRole('link', { name: en.report.downloadPdf })).toHaveAttribute(
      'href',
      '/report.pdf',
    );
    expect(screen.getByRole('link', { name: en.report.continueAudit })).toHaveAttribute(
      'href',
      '/audit',
    );
  });

  it('shows no PDF or continue link without hrefs', () => {
    view(scoredModel(), 'interactive', {});
    expect(screen.queryByRole('link', { name: en.report.downloadPdf })).toBeNull();
    expect(screen.queryByRole('link', { name: en.report.continueAudit })).toBeNull();
  });
});

describe('ReportSection: locked areas and entitlement', () => {
  const links = { unlockHref: '/unlock' };

  it('links each locked area in the preview to the unlock screen', () => {
    render(<ReportSection model={lockedPreviewModel()} mode="preview" links={links} />);
    const cards = screen.getAllByRole('article').filter((c) => c.hasAttribute('data-locked'));
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(within(card).getByRole('link', { name: en.unlock.cta.seeOptions })).toHaveAttribute(
        'href',
        '/unlock',
      );
    }
  });

  it('shows locked areas in the interactive report too, with no radar and no hidden result', () => {
    render(<ReportSection model={lockedPreviewModel()} mode="interactive" links={links} />);
    expect(screen.queryByRole('figure')).toBeNull();
    const tab = screen.getByRole('tab', { name: new RegExp(areaName('trust-network')) });
    expect(within(tab).getByText(en.report.locked.word)).toBeVisible();
  });

  it('prints no locked area and no link', () => {
    render(<ReportSection model={lockedPreviewModel()} mode="print" links={links} />);
    expect(screen.queryByRole('link', { name: en.unlock.cta.seeOptions })).toBeNull();
    expect(screen.getAllByText(en.report.locked.word)).toHaveLength(3);
  });

  it('opens every area when unlocked, and an unscorable one still says Not yet scorable', () => {
    const model = { ...scoredModel(), unlocked: true };
    render(<ReportSection model={model} mode="preview" links={links} />);
    expect(screen.queryByText(en.report.locked.word)).toBeNull();
    expect(screen.getAllByText(en.status.notScorable).length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: en.report.unlock.cta })).toBeNull();
  });
});
