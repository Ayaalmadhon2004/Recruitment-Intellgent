import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONFIG_VERSION } from '@/domain/config';
import { known } from '@/fixtures/builders';
import { createMemoryStore } from '../store';
import { SAVE_DELAY_MS, useIntake } from './useIntake';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('useIntake', () => {
  it('starts empty and idle when nothing was saved', () => {
    const { result } = renderHook(() => useIntake(createMemoryStore()));
    expect(result.current.resumed).toBe(false);
    expect(result.current.saveStatus).toBe('idle');
    expect(result.current.overall.handled).toBe(0);
  });

  it('shows Saving then Saved, and writes once after the pause (debounced)', () => {
    const store = createMemoryStore();
    const { result } = renderHook(() => useIntake(store));
    act(() => result.current.answer('A1', 'private-university'));
    act(() => result.current.answer('A1', 'public-university'));
    expect(result.current.saveStatus).toBe('saving');
    expect(store.saves).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(SAVE_DELAY_MS);
    });
    expect(store.saves).toHaveLength(1);
    expect(store.saves[0]?.configVersion).toBe(CONFIG_VERSION);
    expect(result.current.saveStatus).toBe('saved');
  });

  it('Save now writes immediately', () => {
    const store = createMemoryStore();
    const { result } = renderHook(() => useIntake(store));
    act(() => result.current.toggleNotSure('B1'));
    act(() => result.current.saveNow());
    expect(store.saves).toHaveLength(1);
    expect(result.current.saveStatus).toBe('saved');
  });

  it('resumes answers, confirmed tags and the section from the store', () => {
    const store = createMemoryStore({
      configVersion: CONFIG_VERSION,
      answers: [known('A1', 'private-university', 'verified', 'high')],
      confirmedTagIds: ['A1'],
      sectionIndex: 2,
    });
    const { result } = renderHook(() => useIntake(store));
    expect(result.current.resumed).toBe(true);
    expect(result.current.versionChanged).toBe(false);
    expect(result.current.state.sectionIndex).toBe(2);
    expect(result.current.state.confirmedTagIds).toEqual(['A1']);
    expect(result.current.saveStatus).toBe('saved');
  });

  it('flags a saved audit from another config version and keeps its answers', () => {
    const store = createMemoryStore({
      configVersion: 'vri-config-0.0.1',
      answers: [known('A1', 'x')],
      confirmedTagIds: [],
      sectionIndex: 0,
    });
    const { result } = renderHook(() => useIntake(store));
    expect(result.current.versionChanged).toBe(true);
    expect(result.current.overall.handled).toBe(1);
  });

  it('stores the section so a reload resumes there', () => {
    const store = createMemoryStore();
    const first = renderHook(() => useIntake(store));
    act(() => first.result.current.goToSection(3));
    act(() => first.result.current.saveNow());
    const second = renderHook(() => useIntake(store));
    expect(second.result.current.state.sectionIndex).toBe(3);
  });

  it('writes pending changes when the page is hidden', () => {
    const store = createMemoryStore();
    const { result } = renderHook(() => useIntake(store));
    act(() => result.current.answer('A4', true));
    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });
    expect(store.saves).toHaveLength(1);
  });
});
