import { parseStoredAudit } from '@/features/intake';
import type { AccountUser, SaveAuditInput, SavedAudit, SignInLinkResult } from '../types';
import { normaliseEmail, isValidEmail } from '../email';
import { AccountError } from './errors';
import { browserStorage } from './storage';
import type { KeyValueStorage } from './storage';
import type { AccountService } from './types';

/**
 * DEVELOPMENT account service. Not an account system.
 *
 * Users, audits and the session live in this browser's localStorage. No email is sent, nothing is verified,
 * and anyone at the keyboard can read it. It exists so the Sign in and Dashboard screens can be built and
 * tested before the database and auth provider are chosen (open item 7, docs/DECISIONS.md 6). A real
 * provider implements `AccountService` and replaces it; no component changes.
 */

export const DEV_ACCOUNTS_KEY = 'vri.accounts.dev.v1';
const MAX_PENDING_LINKS = 20;

type DevAudit = SavedAudit & { readonly userId: string };
type DevLink = { readonly token: string; readonly email: string };
type DevState = {
  session: AccountUser | null;
  users: AccountUser[];
  links: DevLink[];
  audits: DevAudit[];
};

export type DevAccountServiceOptions = {
  /** Where the state is kept. Defaults to the browser's localStorage. */
  getStorage?: () => KeyValueStorage | undefined;
  now?: () => Date;
  newId?: () => string;
  key?: string;
};

const emptyState = (): DevState => ({ session: null, users: [], links: [], audits: [] });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isUser = (value: unknown): value is AccountUser =>
  isRecord(value) && typeof value.id === 'string' && typeof value.email === 'string';

function parseAudit(value: unknown): DevAudit | null {
  if (!isRecord(value)) return null;
  const stored = parseStoredAudit(value.stored);
  const { id, userId, updatedAt, institutionName } = value;
  if (
    stored === null ||
    typeof id !== 'string' ||
    typeof userId !== 'string' ||
    typeof updatedAt !== 'string' ||
    (institutionName !== null && typeof institutionName !== 'string')
  ) {
    return null;
  }
  return { id, userId, updatedAt, institutionName, stored };
}

/** Anything unreadable is dropped, so a corrupt entry never blocks the screens. */
function parseState(raw: unknown): DevState {
  if (!isRecord(raw)) return emptyState();
  const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
  return {
    session: isUser(raw.session) ? raw.session : null,
    users: list(raw.users).filter(isUser),
    links: list(raw.links).filter(
      (l): l is DevLink =>
        isRecord(l) && typeof l.token === 'string' && typeof l.email === 'string',
    ),
    audits: list(raw.audits)
      .map(parseAudit)
      .filter((a): a is DevAudit => a !== null),
  };
}

const randomId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const publicAudit = ({ userId: _userId, ...audit }: DevAudit): SavedAudit => audit;

export function createDevAccountService({
  getStorage = browserStorage,
  now = () => new Date(),
  newId = randomId,
  key = DEV_ACCOUNTS_KEY,
}: DevAccountServiceOptions = {}): AccountService {
  const read = (): DevState => {
    const storage = getStorage();
    if (!storage) throw new AccountError('unavailable');
    try {
      const text = storage.getItem(key);
      return text ? parseState(JSON.parse(text)) : emptyState();
    } catch {
      return emptyState();
    }
  };

  const write = (state: DevState): void => {
    const storage = getStorage();
    if (!storage) throw new AccountError('unavailable');
    try {
      storage.setItem(key, JSON.stringify(state));
    } catch {
      throw new AccountError('unavailable');
    }
  };

  const signedIn = (state: DevState): AccountUser => {
    if (!state.session) throw new AccountError('not-signed-in');
    return state.session;
  };

  return {
    async requestSignInLink(email: string): Promise<SignInLinkResult> {
      const clean = normaliseEmail(email);
      if (!isValidEmail(clean)) throw new AccountError('invalid-email');
      const state = read();
      const token = newId();
      state.links = [
        ...state.links.filter((l) => l.email !== clean),
        { token, email: clean },
      ].slice(-MAX_PENDING_LINKS);
      write(state);
      return { email: clean, developmentToken: token };
    },

    async completeSignIn(token: string): Promise<AccountUser> {
      const state = read();
      const link = state.links.find((l) => l.token === token);
      if (!link) throw new AccountError('invalid-link');
      // A token works once.
      state.links = state.links.filter((l) => l.token !== token);
      let user = state.users.find((u) => u.email === link.email);
      if (!user) {
        user = { id: newId(), email: link.email };
        state.users.push(user);
      }
      state.session = user;
      write(state);
      return user;
    },

    async currentUser(): Promise<AccountUser | null> {
      return read().session;
    },

    async signOut(): Promise<void> {
      const state = read();
      state.session = null;
      write(state);
    },

    async listAudits(): Promise<SavedAudit[]> {
      const state = read();
      const user = signedIn(state);
      return state.audits.filter((a) => a.userId === user.id).map(publicAudit);
    },

    async getAudit(id: string): Promise<SavedAudit | null> {
      const state = read();
      const user = signedIn(state);
      const found = state.audits.find((a) => a.id === id && a.userId === user.id);
      return found ? publicAudit(found) : null;
    },

    async saveAudit(input: SaveAuditInput): Promise<SavedAudit> {
      const state = read();
      const user = signedIn(state);
      const updatedAt = now().toISOString();
      const existing =
        input.id === undefined
          ? undefined
          : state.audits.find((a) => a.id === input.id && a.userId === user.id);
      if (input.id !== undefined && !existing) throw new AccountError('not-found');
      const saved: DevAudit = {
        id: existing?.id ?? newId(),
        userId: user.id,
        institutionName: input.institutionName ?? existing?.institutionName ?? null,
        stored: input.stored,
        updatedAt,
      };
      state.audits = existing
        ? state.audits.map((a) => (a === existing ? saved : a))
        : [...state.audits, saved];
      write(state);
      return publicAudit(saved);
    },
  };
}
