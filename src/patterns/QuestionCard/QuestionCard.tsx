import { useId, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { AnswerValue, KnownEvidenceTag, QuestionId } from '@/domain/types';
import { Field, Icon, Select, cx } from '@/ui';
import type { IconName } from '@/ui';
import styles from './QuestionCard.module.css';

export type QuestionView = {
  id: QuestionId;
  type: 'select' | 'radio' | 'chips' | 'number' | 'toggle';
  text: string;
  help: string;
  /** Label of the select or number control. Falls back to the question text. */
  controlLabel?: string;
  /** Number questions. */
  unit?: string;
  /** Number questions. */
  placeholder?: string;
  /** Select, radio and chips. */
  options?: readonly { value: string; label: string; description?: string }[];
};

export type QuestionCardLabels = {
  status: { answered: string; unknown: string; todo: string };
  notSure: string;
  notSureActive: string;
  unknownNote: string;
  todoHint: string;
  choose: string;
  yes: string;
  no: string;
  notAnswered: string;
  evidence?: { heading: string; missing: string; tags: Record<KnownEvidenceTag, string> };
};

export type QuestionCardProps = {
  question: QuestionView;
  /** undefined = not answered. */
  value: AnswerValue | undefined;
  /** The answer is "Not sure". */
  unsure?: boolean;
  onChange: (value: AnswerValue) => void;
  /** When provided, the "Not sure" button is shown (it toggles). */
  onUnsure?: () => void;
  /** Only the full Intake passes this. Omit for no evidence picker. */
  evidence?: {
    value: KnownEvidenceTag | undefined;
    onChange: (tag: KnownEvidenceTag) => void;
  };
  labels: QuestionCardLabels;
  headingLevel?: 'h2' | 'h3';
};

type Status = 'answered' | 'unknown' | 'todo';

const statusIcon: Record<Status, IconName> = {
  answered: 'check-circle',
  unknown: 'help',
  todo: 'circle-dashed',
};

function statusOf(unsure: boolean, value: AnswerValue | undefined): Status {
  if (unsure) return 'unknown';
  return isAnswered(value) ? 'answered' : 'todo';
}

function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === 'string') return value !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

type ControlProps = {
  question: QuestionView;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  labels: QuestionCardLabels;
  titleId: string;
};

