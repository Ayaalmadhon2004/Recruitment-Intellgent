import { describe, expect, it } from 'vitest';
import { known } from '../../../../tests/fixtures/builders';
import { storedWith } from '../test-helpers';
import { createDevAccountService, DEV_ACCOUNTS_KEY } from './dev-service';
import { isAccountError } from './errors';
import { createMemoryStorage } from './storage';

function service(storage = createMemoryStorage()): ReturnType<typeof createDevAccountService> {
  let n = 0;
  return createDevAccountService({
    getStorage: () => storage,
    newId: () => `id-${(n += 1)}`,
    now: () => new Date('2026-10-25T09:00:00Z'),
  });
}

async function signedIn(s: ReturnType<typeof service>, email = 'a@uni.example'): Promise<void> {
  const { developmentToken } = await s.requestSignInLink(email);
  await s.completeSignIn(developmentToken ?? '');
}

describe('development account service', () => {
  it('signs in with a one-time link and signs out', async () => {
    const s = service();
    expect(await s.currentUser()).toBeNull();
    const { developmentToken, email } = await s.requestSignInLink('  A@Uni.Example ');
    expect(email).toBe('a@uni.example');
    const user = await s.completeSignIn(developmentToken ?? '');
    expect(user.email).toBe('a@uni.example');
    expect(await s.currentUser()).toEqual(user);
    await s.signOut();
    expect(await s.currentUser()).toBeNull();
  });

  it('works once: the same token is refused the second time', async () => {
    const s = service();
    const { developmentToken } = await s.requestSignInLink('a@uni.example');
    await s.completeSignIn(developmentToken ?? '');
    await expect(s.completeSignIn(developmentToken ?? '')).rejects.toSatisfy((e) =>
      isAccountError(e, 'invalid-link'),
    );
  });

  it('rejects a malformed email and an unknown token', async () => {
    const s = service();
    await expect(s.requestSignInLink('not an email')).rejects.toSatisfy((e) =>
      isAccountError(e, 'invalid-email'),
    );
    await expect(s.completeSignIn('nope')).rejects.toSatisfy((e) =>
      isAccountError(e, 'invalid-link'),
    );
  });

  it('keeps the same user id when the same email signs in again', async () => {
    const s = service();
    await signedIn(s);
    const first = await s.currentUser();
    await s.signOut();
    await signedIn(s);
    expect((await s.currentUser())?.id).toBe(first?.id);
  });

  it('refuses audit calls when nobody is signed in', async () => {
    const s = service();
    await expect(s.listAudits()).rejects.toSatisfy((e) => isAccountError(e, 'not-signed-in'));
    await expect(s.saveAudit({ stored: storedWith() })).rejects.toSatisfy((e) =>
      isAccountError(e, 'not-signed-in'),
    );
  });

  it('round-trips an audit: create, list, get, update', async () => {
    const s = service();
    await signedIn(s);
    const created = await s.saveAudit({ stored: storedWith() });
    expect(created.id).toBe('id-3');
    expect(created.updatedAt).toBe('2026-10-25T09:00:00.000Z');
    expect(created.institutionName).toBeNull();
    expect(await s.listAudits()).toEqual([created]);
    expect(await s.getAudit(created.id)).toEqual(created);

    const more = storedWith([known('B1', 12)]);
    const updated = await s.saveAudit({ id: created.id, stored: more });
    expect(updated.id).toBe(created.id);
    expect((await s.listAudits()).map((a) => a.stored.answers.length)).toEqual([1]);
  });

  it('keeps audits private to their owner', async () => {
    const storage = createMemoryStorage();
    const s = service(storage);
    await signedIn(s, 'a@uni.example');
    const mine = await s.saveAudit({ stored: storedWith() });
    await s.signOut();
    await signedIn(s, 'b@uni.example');
    expect(await s.listAudits()).toEqual([]);
    expect(await s.getAudit(mine.id)).toBeNull();
    await expect(s.saveAudit({ id: mine.id, stored: storedWith() })).rejects.toSatisfy((e) =>
      isAccountError(e, 'not-found'),
    );
  });

  it('stores answers and the config version, never a score, stage or status', async () => {
    const storage = createMemoryStorage();
    const s = service(storage);
    await signedIn(s);
    await s.saveAudit({ stored: storedWith() });
    const raw = storage.getItem(DEV_ACCOUNTS_KEY) ?? '';
    const audit = (JSON.parse(raw) as { audits: Record<string, unknown>[] }).audits[0] ?? {};
    expect(Object.keys(audit).sort()).toEqual([
      'id',
      'institutionName',
      'stored',
      'updatedAt',
      'userId',
    ]);
    expect(Object.keys(audit.stored as object).sort()).toEqual([
      'answers',
      'configVersion',
      'confirmedTagIds',
      'sectionIndex',
    ]);
  });

  it('drops unreadable stored data instead of failing', async () => {
    const storage = createMemoryStorage();
    storage.setItem(DEV_ACCOUNTS_KEY, '{broken');
    const s = service(storage);
    expect(await s.currentUser()).toBeNull();
    storage.setItem(
      DEV_ACCOUNTS_KEY,
      JSON.stringify({ session: { id: 'u', email: 'a@b.example' }, audits: [{ id: 1 }, 'x'] }),
    );
    expect(await s.currentUser()).toEqual({ id: 'u', email: 'a@b.example' });
    expect(await s.listAudits()).toEqual([]);
  });

  it('says unavailable when there is no storage', async () => {
    const s = createDevAccountService({ getStorage: () => undefined });
    await expect(s.currentUser()).rejects.toSatisfy((e) => isAccountError(e, 'unavailable'));
  });
});
