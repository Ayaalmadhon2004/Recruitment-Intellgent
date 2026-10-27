import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { AnswerValue, KnownEvidenceTag } from '@/domain/types';
import { questionCardLabels as labels, sampleQuestions } from '@/fixtures/questionCard';
import { QuestionCard } from './QuestionCard';
import type { QuestionCardProps, QuestionView } from './QuestionCard';

const OPTION_TWO = 'Option twoSecond description';
const RADIO_COUNT = 3;
const TAG_COUNT = 4;
const ENROLMENT = 120;
const LOADED = 42;
const TYPED = 5;
const ONCE = 1;
const TWICE = 2;

function setup(
  type: QuestionView['type'],
  props: Partial<QuestionCardProps> = {},
): { onChange: ReturnType<typeof vi.fn> } {
  const onChange = vi.fn();
  render(
    <QuestionCard
      question={sampleQuestions[type]}
      value={undefined}
      onChange={onChange}
      labels={labels}
      {...props}
    />,
  );
  return { onChange };
}

function Stateful({ type }: { type: QuestionView['type'] }): React.ReactNode {
  const [value, setValue] = useState<AnswerValue | undefined>(undefined);
  return (
    <QuestionCard
      question={sampleQuestions[type]}
      value={value}
      onChange={setValue}
      labels={labels}
    />
  );
}

describe('QuestionCard select', () => {
  it('is labelled by its control label and reports the chosen value', async () => {
    const { onChange } = setup('select');
    const select = screen.getByRole('combobox', { name: 'Institution type' });
    await userEvent.selectOptions(select, 'other');
    expect(onChange).toHaveBeenCalledWith('other');
  });

  it('starts on the placeholder when empty', () => {
    setup('select');
    expect(screen.getByRole('option', { name: labels.choose })).toBeInTheDocument();
  });
});

describe('QuestionCard radio', () => {
  it('is a radiogroup named by the question text', () => {
    setup('radio');
    const group = screen.getByRole('radiogroup', { name: sampleQuestions.radio.text });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(RADIO_COUNT);
  });

  it('reports the option value and moves with arrow keys', async () => {
    const user = userEvent.setup();
    const { onChange } = setup('radio');
    await user.click(screen.getByRole('radio', { name: OPTION_TWO }));
    expect(onChange).toHaveBeenLastCalledWith('two');
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('three');
  });

  it('marks the current option checked', () => {
    setup('radio', { value: 'two' });
    expect(screen.getByRole('radio', { name: OPTION_TWO })).toBeChecked();
  });
});

describe('QuestionCard chips', () => {
  it('is a group named by the question text', () => {
    setup('chips');
    expect(screen.getByRole('group', { name: sampleQuestions.chips.text })).toBeInTheDocument();
  });

  it('adds a chip to the existing selection', async () => {
    const { onChange } = setup('chips', { value: ['bachelor'] });
    await userEvent.click(screen.getByRole('button', { name: 'Master' }));
    expect(onChange).toHaveBeenCalledWith(['bachelor', 'master']);
  });

  it('removes a chip that is already on', async () => {
    const { onChange } = setup('chips', { value: ['bachelor', 'master'] });
    const chip = screen.getByRole('button', { name: 'Bachelor' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(chip);
    expect(onChange).toHaveBeenCalledWith(['master']);
  });

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup();
    const { onChange } = setup('chips');
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(['bachelor']);
  });
});

describe('QuestionCard number', () => {
  it('is labelled by its control label and shows the unit', () => {
    setup('number');
    expect(screen.getByRole('textbox', { name: 'Students per year' })).toBeInTheDocument();
    expect(screen.getByText('students')).toBeInTheDocument();
  });

  it('calls onChange with a number', async () => {
    const { onChange } = setup('number');
    await userEvent.type(screen.getByRole('textbox'), String(ENROLMENT));
    expect(onChange).toHaveBeenLastCalledWith(ENROLMENT);
  });

  it('lets a decimal be typed through "1." and ends on 1.5', async () => {
    render(<Stateful type="number" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '1.5');
    expect(input).toHaveValue('1.5');
  });

  it('rejects negative and non-numeric input', async () => {
    const { onChange } = setup('number');
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '-5abc');
    expect(input).toHaveValue('5');
    expect(onChange).toHaveBeenCalledTimes(ONCE);
    expect(onChange).toHaveBeenCalledWith(TYPED);
  });

  it('does not call onChange for an empty or lone-dot value', async () => {
    const { onChange } = setup('number');
    await userEvent.type(screen.getByRole('textbox'), '.');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows an outside value', () => {
    setup('number', { value: LOADED });
    expect(screen.getByRole('textbox')).toHaveValue(String(LOADED));
  });
});

