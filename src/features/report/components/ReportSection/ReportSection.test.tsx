import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { scoreAreaIds } from '@/domain/types';
import { reportUiCopy } from '@/design/ui-copy';
import { known, unknown } from '@/fixtures/builders';
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
  agentStrategyHref: '/agents',
  advisorHref: '/advisor',
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

  it.each(['preview', 'print'] as const)('%s: every area shows its own score', (mode) => {
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

  it('interactive: picking a score shows its percentage and, for an area, its result word', async () => {
    const user = userEvent.setup();
    view(scoredModel(), 'interactive');
    const panel = (): HTMLElement =>
      screen.getByRole('radiogroup').nextElementSibling as HTMLElement;
    expect(screen.getByRole('radio', { name: 'Readiness' })).toBeChecked();
    expect(within(panel()).getByText('68%')).toBeVisible();
    expect(within(panel()).getByText(en.bands.developing)).toBeVisible();
    await user.click(screen.getByRole('radio', { name: en.areas['digital-visibility'] }));
    expect(within(panel()).getByText('78%')).toBeVisible();
    expect(within(panel()).getByText(en.bands.strong)).toBeVisible();
    await user.click(screen.getByRole('radio', { name: en.report.completenessLabel }));
    expect(within(panel()).getByText('75%')).toBeVisible();
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

  it('interactive: a score that cannot be read says Not yet scorable and never a number', async () => {
    const user = userEvent.setup();
    view(realCaseModel(), 'interactive');
    const panel = (): HTMLElement =>
      screen.getByRole('radiogroup').nextElementSibling as HTMLElement;
    for (const name of ['Readiness', en.areas['digital-visibility']]) {
      await user.click(screen.getByRole('radio', { name }));
      expect(within(panel()).getByText(en.status.notScorable)).toBeVisible();
      expect(within(panel()).queryByText(/%/)).toBeNull();
    }
    // Completeness is always readable: it is a count of answers.
    await user.click(screen.getByRole('radio', { name: en.report.completenessLabel }));
    expect(within(panel()).getByText('21%')).toBeVisible();
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
      expect(screen.queryByRole('heading', { name: en.gauges['school-fit'] })).toBeNull();
      return;
    }
    for (const name of Object.values(en.gauges)) {
      const gauge = screen.getByRole('heading', { level: 3, name }).closest('li') as HTMLElement;
      expect(within(gauge).getByText(en.status.notScorable)).toBeVisible();
    }
  });

  it('a scored gauge shows its number out of 10', () => {
    view(scoredModel(), 'print');
    expect(screen.getByText('7.0 out of 10')).toBeVisible();
    expect(screen.getByText('5.5 out of 10')).toBeVisible();
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
  it('picks a score with the arrow keys as a radio group', async () => {
    const user = userEvent.setup();
    view(scoredModel(), 'interactive');
    const group = screen.getByRole('radiogroup', { name: reportUiCopy.scores.pick });
    const radios = within(group).getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios[0]).toBeChecked();
    radios[0]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(radios[1]).toBeChecked();
    expect(radios[1]).toHaveFocus();
    expect(screen.getByText('75%')).toBeVisible();
  });

  it('shows evidence tags and gaps ("Missing evidence") for the picked area', () => {
    view(scoredModel(), 'interactive');
    expect(screen.getByText(en.evidenceTags['institution-reported'])).toBeVisible();
    expect(screen.getByText(en.evidenceTags.estimate)).toBeVisible();
    expect(screen.getByRole('heading', { name: en.report.area.gapsHeading })).toBeVisible();
    expect(screen.getByRole('link', { name: en.questions.B2.text })).toHaveAttribute(
      'href',
      '/audit#B2',
    );
  });

  it('says so when no answer feeds an area yet', () => {
    view(realCaseModel(), 'interactive');
    expect(screen.getByText(en.report.area.noEvidence)).toBeVisible();
  });

  it('has no radar, no stage block, no pilot carousel and no area tabs', () => {
    view(scoredModel(), 'interactive');
    expect(screen.queryByRole('table', { name: en.report.radar.title })).toBeNull();
    expect(screen.queryByText(en.report.stageEyebrow)).toBeNull();
    expect(screen.queryByText(en.report.pilot.eyebrow)).toBeNull();
    expect(screen.queryByRole('region', { name: en.report.pilot.carouselLabel })).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('shows the pilot in the banner with its numbers from the model', () => {
    view(scoredModel(), 'interactive');
    expect(screen.getByText('6 months')).toBeVisible();
    expect(screen.getByText('3 agents')).toBeVisible();
    expect(screen.getByText(en.report.pilot.nonExclusive)).toBeVisible();
  });

  it('draws a kite of 24 cells in 6 sections, filled by how firm each answer is', () => {
    const answers = [
      known('A1', 'private-university'),
      { ...known('A2', 'building'), confidence: 'medium' as const },
      { ...known('A3', 'x'), confidence: 'low' as const },
      unknown('A4'),
    ];
    render(
      <ReportSection model={scoredModel()} mode="interactive" links={links} answers={answers} />,
    );
    const kite = screen.getByRole('img', {
      name: 'Your audit as a kite: 4 of 24 questions answered',
    });
    expect(kite.querySelectorAll('polygon[class*="cell"]')).toHaveLength(24);
    const sections = screen.getByRole('list', { name: reportUiCopy.kite.sectionsList });
    expect(within(sections).getAllByRole('listitem')).toHaveLength(6);
    expect(within(sections).getAllByText('4 of 4 answered')).toHaveLength(1);
    expect(within(sections).getAllByText('0 of 4 answered')).toHaveLength(5);
    // Low confidence and Not sure carry hatching as well as colour.
    expect(kite.querySelectorAll('polygon[class*="hatch"]')).toHaveLength(2);
  });

  it('leaves the kite out when the stored answers are not available', () => {
    view(scoredModel(), 'interactive');
    expect(screen.queryByRole('img', { name: /Your audit as a kite/ })).toBeNull();
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

  it('closes with one section of pill actions and shows the unconfirmed path and price as placeholders', () => {
    view(scoredModel(), 'interactive');
    const closing = screen.getByRole('region', { name: en.report.unlock.title });
    expect(within(closing).getAllByText(en.status.tbc)).toHaveLength(2);
    expect(within(closing).getByRole('link', { name: en.report.unlock.cta })).toHaveAttribute(
      'href',
      '/unlock',
    );
    expect(
      within(closing).getByRole('link', { name: reportUiCopy.closing.agentMatrix }),
    ).toHaveAttribute('href', '/agents');
    expect(within(closing).getByRole('link', { name: en.report.downloadPdf })).toHaveAttribute(
      'href',
      '/report.pdf',
    );
    expect(within(closing).getByRole('link', { name: en.report.advisor.title })).toHaveAttribute(
      'href',
      '/advisor',
    );
    // The old separate blocks are gone.
    expect(screen.getAllByRole('region', { name: en.report.unlock.title })).toHaveLength(1);
    expect(screen.queryByRole('heading', { name: en.report.pdf.title })).toBeNull();
  });

  it('does not ask to unlock a report that is already unlocked', () => {
    view({ ...scoredModel(), unlocked: true }, 'interactive');
    const closing = screen.getByRole('region', { name: en.report.unlock.title });
    expect(within(closing).queryByRole('link', { name: en.report.unlock.cta })).toBeNull();
    expect(within(closing).queryByText(en.status.tbc)).toBeNull();
    expect(within(closing).getByRole('link', { name: en.report.downloadPdf })).toBeVisible();
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
    expect(screen.queryByRole('link', { name: en.report.advisor.title })).toBeNull();
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

  it('shows no radar and none of the hidden results in the interactive report', () => {
    render(<ReportSection model={lockedPreviewModel()} mode="interactive" links={links} />);
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.queryByText('54%')).toBeNull();
    expect(screen.queryByText('49%')).toBeNull();
  });

  it('a locked score says so and links to the unlock screen, with no result', async () => {
    const user = userEvent.setup();
    const model = scoredModel();
    const locked: ReportModel = {
      ...model,
      areas: model.areas.map((a) =>
        a.id === 'readiness' ? { id: a.id, locked: true as const } : a,
      ),
    };
    render(<ReportSection model={locked} mode="interactive" links={links} />);
    const card = screen.getByRole('article', { name: areaName('readiness') });
    expect(within(card).getByText(en.report.locked.word)).toBeVisible();
    expect(within(card).getByRole('link', { name: en.unlock.cta.seeOptions })).toHaveAttribute(
      'href',
      '/unlock',
    );
    expect(screen.queryByText('68%')).toBeNull();
    await user.click(screen.getByRole('radio', { name: en.areas['digital-visibility'] }));
    expect(screen.getByText('78%')).toBeVisible();
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
