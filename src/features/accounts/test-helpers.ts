import { CONFIG_VERSION } from '@/domain/config';
import type { StoredAudit } from '@/features/intake';
import { known, unknown } from '../../../tests/fixtures/builders';
import { createMemoryRuntime } from './memory-runtime';
import type { MemoryRuntimeOptions } from './memory-runtime';
import type { AccountsRuntime } from './runtime';

export const EMAIL = 'tester@university.example';

/** A stored audit with the given number of answers (B1 first, so the stage can be computed). */
export function storedWith(
  answers = [known('B1', 9), known('A1', 'private-university'), unknown('C1')],
  configVersion: string = CONFIG_VERSION,
): StoredAudit {
  return { configVersion, answers, confirmedTagIds: [], sectionIndex: 1 };
}

export async function signIn(runtime: AccountsRuntime, email = EMAIL): Promise<void> {
  const { developmentToken } = await runtime.service.requestSignInLink(email);
  await runtime.service.completeSignIn(developmentToken ?? '');
}

/** A memory runtime with someone already signed in. Ids are predictable: id-1, id-2, ... */
export async function signedInRuntime(
  options: MemoryRuntimeOptions = {},
): Promise<AccountsRuntime> {
  let n = 0;
  const runtime = createMemoryRuntime({ newId: () => `id-${(n += 1)}`, ...options });
  await signIn(runtime);
  return runtime;
}
