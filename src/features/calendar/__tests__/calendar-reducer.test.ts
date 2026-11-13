import { CALENDAR_ACTIONS, calendarReducer, initialCalendarState } from '../calendar-reducer';

const TODAY = new Date(2026, 9, 24);

describe('calendarReducer', () => {
  it('opens on the current month with nothing selected', () => {
    expect(initialCalendarState(TODAY)).toEqual({ year: 2026, month: 9, selectedDay: null, pastShown: false });
  });

  it('moves to the next month and clears the day and the past list', () => {
    const state = { year: 2026, month: 9, selectedDay: 13, pastShown: true };
    expect(calendarReducer(state, { type: CALENDAR_ACTIONS.MONTH_SHIFTED, step: 1 })).toEqual({
      year: 2026,
      month: 10,
      selectedDay: null,
      pastShown: false,
    });
  });

  it('crosses into the next year after December', () => {
    const state = initialCalendarState(new Date(2026, 11, 3));
    expect(calendarReducer(state, { type: CALENDAR_ACTIONS.MONTH_SHIFTED, step: 1 })).toMatchObject({ year: 2027, month: 0 });
  });

  it('crosses into the previous year before January', () => {
    const state = initialCalendarState(new Date(2027, 0, 3));
    expect(calendarReducer(state, { type: CALENDAR_ACTIONS.MONTH_SHIFTED, step: -1 })).toMatchObject({ year: 2026, month: 11 });
  });

  it('selects a tapped day', () => {
    const state = calendarReducer(initialCalendarState(TODAY), { type: CALENDAR_ACTIONS.DAY_TAPPED, day: 13 });
    expect(state.selectedDay).toBe(13);
  });

  it('unselects the day when it is tapped again', () => {
    const selected = { ...initialCalendarState(TODAY), selectedDay: 13 };
    expect(calendarReducer(selected, { type: CALENDAR_ACTIONS.DAY_TAPPED, day: 13 }).selectedDay).toBeNull();
  });

  it('goes back to the whole month', () => {
    const selected = { ...initialCalendarState(TODAY), selectedDay: 13 };
    expect(calendarReducer(selected, { type: CALENDAR_ACTIONS.WHOLE_MONTH_SHOWN }).selectedDay).toBeNull();
  });

  it('shows the past events of the month', () => {
    expect(calendarReducer(initialCalendarState(TODAY), { type: CALENDAR_ACTIONS.PAST_SHOWN }).pastShown).toBe(true);
  });

  it('goes back to the current month', () => {
    const later = { year: 2026, month: 11, selectedDay: 3, pastShown: false };
    expect(calendarReducer(later, { type: CALENDAR_ACTIONS.CURRENT_MONTH_SHOWN, today: TODAY })).toEqual(initialCalendarState(TODAY));
  });
});
