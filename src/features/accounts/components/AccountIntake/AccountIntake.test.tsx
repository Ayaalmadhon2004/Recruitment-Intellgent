import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { createMemoryRuntime } from '../../memory-runtime';
import { signedInRuntime } from '../../test-helpers';
import { AccountIntake } from './AccountIntake';

const copy = en.questionCard;

async function answerFirstQuestionNotSure(): Promise<void> {
  const [first] = await screen.findAllByRole('button', { name: copy.notSure });
  if (!first) throw new Error('no Not sure button');
  await userEvent.click(first);
}

describe('AccountIntake', () => {
  it('saves to the account as well as the device while signed in', async () => {
    const runtime = await signedInRuntime();
    render(<AccountIntake runtime={runtime} reportHref="/report" exitHref="/dashboard" />);
    await answerFirstQuestionNotSure();
    await userEvent.click(screen.getByRole('button', { name: en.intake.save.saveNow }));
    await runtime.service.listAudits();
    const audits = await runtime.service.listAudits();
    expect(audits).toHaveLength(1);
    expect(audits[0]?.stored.answers.length).toBeGreaterThan(0);
    expect(runtime.active.get()).toBe(audits[0]?.id);
    expect(runtime.localStore.load()?.answers.length).toBeGreaterThan(0);
  });

  it('behaves like the plain Intake when signed out', async () => {
    const runtime = createMemoryRuntime();
    render(<AccountIntake runtime={runtime} reportHref="/report" exitHref="/dashboard" />);
    await answerFirstQuestionNotSure();
    await userEvent.click(screen.getByRole('button', { name: en.intake.save.saveNow }));
    expect(runtime.localStore.load()?.answers.length).toBeGreaterThan(0);
    expect(runtime.active.get()).toBeNull();
  });
});
