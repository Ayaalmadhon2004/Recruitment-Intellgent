import { describe, expect, it } from 'vitest';
import { createMemoryStorage } from '@/features/accounts';
import { createDevEntitlementService, readStoredEntitlement } from './dev-service';
import { isUnlockError } from './errors';

const NOW = new Date('2026-10-28T10:00:00Z');

function setup(known: readonly string[] = ['p1', 'p2']) {
  const storage = createMemoryStorage();
  const service = createDevEntitlementService({
    getStorage: () => storage,
    now: () => NOW,
    knownPathIds: () => known,
  });
  return { storage, service };
}

describe('development entitlement service', () => {
  it('reads free for an audit that was never unlocked', async () => {
    const { service } = setup();
    expect(await service.getEntitlement('a1')).toEqual({
      entitlement: 'free',
      pathId: null,
      grantedAt: null,
    });
  });

  it('unlocks one audit and leaves the others free (round trip)', async () => {
    const { service, storage } = setup();
    const record = await service.requestUnlock({ auditKey: 'a1', pathId: 'p1' });
    expect(record).toEqual({
      entitlement: 'unlocked',
      pathId: 'p1',
      grantedAt: NOW.toISOString(),
    });
    expect((await service.getEntitlement('a1')).entitlement).toBe('unlocked');
    expect((await service.getEntitlement('a2')).entitlement).toBe('free');
    expect(readStoredEntitlement('a1', () => storage).entitlement).toBe('unlocked');
    expect(readStoredEntitlement('a2', () => storage).entitlement).toBe('free');
  });

  it('rejects a path it does not know and stores nothing', async () => {
    const { service } = setup();
    const error = await service
      .requestUnlock({ auditKey: 'a1', pathId: 'nope' })
      .catch((e: unknown) => e);
    expect(isUnlockError(error, 'unknown-path')).toBe(true);
    expect((await service.getEntitlement('a1')).entitlement).toBe('free');
  });

  it('keeps the first grant when asked again', async () => {
    const { service } = setup();
    await service.requestUnlock({ auditKey: 'a1', pathId: 'p1' });
    const again = await service.requestUnlock({ auditKey: 'a1', pathId: 'p2' });
    expect(again.pathId).toBe('p1');
  });

  it('reads corrupt storage as free', () => {
    const storage = createMemoryStorage();
    storage.setItem('vri.unlock.dev.v1', '{not json');
    expect(readStoredEntitlement('a1', () => storage).entitlement).toBe('free');
  });

  it('reports unavailable when there is no storage', async () => {
    const service = createDevEntitlementService({ getStorage: () => undefined });
    const error = await service.getEntitlement('a1').catch((e: unknown) => e);
    expect(isUnlockError(error, 'unavailable')).toBe(true);
    expect(readStoredEntitlement('a1', () => undefined).entitlement).toBe('free');
  });
});
