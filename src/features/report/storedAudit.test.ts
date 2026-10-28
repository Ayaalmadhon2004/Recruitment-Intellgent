import { beforeEach, describe, expect, it } from 'vitest';
import { known } from '@/fixtures/builders';
import { createLocalStorageStore, LOCAL_AUDIT_ID } from '@/features/intake';
import { DEV_ENTITLEMENTS_KEY } from '@/features/unlock';
import { loadDeviceAudit } from './storedAudit';

beforeEach(() => window.localStorage.clear());

function storeAnswers(): void {
  createLocalStorageStore().save({
    configVersion: 'v',
    answers: [known('A1', 'private-university')],
    confirmedTagIds: [],
    sectionIndex: 0,
  });
}

describe('loadDeviceAudit entitlement', () => {
  it('is free until the device audit is unlocked', () => {
    storeAnswers();
    expect(loadDeviceAudit()?.entitlement).toBe('free');
  });

  it('is unlocked after a grant for the working copy, and for no other key', () => {
    storeAnswers();
    window.localStorage.setItem(
      DEV_ENTITLEMENTS_KEY,
      JSON.stringify({ grants: { [LOCAL_AUDIT_ID]: { pathId: 'p', grantedAt: 'x' } } }),
    );
    expect(loadDeviceAudit()?.entitlement).toBe('unlocked');
    window.localStorage.setItem('vri.accounts.active.v1', 'account-audit-1');
    expect(loadDeviceAudit()?.entitlement).toBe('free');
  });

  it('has no audit without answers', () => {
    expect(loadDeviceAudit()).toBeNull();
  });
});
