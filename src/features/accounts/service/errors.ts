export type AccountErrorCode =
  'invalid-email' | 'invalid-link' | 'not-signed-in' | 'not-found' | 'unavailable';

/** What a service throws. The UI maps the code to words from copy; it never shows `message`. */
export class AccountError extends Error {
  readonly code: AccountErrorCode;

  constructor(code: AccountErrorCode) {
    super(code);
    this.name = 'AccountError';
    this.code = code;
  }
}

export const isAccountError = (error: unknown, code?: AccountErrorCode): error is AccountError =>
  error instanceof AccountError && (code === undefined || error.code === code);
