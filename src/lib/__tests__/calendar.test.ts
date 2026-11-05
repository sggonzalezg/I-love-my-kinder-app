import { buildMonthGrid, eventTypeLabel, monthTitle } from '../calendar';

describe('month grid (F10)', () => {
  it('starts weeks on Monday and pads with nulls', () => {
    // October 2026 starts on a Thursday.
    const weeks = buildMonthGrid(2026, 9);
    expect(weeks[0]).toEqual([null, null, null, 1, 2, 3, 4]);
  });

  it('ends with the last day of the month', () => {
    const weeks = buildMonthGrid(2026, 9);
    const last = weeks[weeks.length - 1];
    expect(last.filter((d) => d !== null).pop()).toBe(31);
    expect(last).toHaveLength(7);
  });

  it('titles the month in Spanish', () => {
    expect(monthTitle(2026, 9)).toBe('Octubre');
  });

  it('labels event types with the client words', () => {
    expect(eventTypeLabel('outing')).toBe('Salida');
    expect(eventTypeLabel('no_classes')).toBe('Sin clases');
    expect(eventTypeLabel('celebration')).toBe('Fiesta o acto');
  });
});