describe('QuestionCard toggle', () => {
  it('is a switch named by the question text', () => {
    setup('toggle');
    const sw = screen.getByRole('switch', { name: sampleQuestions.toggle.text });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(labels.notAnswered)).toBeInTheDocument();
  });

  it.each([['{Enter}'], [' ']])('turns on with the key %j', async (key) => {
    const user = userEvent.setup();
    const { onChange } = setup('toggle');
    await user.tab();
    await user.keyboard(key);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('turns off from on and shows Yes or No', async () => {
    const { onChange } = setup('toggle', { value: true });
    expect(screen.getByText(labels.yes)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('shows No for false', () => {
    setup('toggle', { value: false });
    expect(screen.getByText(labels.no)).toBeInTheDocument();
  });
});

describe('QuestionCard status and Not sure', () => {
  it('shows To do when empty', () => {
    setup('select');
    expect(screen.getByText(labels.status.todo)).toBeInTheDocument();
  });

  it('shows Answered when there is a value', () => {
    setup('select', { value: 'other' });
    expect(screen.getByText(labels.status.answered)).toBeInTheDocument();
  });

  it('treats an empty chip selection as not answered', () => {
    setup('chips', { value: [] });
    expect(screen.getByText(labels.status.todo)).toBeInTheDocument();
  });

  it('shows Unknown and the note when unsure', () => {
    setup('select', { unsure: true, onUnsure: () => undefined });
    expect(screen.getByText(labels.status.unknown)).toBeInTheDocument();
    expect(screen.getByText(labels.unknownNote)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: labels.notSureActive })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('has no Not sure button without onUnsure', () => {
    setup('select');
    expect(screen.queryByRole('button', { name: labels.notSure })).not.toBeInTheDocument();
    expect(screen.queryByText(labels.todoHint)).not.toBeInTheDocument();
  });

  it('calls onUnsure from the button, by mouse and keyboard', async () => {
    const user = userEvent.setup();
    const onUnsure = vi.fn();
    setup('number', { onUnsure });
    expect(screen.getByText(labels.todoHint)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: labels.notSure }));
    expect(onUnsure).toHaveBeenCalledTimes(ONCE);
    screen.getByRole('button', { name: labels.notSure }).focus();
    await user.keyboard('{Enter}');
    expect(onUnsure).toHaveBeenCalledTimes(TWICE);
  });

  it('keeps the control usable while unsure', async () => {
    const { onChange } = setup('toggle', { unsure: true });
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('QuestionCard evidence picker', () => {
  it('is absent without the evidence prop', () => {
    setup('select', { value: 'other' });
    expect(screen.queryByText(labels.evidence?.heading ?? '')).not.toBeInTheDocument();
  });

  it('is absent until the question is answered', () => {
    setup('select', { evidence: { value: undefined, onChange: () => undefined } });
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('is a radiogroup with every tag and a missing hint', () => {
    setup('select', { value: 'other', evidence: { value: undefined, onChange: () => undefined } });
    const group = screen.getByRole('radiogroup', { name: labels.evidence?.heading });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(TAG_COUNT);
    expect(screen.getByText(labels.evidence?.missing ?? '')).toBeInTheDocument();
  });

  it('works by keyboard and hides the missing hint once chosen', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(tag: KnownEvidenceTag) => void>();
    setup('select', { value: 'other', evidence: { value: 'verified', onChange } });
    expect(screen.queryByText(labels.evidence?.missing ?? '')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Verified' })).toBeChecked();
    screen.getByRole('radio', { name: 'Verified' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('institution-reported');
  });

  it('is hidden while the answer is Not sure', () => {
    setup('select', {
      value: 'other',
      unsure: true,
      evidence: { value: undefined, onChange: () => undefined },
    });
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });
});

describe('QuestionCard heading', () => {
  it('defaults to h3 and can be h2', () => {
    const { unmount } = render(
      <QuestionCard
        question={sampleQuestions.toggle}
        value={undefined}
        onChange={() => undefined}
        labels={labels}
      />,
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      sampleQuestions.toggle.text,
    );
    unmount();
    render(
      <QuestionCard
        question={sampleQuestions.toggle}
        value={undefined}
        onChange={() => undefined}
        labels={labels}
        headingLevel="h2"
      />,
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
