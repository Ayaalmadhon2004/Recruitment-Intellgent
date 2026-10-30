import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CONFIG_VERSION, auditScope, questionsConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import type { Answer } from '@/domain/types';
import { uiCopy } from '@/design/ui-copy';
import { ToastProvider } from '@/ui';
import { createMemoryStore } from '../../store';
import type { StoredAudit } from '../../store';
import { AuditFlow } from './AuditFlow';
import type { AuditFlowProps } from './AuditFlow';

const quick = questionsConfig.filter((q) => q.quickStart);
const rest = questionsConfig.filter((q) => !q.quickStart);

const unsure = (ids: readonly string[]): Answer[] =>
  ids.map((id) => ({ kind: 'unknown', questionId: id as Answer['questionId'] }));

const saved = (answers: Answer[], sectionIndex = 0): StoredAudit => ({
  configVersion: CONFIG_VERSION,
  answers,
  confirmedTagIds: [],
  sectionIndex,
});

function setup(
  stored: StoredAudit | null = null,
  props: Partial<AuditFlowProps> = {},
): { onPhaseChange: ReturnType<typeof vi.fn> } {
  const onPhaseChange = vi.fn();
  render(
    <ToastProvider>
      <AuditFlow
        store={createMemoryStore(stored)}
        onPhaseChange={onPhaseChange}
        phaseHref={(p) => `/quick-start?phase=${p}`}
        reportHref="/report"
        {...props}
      />
    </ToastProvider>,
  );
  return { onPhaseChange };
}

const next = (): HTMLElement => screen.getByRole('button', { name: /^(Next|See my first read)$/ });

describe('AuditFlow Quick Start questions', () => {
  it('starts on the first Quick Start question with the shared step label', async () => {
    setup();
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      fill(en.quickStart.title, { count: auditScope.quickStartQuestions }),
    );
    const label = screen.getByText(uiCopy.step.question).closest('p');
    expect(label).toHaveTextContent(`${uiCopy.step.question} 1 ${uiCopy.step.of} ${quick.length}`);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });

  it('shows no pause block and no old question list', async () => {
    setup();
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByText(en.intake.pause.title)).not.toBeInTheDocument();
    expect(screen.queryByText(en.intake.pause.exit)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: en.intake.save.saveNow })).not.toBeInTheDocument();
  });

  it('keeps Next off until the question is handled, and Not sure counts', async () => {
    setup();
    await screen.findByRole('heading', { level: 1 });
    expect(next()).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    expect(next()).toBeEnabled();
  });

  it('shows a toast pill when Not sure is chosen, and the privacy note once', async () => {
    setup();
    await screen.findByRole('heading', { level: 1 });
    await userEvent.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    const region = screen.getByRole('status', { name: uiCopy.toast.regionLabel });
    expect(region).toHaveTextContent(en.intake.evidenceHelp.unknown);
    expect(region).toHaveTextContent(en.accounts.signIn.privacy);

    await userEvent.click(next());
    await userEvent.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    expect(region.textContent?.split(en.accounts.signIn.privacy)).toHaveLength(2);
  });

  it('saves by itself after a change', async () => {
    const store = createMemoryStore(null);
    render(
      <ToastProvider>
        <AuditFlow
          store={store}
          onPhaseChange={vi.fn()}
          phaseHref={() => '#'}
          reportHref="/report"
        />
      </ToastProvider>,
    );
    await userEvent.click(await screen.findByRole('button', { name: en.questionCard.notSure }));
    await waitFor(() => expect(store.load()?.answers.length).toBe(1));
  });

  it('asks for the first read after the last Quick Start question', async () => {
    const answers = unsure(quick.slice(0, -1).map((q) => q.id));
    const { onPhaseChange } = setup(saved(answers));
    await screen.findByRole('heading', { level: 1 });
    // Resumes on the first question without an answer: the last one.
    expect(screen.getByText(uiCopy.step.question).closest('p')).toHaveTextContent(
      `${quick.length}`,
    );
    await userEvent.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    await userEvent.click(screen.getByRole('button', { name: en.quickStart.submit }));
    expect(onPhaseChange).toHaveBeenCalledWith('read');
  });

  it('does not open the sections before the Quick Start questions are done', async () => {
    setup(saved([]), { phase: 'sections' });
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      fill(en.quickStart.title, { count: quick.length }),
    );
  });
});

describe('AuditFlow remaining sections', () => {
  const done = saved(unsure(quick.map((q) => q.id)));

  it('shows the section track and a Step label, with only the remaining questions', async () => {
    setup(done, { phase: 'sections' });
    expect(await screen.findByRole('heading', { level: 1, name: en.intake.title })).toBeVisible();
    expect(screen.getByRole('group', { name: uiCopy.flow.sectionsTrack })).toBeInTheDocument();
    expect(screen.getByText(uiCopy.step.step).closest('p')).toHaveTextContent(`${uiCopy.step.step} 1`);
    const firstSection = rest[0]?.section ?? 'A';
    const shown = rest.filter((q) => q.section === firstSection).length;
    expect(screen.getAllByRole('listitem').filter((li) => li.querySelector('article'))).toHaveLength(
      shown,
    );
  });

  it('moves on to the next section and back, and ends with the report link', async () => {
    setup(done, { phase: 'sections' });
    await screen.findByRole('heading', { level: 1, name: en.intake.title });
    const sections = [...new Set(rest.map((q) => q.section))];
    for (const id of sections.slice(1)) {
      await userEvent.click(
        screen.getByRole('button', { name: fill(uiCopy.flow.continueTo, { name: en.sections[id] }) }),
      );
      expect(screen.getByRole('heading', { level: 2, name: en.sections[id] })).toBeVisible();
    }
    expect(screen.getByRole('link', { name: en.intake.nav.seeReport })).toHaveAttribute(
      'href',
      '/report',
    );
    const previous = sections[sections.length - 2];
    if (previous) {
      await userEvent.click(
        screen.getByRole('button', { name: fill(uiCopy.flow.backTo, { name: en.sections[previous] }) }),
      );
      expect(screen.getByRole('heading', { level: 2, name: en.sections[previous] })).toBeVisible();
    }
  });

  it('resumes in the sections when Quick Start is done and later answers exist', async () => {
    const [firstRest] = rest;
    if (!firstRest) throw new Error('no remaining questions');
    setup(saved([...unsure(quick.map((q) => q.id)), ...unsure([firstRest.id])]));
    expect(await screen.findByRole('heading', { level: 1, name: en.intake.title })).toBeVisible();
  });

  it('goes back to the first read from the first section', async () => {
    setup(done, { phase: 'sections' });
    await screen.findByRole('heading', { level: 1, name: en.intake.title });
    expect(
      screen.getByRole('link', {
        name: fill(uiCopy.flow.backTo, { name: en.quickStart.firstReadPageTitle }),
      }),
    ).toHaveAttribute('href', '/quick-start?phase=read');
  });
});

describe('AuditFlow first read', () => {
  it('asks for the first read once Quick Start is done and the address says so', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => undefined)),
    );
    setup(saved(unsure(quick.map((q) => q.id))), { phase: 'read' });
    expect(await screen.findByText(en.quickStart.loading)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
