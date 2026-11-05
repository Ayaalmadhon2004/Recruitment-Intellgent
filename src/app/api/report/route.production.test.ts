import { describe, expect, it, vi } from 'vitest';
import type { ReportModel } from '@/features/report/contract';
import { northbridge } from '../../../../tests/fixtures/northbridge';
import { POST } from './route';

// A production build without the development services: there is no store to check an unlock against.
vi.mock('@/domain/config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/domain/config')>()),
  devServicesEnabled: false,
}));

describe('POST /api/report in a production build', () => {
  it('does not believe a claimed unlock', async () => {
    const res = await POST(
      new Request('http://localhost/api/report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ audit: { ...northbridge.audit, entitlement: 'unlocked' } }),
      }),
    );
    expect(res.status).toBe(200);
    expect(((await res.json()) as ReportModel).unlocked).toBe(false);
  });
});
