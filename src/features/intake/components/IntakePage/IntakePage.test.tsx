import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CONFIG_VERSION, questionsConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { known } from '@/fixtures/builders';
import { createMemoryStore } from '../../store';
import type { AnswerStore, StoredAudit } from '../../store';
import { IntakePage } from './IntakePage';

const total = questionsConfig.length;
const perSection = questionsConfig.filter((q) => q.section === 'A').length;

const start = (store: AnswerStore = createMemoryStore()): AnswerStore => {
  render(<IntakePage store={store} reportHref="/report" exitHref="/" />);
  return store;
};

const saved = (patch: Partial<StoredAudit> = {}): StoredAudit => ({
  configVersion: CONFIG_VERSION,
  answers: [],
  confirmedTagIds: [],
  sectionIndex: 0,
  ...patch,
});

const sectionHeading = (id: keyof typeof en.sections): HTMLElement =>
  screen.getByRole('heading', { level: 2, name: en.sections[id] });

describe('IntakePage overview', () => {
  it('shows progress against the configured total, never a fixed number', () => {
    start();
    expect(screen.getAllByText(`0 of ${total} answered`).length).toBeGreaterThan(0);
    expect(screen.getByText(`THE ${total}-QUESTION AUDIT`)).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: en.intake.completenessLabel })).toHaveAttribute(
      'aria-valuemax',
      String(total),
    );
    expect(screen.queryByText(/\b40\b/)).not.toBeInTheDocument();
  });

  it('counts answered and Not sure, and says how many are marked Unknown', async () => {
    const user = userEvent.setup();
    start(
      createMemoryStore(
        saved({
          answers: [known('A1', 'private-university'), { kind: 'unknown', questionId: 'A2' }],
        }),
      ),
    );
    expect(screen.getAllByText(`2 of ${total} answered`).length).toBeGreaterThan(0);
    expect(screen.getByText('1 marked Unknown. Unknown is fine.')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: en.questionCard.notSure })[0]!);
    expect(screen.getByText('2 marked Unknown. Unknown is fine.')).toBeInTheDocument();
  });

  it('does not say the audit was resumed when nothing was saved', () => {
    start();
    expect(screen.queryByText(/Resumed at/)).not.toBeInTheDocument();
    expect(screen.getByText(en.intake.save.idle)).toBeInTheDocument();
  });
});

