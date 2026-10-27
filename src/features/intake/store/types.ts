import type { Answer, QuestionId } from '@/domain/types';

/**
 * What the Intake keeps between visits: answers and the config version they were given under. Scores are
 * never stored (they are computed on the server from answers plus config).
 */
export type StoredAudit = {
  configVersion: string;
  answers: Answer[];
  /** Questions where the person picked an evidence tag themselves (the others carry the default tag). */
  confirmedTagIds: QuestionId[];
  /** Zero-based index of the section being shown, so the audit resumes where it stopped. */
  sectionIndex: number;
};

/**
 * Where the Intake keeps its progress. Today this is the browser (no accounts yet). Feature 5 can supply a
 * database-backed implementation without touching any component.
 */
export interface AnswerStore {
  /** The saved audit, or null when there is none or it cannot be read. Never throws. */
  load(): StoredAudit | null;
  /** Never throws: a store that cannot write drops the save. */
  save(stored: StoredAudit): void;
}
