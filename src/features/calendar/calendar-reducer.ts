export const CALENDAR_ACTIONS = {
  MONTH_SHIFTED: 'monthShifted',
  DAY_TAPPED: 'dayTapped',
  WHOLE_MONTH_SHOWN: 'wholeMonthShown',
  PAST_SHOWN: 'pastShown',
  CURRENT_MONTH_SHOWN: 'currentMonthShown',
} as const;

export interface CalendarState {
  year: number;
  month: number;
  selectedDay: number | null;
  pastShown: boolean;
}

export type CalendarAction =
  | { type: typeof CALENDAR_ACTIONS.MONTH_SHIFTED; step: 1 | -1 }
  | { type: typeof CALENDAR_ACTIONS.DAY_TAPPED; day: number }
  | { type: typeof CALENDAR_ACTIONS.WHOLE_MONTH_SHOWN }
  | { type: typeof CALENDAR_ACTIONS.PAST_SHOWN }
  | { type: typeof CALENDAR_ACTIONS.CURRENT_MONTH_SHOWN; today: Date };

export function initialCalendarState(today: Date): CalendarState {
  return { year: today.getFullYear(), month: today.getMonth(), selectedDay: null, pastShown: false };
}

export function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case CALENDAR_ACTIONS.MONTH_SHIFTED: {
      const shifted = new Date(state.year, state.month + action.step, 1);
      return { year: shifted.getFullYear(), month: shifted.getMonth(), selectedDay: null, pastShown: false };
    }
    case CALENDAR_ACTIONS.DAY_TAPPED:
      return { ...state, selectedDay: state.selectedDay === action.day ? null : action.day };
    case CALENDAR_ACTIONS.WHOLE_MONTH_SHOWN:
      return { ...state, selectedDay: null };
    case CALENDAR_ACTIONS.PAST_SHOWN:
      return { ...state, pastShown: true };
    case CALENDAR_ACTIONS.CURRENT_MONTH_SHOWN:
      return initialCalendarState(action.today);
  }
}
