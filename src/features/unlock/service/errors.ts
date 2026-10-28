export type UnlockErrorCode = 'unknown-path' | 'unavailable';

/** What a service throws. The UI maps the code to words from copy; it never shows `message`. */
export class UnlockError extends Error {
  readonly code: UnlockErrorCode;

  constructor(code: UnlockErrorCode) {
    super(code);
    this.name = 'UnlockError';
    this.code = code;
  }
}

export const isUnlockError = (error: unknown, code?: UnlockErrorCode): error is UnlockError =>
  error instanceof UnlockError && (code === undefined || error.code === code);
