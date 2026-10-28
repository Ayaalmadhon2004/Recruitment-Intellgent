import { describe, expect, it, vi } from 'vitest';
import { CONFIG_VERSION } from '@/domain/config';
import { known } from '../../../tests/fixtures/builders';
import { createMemoryRuntime } from './memory-runtime';
import { isAccountError } from './service/errors';
import { signedInRuntime, signIn, storedWith } from './test-helpers';
import {
  adoptLocalAudit,
  createSyncingStore,
  resumeAudit,
  signOutAndClear,
  startNewAudit,
} from './working-copy';

describe('adoptLocalAudit', () => {
  it('moves the device answers into the account once and remembers the id', async () => {
    const local = storedWith();
    const runtime = await signedInRuntime({ local });
    const result = await adoptLocalAudit(runtime);
    expect(result).toMatchObject({ adopted: true, source: 'intake' });
    const audits = await runtime.service.listAudits();
    expect(audits).toHaveLength(1);
    expect(audits[0]?.stored).toEqual(local);
    expect(runtime.active.get()).toBe(audits[0]?.id);

    // A second sign-in or dashboard visit does not copy it again.
    expect(await adoptLocalAudit(runtime)).toEqual({ adopted: false, reason: 'already-synced' });
    expect(await runtime.service.listAudits()).toHaveLength(1);
  });

  it('moves Quick Start answers when the Intake holds none, and clears the tab copy', async () => {
    const quickStart = [known('B1', 3), known('A1', 'private-university')];
    const runtime = await signedInRuntime({ quickStart });
    const result = await adoptLocalAudit(runtime);
    expect(result).toMatchObject({ adopted: true, source: 'quick-start' });
    const [audit] = await runtime.service.listAudits();
    expect(audit?.stored.answers).toEqual(quickStart);
    expect(audit?.stored.configVersion).toBe(CONFIG_VERSION);
    expect(runtime.quickStart.read()).toBeUndefined();
    // The Report reads the device copy, so the adopted answers stay there.
    expect(runtime.localStore.load()?.answers).toEqual(quickStart);
  });

  it('prefers the Intake answers over Quick Start and never merges them', async () => {
    const local = storedWith([known('B1', 20)]);
    const runtime = await signedInRuntime({ local, quickStart: [known('B1', 2)] });
    await adoptLocalAudit(runtime);
    const [audit] = await runtime.service.listAudits();
    expect(audit?.stored.answers).toEqual([known('B1', 20)]);
  });

  it('does nothing when there is nothing to move', async () => {
    const runtime = await signedInRuntime();
    expect(await adoptLocalAudit(runtime)).toEqual({ adopted: false, reason: 'nothing-to-adopt' });
    expect(await runtime.service.listAudits()).toEqual([]);
  });

  it('treats a pointer to an audit this account does not have as anonymous work', async () => {
    const local = storedWith();
    const runtime = await signedInRuntime({ local });
    runtime.active.set('someone-elses-audit');
    const result = await adoptLocalAudit(runtime);
    expect(result.adopted).toBe(true);
    expect(runtime.active.get()).not.toBe('someone-elses-audit');
  });
});

describe('resumeAudit and startNewAudit', () => {
  it('puts the account audit on the device and points at it', async () => {
    const runtime = await signedInRuntime();
    const saved = await runtime.service.saveAudit({ stored: storedWith([known('B1', 40)]) });
    await resumeAudit(runtime, saved.id);
    expect(runtime.localStore.load()).toEqual(saved.stored);
    expect(runtime.active.get()).toBe(saved.id);
  });

  it('rejects an audit that is not in the account', async () => {
    const runtime = await signedInRuntime();
    await expect(resumeAudit(runtime, 'missing')).rejects.toSatisfy((e) =>
      isAccountError(e, 'not-found'),
    );
  });

  it('starts a new audit from an empty working copy', async () => {
    const runtime = await signedInRuntime({ local: storedWith(), quickStart: [known('B1', 1)] });
    runtime.active.set('id-9');
    startNewAudit(runtime);
    expect(runtime.localStore.load()?.answers).toEqual([]);
    expect(runtime.active.get()).toBeNull();
    expect(runtime.quickStart.read()).toBeUndefined();
  });
});

describe('signOutAndClear', () => {
  it('clears a working copy that belongs to an account audit', async () => {
    const runtime = await signedInRuntime({ local: storedWith() });
    await adoptLocalAudit(runtime);
    await signOutAndClear(runtime);
    expect(await runtime.service.currentUser()).toBeNull();
    expect(runtime.localStore.load()?.answers).toEqual([]);
    expect(runtime.active.get()).toBeNull();
  });

  it('keeps anonymous work', async () => {
    const local = storedWith();
    const runtime = await signedInRuntime({ local });
    await signOutAndClear(runtime);
    expect(runtime.localStore.load()).toEqual(local);
  });
});

describe('createSyncingStore', () => {
  it('writes the device first, then creates the account audit and updates it on later saves', async () => {
    const runtime = await signedInRuntime();
    const { store, settled } = createSyncingStore(runtime);
    const first = storedWith([known('B1', 4)]);
    const second = storedWith([known('B1', 4), known('A1', 'private-university')]);
    store.save(first);
    expect(runtime.localStore.load()).toEqual(first);
    store.save(second);
    await settled();
    const audits = await runtime.service.listAudits();
    expect(audits).toHaveLength(1);
    expect(audits[0]?.stored).toEqual(second);
    expect(runtime.active.get()).toBe(audits[0]?.id);
  });

  it('only keeps the device copy while signed out', async () => {
    const runtime = createMemoryRuntime();
    const { store, settled } = createSyncingStore(runtime);
    const stored = storedWith();
    store.save(stored);
    await settled();
    expect(runtime.localStore.load()).toEqual(stored);
    await signIn(runtime);
    expect(await runtime.service.listAudits()).toEqual([]);
  });

  it('reports a failed sync and forgets an audit that no longer exists', async () => {
    const runtime = await signedInRuntime();
    runtime.active.set('gone');
    const onError = vi.fn();
    const { store, settled } = createSyncingStore(runtime, onError);
    store.save(storedWith());
    await settled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(runtime.active.get()).toBeNull();
    // The device copy was kept.
    expect(runtime.localStore.load()).not.toBeNull();
  });
});
