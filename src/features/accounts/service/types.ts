import type { AccountUser, SaveAuditInput, SavedAudit, SignInLinkResult } from '../types';

/**
 * Who the person is. A real provider (open item 7) implements this; the screens do not change.
 * Methods reject with `AccountError` for expected problems and with anything else for outages.
 */
export interface AuthGateway {
  /** Starts a passwordless sign-in. Must not reveal whether the email already has an account. */
  requestSignInLink(email: string): Promise<SignInLinkResult>;
  /** Finishes sign-in with the token from the link. A token works once. */
  completeSignIn(token: string): Promise<AccountUser>;
  /** The signed-in person, or null. Never rejects for "nobody signed in". */
  currentUser(): Promise<AccountUser | null>;
  signOut(): Promise<void>;
}

/**
 * The signed-in person's audits. Answers plus config version only; scores are never stored.
 * Every method rejects with `AccountError('not-signed-in')` when nobody is signed in.
 */
export interface AuditRepository {
  listAudits(): Promise<SavedAudit[]>;
  /** Null when the id is unknown or belongs to someone else. */
  getAudit(id: string): Promise<SavedAudit | null>;
  /** Creates (no id) or replaces (id) an audit and returns it with its new `updatedAt`. */
  saveAudit(input: SaveAuditInput): Promise<SavedAudit>;
}

export interface AccountService extends AuthGateway, AuditRepository {}
