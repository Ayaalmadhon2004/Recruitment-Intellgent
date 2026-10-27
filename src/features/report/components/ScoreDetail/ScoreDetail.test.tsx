import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { scoringConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import {
  affordabilityArea,
  emptyEvidenceArea,
  missingAnswersArea,
  noFormulaArea,
  questionHref,
  recommendations,
  scoredArea,
  scoredAreaNoGaps,
} from './fixtures';
import { ScoreDetail } from './ScoreDetail';

const props = { recommendations: [], questionHref, backHref: '#report' } as const;

const WEIGHT_TOTAL = 100;
const EVIDENCE_ROWS = 2;
const GAP_LINKS = 2;
const OWN_RECOMMENDATIONS = 3;
const TWEAKED_COST_WEIGHT = 40;
const TWEAKED_TOTAL = 110;

describe('ScoreDetail', () => {
  it('shows a scored area with ring, band word, evidence rows and tags', () => {
    render(<ScoreDetail {...props} area={scoredArea} />);
    expect(screen.getByRole('heading', { level: 1, name: en.areas.readiness })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Readiness score 68 out of 100' })).toBeVisible();
    expect(screen.getByText(en.bands.developing)).toBeVisible();
    const rows = within(screen.getByRole('list', { name: en.scoreDetail.evidenceListLabel }));
    expect(rows.getAllByRole('listitem')).toHaveLength(EVIDENCE_ROWS);
    expect(rows.getByText(en.questions.A4.text)).toBeVisible();
    expect(rows.getByText(en.evidenceTags.verified)).toBeVisible();
    expect(rows.getByText(en.evidenceTags.estimate)).toBeVisible();
    expect(rows.getByText(`${en.confidence.label}: ${en.confidence.high}`)).toBeVisible();
  });

  it('links back to the report', () => {
    render(<ScoreDetail {...props} area={scoredArea} />);
    expect(screen.getByRole('link', { name: en.scoreDetail.back })).toHaveAttribute(
      'href',
      '#report',
    );
  });

  it('explains a not-scorable area and links to each missing question', () => {
    render(<ScoreDetail {...props} area={missingAnswersArea} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText(en.status.notScorable)).toBeVisible();
    (['D1', 'D2'] as const).forEach((id) => {
      const links = screen.getAllByRole('link', { name: en.questions[id].text });
      expect(links.length).toBeGreaterThanOrEqual(1);
      links.forEach((link) => expect(link).toHaveAttribute('href', `#question-${id}`));
    });
    const gaps = within(screen.getByRole('list', { name: en.scoreDetail.gapsListLabel }));
    expect(gaps.getAllByRole('link')).toHaveLength(GAP_LINKS);
    expect(screen.queryByText(en.scoreDetail.gapsNone)).toBeNull();
  });

  it('explains a not-scorable area that has no formula and lists nothing to answer', () => {
    render(<ScoreDetail {...props} area={noFormulaArea} />);
    expect(screen.getAllByText(en.notScorable.reasons['no-formula']).length).toBeGreaterThan(0);
    expect(screen.getByText(en.scoreDetail.gapsNoneListed)).toBeVisible();
    expect(screen.queryByText(en.scoreDetail.gapsNone)).toBeNull();
  });

  it('says nothing is missing only for a scored area without gaps', () => {
    render(<ScoreDetail {...props} area={scoredAreaNoGaps} />);
    expect(screen.getByText(en.scoreDetail.gapsNone)).toBeVisible();
  });

  it('lists the Affordability components with weights read from config, summing to 100', () => {
    render(<ScoreDetail {...props} area={affordabilityArea} />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(Object.keys(scoringConfig.affordabilityWeights).length);
    Object.entries(scoringConfig.affordabilityWeights).forEach(([id, weight]) => {
      const name = en.affordabilityComponents[id as keyof typeof en.affordabilityComponents];
      expect(screen.getByRole('progressbar', { name })).toHaveAttribute(
        'aria-valuenow',
        String(weight),
      );
    });
    expect(screen.getByTestId('weights-total')).toHaveTextContent(String(WEIGHT_TOTAL));
    expect(screen.queryByText(en.status.tbc)).toBeNull();
  });

  it('follows the weights it is given, not hard-coded ones', () => {
    render(
      <ScoreDetail
        {...props}
        area={affordabilityArea}
        affordabilityWeights={{
          ...scoringConfig.affordabilityWeights,
          'net-annual-cost': TWEAKED_COST_WEIGHT,
        }}
      />,
    );
    expect(
      screen.getByRole('progressbar', { name: en.affordabilityComponents['net-annual-cost'] }),
    ).toHaveAttribute('aria-valuenow', String(TWEAKED_COST_WEIGHT));
    expect(screen.getByTestId('weights-total')).toHaveTextContent(String(TWEAKED_TOTAL));
  });

  it('shows the to-be-confirmed placeholder for the build of any other area', () => {
    render(<ScoreDetail {...props} area={scoredArea} />);
    expect(screen.getByText(en.status.tbc)).toBeVisible();
    expect(screen.getByText(en.scoreDetail.undefinedBuild, { exact: false })).toBeVisible();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('shows empty sentences when there is no evidence and no recommendation', () => {
    render(<ScoreDetail {...props} area={emptyEvidenceArea} />);
    expect(screen.getByText(en.scoreDetail.evidenceEmpty)).toBeVisible();
    expect(screen.getByText(en.scoreDetail.recommendationsEmpty)).toBeVisible();
  });

  it('ranks only this area recommendations, most impact first', () => {
    render(<ScoreDetail {...props} area={scoredArea} recommendations={recommendations} />);
    const list = screen.getByRole('list', { name: en.scoreDetail.recommendationsLabel });
    const titles = Array.from(list.querySelectorAll('li[class*="item"]')).map(
      (li) => li.textContent,
    );
    expect(titles).toHaveLength(OWN_RECOMMENDATIONS);
    expect(titles[0]).toContain(en.questions.A4.text);
    expect(titles[1]).toContain(en.questions.A1.text);
    expect(titles[2]).toContain(en.questions.B4.text);
    expect(list).not.toHaveTextContent(en.questions.C1.text);
  });

  it('shows the sample badge only for sample data', () => {
    const { rerender } = render(<ScoreDetail {...props} area={scoredArea} />);
    expect(screen.queryByText(en.status.sample)).toBeNull();
    rerender(<ScoreDetail {...props} area={scoredArea} sample />);
    expect(screen.getByText(en.status.sample)).toBeVisible();
  });
});
