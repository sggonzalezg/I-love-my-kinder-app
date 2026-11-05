import { dayChipLabel, formatCountdown, formatLongDate, formatTime, toIsoDate } from '../dates';

describe('Spanish date helpers', () => {
  it('formats a long date as "Viernes 23 de octubre"', () => {
    expect(formatLongDate(new Date(2026, 9, 23))).toBe('Viernes 23 de octubre');
  });

  it('formats time as H:MM with tabular-friendly zero padding on minutes', () => {
    expect(formatTime(new Date(2026, 9, 24, 9, 5))).toBe('9:05');
  });

  it('labels today and yesterday in the day strip', () => {
    const today = new Date(2026, 9, 24, 10);
    expect(dayChipLabel(new Date(2026, 9, 24), today)).toBe('Hoy');
    expect(dayChipLabel(new Date(2026, 9, 23), today)).toBe('Ayer');
  });

  it('labels older days with short weekday and day number', () => {
    expect(dayChipLabel(new Date(2026, 9, 19), new Date(2026, 9, 24))).toBe('Lun 19');
  });

  it('formats the resend countdown as m:ss', () => {
    expect(formatCountdown(24)).toBe('0:24');
    expect(formatCountdown(5)).toBe('0:05');
  });

  it('builds a local ISO date without timezone shifts', () => {
    expect(toIsoDate(new Date(2026, 0, 3, 23, 30))).toBe('2026-01-03');
  });
});