function RadioControl({ question, value, onChange, titleId }: ControlProps): ReactNode {
  const name = useId();
  return (
    <div role="radiogroup" aria-labelledby={titleId} className={styles.radios}>
      {(question.options ?? []).map((o) => {
        const on = value === o.value;
        return (
          <label key={o.value} className={cx(styles.radioCard, on && styles.radioCardOn)}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={on}
              onChange={() => onChange(o.value)}
              className={styles.radioInput}
            />
            <span className={styles.optionText}>
              <span className={styles.optionLabel}>{o.label}</span>
              {o.description ? (
                <span className={styles.optionDescription}>{o.description}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function SelectControl({ question, value, onChange, labels }: ControlProps): ReactNode {
  return (
    <div className={styles.selectWrap}>
      <Select
        label={question.controlLabel ?? question.text}
        placeholder={labels.choose}
        options={question.options ?? []}
        value={typeof value === 'string' ? value : ''}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          if (e.target.value !== '') onChange(e.target.value);
        }}
      />
    </div>
  );
}

function ChipsControl({ question, value, onChange, titleId }: ControlProps): ReactNode {
  const current: readonly string[] = Array.isArray(value) ? (value as readonly string[]) : [];
  return (
    <div role="group" aria-labelledby={titleId} className={styles.pills}>
      {(question.options ?? []).map((o) => {
        const on = current.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            className={cx(styles.pill, on && styles.chipOn)}
            onClick={() =>
              onChange(on ? current.filter((v) => v !== o.value) : [...current, o.value])
            }
          >
            {on ? <Icon name="check" size={16} strokeWidth={3} /> : null}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Accepts a non-negative decimal being typed: "12", "1.", ".5" or "". Rejects "-5", "1e3" and "abc".
const numberPattern = /^\d*\.?\d*$/;

function NumberControl({ question, value, onChange }: ControlProps): ReactNode {
  const [draft, setDraft] = useState(typeof value === 'number' ? String(value) : '');
  const [seen, setSeen] = useState(value);
  // Follow an outside change (reset, loaded answer) without fighting what the person is typing.
  if (value !== seen) {
    setSeen(value);
    if (typeof value === 'number' && value !== Number(draft)) setDraft(String(value));
  }

  const handle = (e: ChangeEvent<HTMLInputElement>): void => {
    const next = e.target.value;
    if (!numberPattern.test(next)) return;
    setDraft(next);
    const n = Number(next);
    if (next !== '' && next !== '.' && Number.isFinite(n) && n >= 0) onChange(n);
  };

  return (
    <div className={styles.numberRow}>
      <div className={styles.numberField}>
        <Field
          label={question.controlLabel ?? question.text}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft}
          placeholder={question.placeholder}
          onChange={handle}
        />
      </div>
      {question.unit ? <span className={styles.unit}>{question.unit}</span> : null}
    </div>
  );
}

function toggleText(value: AnswerValue | undefined, labels: QuestionCardLabels): string {
  if (value === true) return labels.yes;
  if (value === false) return labels.no;
  return labels.notAnswered;
}

function ToggleControl({ value, onChange, labels, titleId }: ControlProps): ReactNode {
  const on = value === true;
  const text = toggleText(value, labels);
  return (
    <div className={styles.toggleRow}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={titleId}
        className={cx(styles.track, on && styles.trackOn)}
        onClick={() => onChange(!on)}
      >
        <span className={styles.knob} />
      </button>
      <span className={styles.toggleText}>{text}</span>
    </div>
  );
}

const controls = {
  radio: RadioControl,
  select: SelectControl,
  chips: ChipsControl,
  number: NumberControl,
  toggle: ToggleControl,
} satisfies Record<QuestionView['type'], (props: ControlProps) => ReactNode>;

type EvidencePickerProps = {
  questionId: QuestionId;
  evidence: NonNullable<QuestionCardProps['evidence']>;
  labels: NonNullable<QuestionCardLabels['evidence']>;
};

function EvidencePicker({ evidence, labels }: EvidencePickerProps): ReactNode {
  const headingId = useId();
  const name = useId();
  const tags = Object.keys(labels.tags) as KnownEvidenceTag[];
  return (
    <>
      <span id={headingId} className={styles.evidenceHeading}>
        {labels.heading}
      </span>
      <div role="radiogroup" aria-labelledby={headingId} className={styles.pills}>
        {tags.map((tag) => {
          const on = evidence.value === tag;
          return (
            <label key={tag} className={cx(styles.pill, on && styles.evidenceOn)}>
              <input
                type="radio"
                name={name}
                value={tag}
                checked={on}
                onChange={() => evidence.onChange(tag)}
                className={styles.pillInput}
              />
              {on ? <Icon name="check" size={16} strokeWidth={3} /> : null}
              <span>{labels.tags[tag]}</span>
            </label>
          );
        })}
      </div>
      {evidence.value === undefined ? (
        <span className={styles.missing}>
          <Icon name="alert" size={16} strokeWidth={2.4} />
          {labels.missing}
        </span>
      ) : null}
    </>
  );
}

/** One card for every question type. Used by Quick Start and the full Intake. */
export function QuestionCard({
  question,
  value,
  unsure = false,
  onChange,
  onUnsure,
  evidence,
  labels,
  headingLevel = 'h3',
}: QuestionCardProps): ReactNode {
  const titleId = useId();
  const Heading = headingLevel;
  const status = statusOf(unsure, value);
  const Control = controls[question.type];
  const showEvidence =
    evidence !== undefined && labels.evidence !== undefined && status === 'answered';
  const showFooter = showEvidence || status !== 'answered' || onUnsure !== undefined;

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titleBlock}>
          <span className={styles.idBadge}>{question.id}</span>
          <div className={styles.titles}>
            <Heading id={titleId} className={styles.text}>
              {question.text}
            </Heading>
            <p className={styles.help}>{question.help}</p>
          </div>
        </div>
        <span className={cx(styles.status, styles[status])}>
          <Icon name={statusIcon[status]} size={16} strokeWidth={2.6} />
          <span>{labels.status[status]}</span>
        </span>
      </div>

      <div className={cx(styles.control, unsure && styles.dimmed)}>
        <Control
          question={question}
          value={value}
          onChange={onChange}
          labels={labels}
          titleId={titleId}
        />
      </div>

      {showFooter ? (
        <div className={styles.footer}>
          <div className={styles.footerMain}>
            {showEvidence && evidence && labels.evidence ? (
              <EvidencePicker
                questionId={question.id}
                evidence={evidence}
                labels={labels.evidence}
              />
            ) : null}
            {status === 'unknown' ? (
              <div className={styles.note}>
                <span className={styles.noteIcon}>
                  <Icon name="info" size={20} />
                </span>
                <span>{labels.unknownNote}</span>
              </div>
            ) : null}
            {status === 'todo' && onUnsure ? (
              <span className={styles.hint}>{labels.todoHint}</span>
            ) : null}
          </div>
          {onUnsure ? (
            <button
              type="button"
              aria-pressed={unsure}
              className={cx(styles.notSure, unsure && styles.notSureOn)}
              onClick={onUnsure}
            >
              <Icon name="help" size={18} strokeWidth={2.4} />
              <span>{unsure ? labels.notSureActive : labels.notSure}</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
