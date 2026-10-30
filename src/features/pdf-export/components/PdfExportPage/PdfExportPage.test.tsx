import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { en } from '@/domain/copy';
import { northbridgeReportModel, syntheticScoredReportModel } from '@/fixtures/report';
import { PdfExportPage } from './PdfExportPage';

const copy = en.pdfExport;
const sections = en.report.print.sections;
const OPTIONS_ON_BY_DEFAULT = 4;

const toggle = (name: string): HTMLElement => screen.getByRole('switch', { name });

describe('PdfExportPage', () => {
  it('shows the hero, the sample badge and the A4 preview', () => {
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    expect(screen.getByRole('heading', { level: 1, name: copy.hero.title })).toBeVisible();
    expect(screen.getAllByText(en.status.sample).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('img', { name: /A4 preview of the PDF for .*sample data/i }),
    ).toBeInTheDocument();
  });

  it('starts with four sections on and evidence notes off', () => {
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    expect(toggle(sections.evidence)).toHaveAttribute('aria-checked', 'false');
    for (const id of ['scores', 'steps', 'afford', 'pilot'] as const)
      expect(toggle(sections[id])).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText(`Include sections (${OPTIONS_ON_BY_DEFAULT} of 5)`)).toBeVisible();
  });

  it('adds and removes a section from the document', async () => {
    const user = userEvent.setup();
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    expect(
      screen.queryByRole('heading', { name: en.report.print.evidence.title }),
    ).not.toBeInTheDocument();
    await user.click(toggle(sections.evidence));
    expect(
      screen.getByRole('heading', { name: en.report.print.evidence.title }),
    ).toBeInTheDocument();
    await user.click(toggle(sections.pilot));
    expect(screen.queryByText(en.report.print.pilotHeading)).not.toBeInTheDocument();
    expect(screen.getByText('Include sections (4 of 5)')).toBeVisible();
  });

  it('says so when no section is included', async () => {
    const user = userEvent.setup();
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    for (const id of ['scores', 'steps', 'afford', 'pilot'] as const)
      await user.click(toggle(sections[id]));
    expect(screen.getByText(en.report.print.noSections)).toBeVisible();
  });

  it('switches the page shown and announces it', async () => {
    const user = userEvent.setup();
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    const group = screen.getByRole('group', { name: copy.pages.label });
    expect(within(group).getByRole('button', { name: copy.pages.cover })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await user.click(within(group).getByRole('button', { name: copy.pages.content }));
    expect(within(group).getByRole('button', { name: copy.pages.content })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(new RegExp(copy.preview.captionContent))).toBeVisible();
  });

  it('keeps Vietnamese disabled and marked to be confirmed', () => {
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    const option = screen.getByRole('option', { name: /Vietnamese/ });
    expect(option).toBeDisabled();
    expect(option).toHaveTextContent(en.status.tbc);
  });

  it('shows the logo placeholder through TbcValue, never a made-up logo', async () => {
    const user = userEvent.setup();
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    expect(screen.queryByText(copy.options.logoPlaceholder)).not.toBeInTheDocument();
    await user.click(toggle(copy.options.logoLabel));
    expect(screen.getByText(copy.options.logoPlaceholder).closest('[data-tbc]')).toHaveAttribute(
      'data-tbc',
      'true',
    );
    expect(screen.getByText(copy.preview.logoPlaceholder).closest('[data-tbc]')).toHaveAttribute(
      'data-tbc',
      'true',
    );
  });

  it('keeps the report date as a to-be-confirmed value on the cover', () => {
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} />);
    const date = screen.getByText(`${en.report.print.dateLabel}:`, { exact: false });
    expect(within(date).getByText(en.status.tbc).closest('[data-tbc]')).toHaveAttribute(
      'data-tbc',
      'true',
    );
  });

  it('draws areas that cannot be scored as Not yet scorable, never as 0', () => {
    render(<PdfExportPage previewModel={northbridgeReportModel()} />);
    expect(screen.getAllByText(en.status.notScorable).length).toBeGreaterThan(0);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('opens the print window from Download PDF', async () => {
    const user = userEvent.setup();
    const onPrint = vi.fn();
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} onPrint={onPrint} />);
    await user.click(screen.getByRole('button', { name: copy.action.download }));
    expect(onPrint).toHaveBeenCalledTimes(1);
    expect(screen.getByText(copy.action.hint)).toBeVisible();
  });

  it('links back to the report', () => {
    render(<PdfExportPage previewModel={syntheticScoredReportModel()} reportHref="/r" />);
    expect(screen.getByRole('link', { name: copy.nav.backToReport })).toHaveAttribute('href', '/r');
  });

  it('shows a busy skeleton while loading, not the options', () => {
    render(<PdfExportPage previewState="loading" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(en.skeleton.pdfExport);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it.each(['error', 'empty'] as const)('shows the %s state, not the options', (state) => {
    render(<PdfExportPage previewState={state} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
