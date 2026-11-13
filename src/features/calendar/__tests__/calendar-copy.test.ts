import { monthHeading, reminderLine, selectedDayTitle, showPastLabel } from '../calendar-copy';

describe('calendar copy', () => {
  it('titles a tapped day with its weekday and number', () => {
    expect(selectedDayTitle(new Date(2026, 9, 13))).toBe('Martes 13');
  });

  it('says when the reminder goes out', () => {
    expect(reminderLine(new Date(2026, 9, 27, 18, 0))).toBe('Te recordamos el martes 27 a las 18:00.');
  });

  it('counts the past events of the month on the button', () => {
    expect(showPastLabel('octubre', 3)).toBe('Ver lo que ya pasó en octubre (3)');
  });
});

describe('monthHeading', () => {
  it('shows only the month in the current year', () => {
    expect(monthHeading(2026, 9, new Date(2026, 9, 24))).toBe('Octubre');
  });

  it('adds the year to a month of another year', () => {
    expect(monthHeading(2025, 11, new Date(2026, 9, 24))).toBe('Diciembre 2025');
  });
});
