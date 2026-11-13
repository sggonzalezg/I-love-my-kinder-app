import { shownResult } from '@/data/use-async';

const FIRST_LOAD = { requestId: 'notices#0', data: ['first'], failed: false };

describe('shownResult', () => {
  it('shows the result of the current request', () => {
    expect(shownResult(FIRST_LOAD, 'notices#0', 'notices', false)).toBe(FIRST_LOAD);
  });

  it('shows nothing while a reload runs by default', () => {
    expect(shownResult(FIRST_LOAD, 'notices#1', 'notices', false)).toBeNull();
  });

  it('keeps the last good result while a reload of the same key runs when asked', () => {
    expect(shownResult(FIRST_LOAD, 'notices#1', 'notices', true)).toBe(FIRST_LOAD);
  });

  it('does not keep a failed result', () => {
    const failed = { requestId: 'notices#0', data: null, failed: true };

    expect(shownResult(failed, 'notices#1', 'notices', true)).toBeNull();
  });

  it('does not keep the result of another key', () => {
    expect(shownResult(FIRST_LOAD, 'other#0', 'other', true)).toBeNull();
  });

  it('shows nothing while waiting for a key', () => {
    expect(shownResult(FIRST_LOAD, null, null, true)).toBeNull();
  });
});