describe('IntakePage sections', () => {
  it('shows every question of the current section, and no "showing 4 of" sentence', () => {
    start();
    expect(
      within(screen.getByRole('list', { name: en.intake.questionsLabel })).getAllByRole('article'),
    ).toHaveLength(perSection);
    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
    expect(sectionHeading('A')).toBeInTheDocument();
  });

  it('moves between sections with the section buttons', async () => {
    const user = userEvent.setup();
    start();
    const group = screen.getByRole('group', { name: en.intake.sectionsGroup });
    const buttons = within(group).getAllByRole('button');
    expect(buttons).toHaveLength(6);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    await user.click(buttons[3]!);
    expect(sectionHeading('D')).toBeInTheDocument();
    expect(buttons[3]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves between sections with the select used on phones', async () => {
    const user = userEvent.setup();
    start();
    await user.selectOptions(screen.getByRole('combobox', { name: en.intake.sectionSelect }), '4');
    expect(sectionHeading('E')).toBeInTheDocument();
  });

  it('names each section with its letter and progress for assistive technology', () => {
    start(createMemoryStore(saved({ answers: [known('A1', 'x')] })));
    expect(
      screen.getByRole('button', {
        name: `Section A: ${en.sections.A} 1 of ${perSection} answered Viewing`,
      }),
    ).toBeInTheDocument();
  });

  it('Save and continue goes to the next section, saves, and focuses its heading', async () => {
    const user = userEvent.setup();
    const store = createMemoryStore();
    start(store);
    expect(screen.queryByRole('button', { name: /^Back to Section/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue to Section B' }));
    expect(sectionHeading('B')).toHaveFocus();
    expect(store.load()?.sectionIndex).toBe(1);
    await user.click(screen.getByRole('button', { name: 'Back to Section A' }));
    expect(sectionHeading('A')).toHaveFocus();
  });

  it('ends with a See my report link instead of a next button', () => {
    start(createMemoryStore(saved({ sectionIndex: 5 })));
    expect(screen.getByRole('link', { name: en.intake.nav.seeReport })).toHaveAttribute(
      'href',
      '/report',
    );
    expect(screen.queryByRole('button', { name: /^Save and continue/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to Section E' })).toBeInTheDocument();
  });

  it('explains the evidence tags in a collapsible panel', async () => {
    const user = userEvent.setup();
    start();
    const trigger = screen.getByRole('button', { name: en.intake.evidenceHelp.title });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(en.intake.evidenceHelp.verified)).toBeVisible();
  });
});

describe('IntakePage keyboard use', () => {
  it('completes a whole section with the keyboard alone', async () => {
    const user = userEvent.setup();
    start();
    for (let i = 0; i < perSection; i += 1) {
      const notSure = screen.getAllByRole('button', { name: en.questionCard.notSure })[0];
      notSure?.focus();
      expect(notSure).toHaveFocus();
      await user.keyboard('{Enter}');
    }
    const first = screen.getAllByRole('button', { pressed: true, name: /Marked Unknown/ });
    expect(first).toHaveLength(perSection);
    const aButton = screen.getByRole('button', {
      name: new RegExp(`^Section A: .*${perSection} of ${perSection}`),
    });
    expect(within(aButton).getByText(en.intake.stepStates.done)).toBeInTheDocument();
  });

  it('answers a switch question with Space and then picks its evidence tag with the keyboard', async () => {
    const user = userEvent.setup();
    start();
    const toggle = screen.getAllByRole('switch')[0]!;
    toggle.focus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    const verified = screen.getByRole('radio', { name: en.evidenceTags.verified });
    verified.focus();
    await user.keyboard(' ');
    expect(verified).toBeChecked();
  });
});

describe('IntakePage evidence tags', () => {
  it('starts with no tag selected and asks for one, until the person picks', async () => {
    const user = userEvent.setup();
    start();
    await user.click(screen.getAllByRole('switch')[0]!);
    const group = screen.getByRole('radiogroup', { name: en.questionCard.evidenceHeading });
    expect(within(group).getAllByRole('radio')).toHaveLength(4);
    within(group)
      .getAllByRole('radio')
      .forEach((r) => expect(r).not.toBeChecked());
    expect(screen.getByText(en.questionCard.evidenceMissing)).toBeInTheDocument();

    await user.click(within(group).getByRole('radio', { name: en.evidenceTags.estimate }));
    expect(within(group).getByRole('radio', { name: en.evidenceTags.estimate })).toBeChecked();
    expect(screen.queryByText(en.questionCard.evidenceMissing)).not.toBeInTheDocument();
  });

  it('remembers a confirmed tag after a reload, and still asks for the others', () => {
    start(
      createMemoryStore(
        saved({
          answers: [
            known('A4', true, 'verified', 'high'),
            known('A1', 'private-university', 'institution-reported', 'medium'),
          ],
          confirmedTagIds: ['A4'],
        }),
      ),
    );
    expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1);
    expect(screen.getAllByText(en.questionCard.evidenceMissing)).toHaveLength(1);
  });
});

describe('IntakePage saving', () => {
  it('shows Saving then Saved on this device, after a pause', async () => {
    const user = userEvent.setup();
    const store = start();
    await user.click(screen.getAllByRole('switch')[0]!);
    expect(screen.getByText(en.intake.save.saving)).toBeInTheDocument();
    expect(store.load()).toBeNull();
    expect(
      await screen.findByText(en.intake.save.saved, undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(store.load()?.answers).toHaveLength(1);
    expect(screen.queryByText(/account/i)).not.toBeInTheDocument();
  });

  it('Save now writes at once', async () => {
    const user = userEvent.setup();
    const store = start();
    await user.click(screen.getAllByRole('switch')[0]!);
    await user.click(screen.getByRole('button', { name: en.intake.save.saveNow }));
    expect(screen.getByText(en.intake.save.saved)).toBeInTheDocument();
    expect(store.load()?.answers).toHaveLength(1);
  });

  it('stores answers and the config version, never scores', async () => {
    const user = userEvent.setup();
    const store = start();
    await user.click(screen.getAllByRole('switch')[0]!);
    await user.click(screen.getByRole('button', { name: en.intake.save.saveNow }));
    const stored = store.load();
    expect(Object.keys(stored ?? {}).sort()).toEqual(
      ['answers', 'configVersion', 'confirmedTagIds', 'sectionIndex'].sort(),
    );
    expect(stored?.configVersion).toBe(CONFIG_VERSION);
  });
});

describe('IntakePage resuming', () => {
  it('resumes at the stored section and says so', () => {
    start(createMemoryStore(saved({ sectionIndex: 2, answers: [known('A1', 'x')] })));
    expect(sectionHeading('C')).toBeInTheDocument();
    expect(screen.getByText('Resumed at Section C')).toBeInTheDocument();
    expect(screen.getByText(en.intake.save.saved)).toBeInTheDocument();
  });

  it('keeps answers saved under another config version and shows a notice', () => {
    start(createMemoryStore(saved({ configVersion: 'older', answers: [known('A1', 'x')] })));
    expect(screen.getByText(en.intake.versionNotice)).toBeInTheDocument();
    expect(screen.getAllByText(`1 of ${total} answered`).length).toBeGreaterThan(0);
  });

  it('shows no notice when the version matches', () => {
    start(createMemoryStore(saved({ answers: [known('A1', 'x')] })));
    expect(screen.queryByText(en.intake.versionNotice)).not.toBeInTheDocument();
  });

  it('works when the store cannot read anything', async () => {
    const broken: AnswerStore = { load: () => null, save: () => undefined };
    start(broken);
    await waitFor(() => expect(sectionHeading('A')).toBeInTheDocument());
  });
});

describe('IntakePage pause band', () => {
  it('offers save and exit and the report', () => {
    start();
    expect(screen.getByRole('link', { name: en.intake.pause.exit })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: en.intake.pause.report })).toHaveAttribute(
      'href',
      '/report',
    );
  });
});
