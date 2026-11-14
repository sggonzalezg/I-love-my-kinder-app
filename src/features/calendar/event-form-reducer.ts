import type { EventFormValues } from '@/lib/event-form';

export const EVENT_FORM_ACTIONS = {
  FORM_LOADED: 'formLoaded',
  FIELD_CHANGED: 'fieldChanged',
  DATE_SHEET_OPENED: 'dateSheetOpened',
  TIME_SHEET_OPENED: 'timeSheetOpened',
  SHEET_MONTH_SHIFTED: 'sheetMonthShifted',
  DRAFT_DATE_CHOSEN: 'draftDateChosen',
  DRAFT_TIME_CHANGED: 'draftTimeChanged',
  SHEET_CONFIRMED: 'sheetConfirmed',
  UNTIL_CLEARED: 'untilCleared',
  SHEET_CLOSED: 'sheetClosed',
  DISCARD_ASKED: 'discardAsked',
  DISCARD_CANCELLED: 'discardCancelled',
  RESIGN_ASKED: 'resignAsked',
  RESIGN_CANCELLED: 'resignCancelled',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type DateSheetKind = 'date' | 'until';
export type TimeSheetKind = 'start' | 'end';
export type SaveError = 'offline' | 'failed';

export interface SheetMonth {
  year: number;
  month: number;
}

export interface EventFormState {
  values: EventFormValues;
  initial: EventFormValues;
  loaded: boolean;
  sheet: DateSheetKind | TimeSheetKind | null;
  draftDate: string | null;
  draftTime: string;
  sheetMonth: SheetMonth;
  discardOpen: boolean;
  resignOpen: boolean;
  saving: boolean;
  saveError: SaveError | null;
}

export type EventFormAction =
  | { type: typeof EVENT_FORM_ACTIONS.FORM_LOADED; values: EventFormValues }
  | { type: typeof EVENT_FORM_ACTIONS.FIELD_CHANGED; values: Partial<EventFormValues> }
  | { type: typeof EVENT_FORM_ACTIONS.DATE_SHEET_OPENED; sheet: DateSheetKind; today: Date }
  | { type: typeof EVENT_FORM_ACTIONS.TIME_SHEET_OPENED; sheet: TimeSheetKind }
  | { type: typeof EVENT_FORM_ACTIONS.SHEET_MONTH_SHIFTED; step: 1 | -1 }
  | { type: typeof EVENT_FORM_ACTIONS.DRAFT_DATE_CHOSEN; date: string }
  | { type: typeof EVENT_FORM_ACTIONS.DRAFT_TIME_CHANGED; time: string }
  | { type: typeof EVENT_FORM_ACTIONS.SHEET_CONFIRMED }
  | { type: typeof EVENT_FORM_ACTIONS.UNTIL_CLEARED }
  | { type: typeof EVENT_FORM_ACTIONS.SHEET_CLOSED }
  | { type: typeof EVENT_FORM_ACTIONS.DISCARD_ASKED }
  | { type: typeof EVENT_FORM_ACTIONS.DISCARD_CANCELLED }
  | { type: typeof EVENT_FORM_ACTIONS.RESIGN_ASKED }
  | { type: typeof EVENT_FORM_ACTIONS.RESIGN_CANCELLED }
  | { type: typeof EVENT_FORM_ACTIONS.SAVE_STARTED }
  | { type: typeof EVENT_FORM_ACTIONS.SAVE_FAILED; offline: boolean };

export function initialEventFormState(values: EventFormValues): EventFormState {
  return {
    values,
    initial: values,
    loaded: false,
    sheet: null,
    draftDate: null,
    draftTime: values.startTime,
    sheetMonth: { year: 0, month: 0 },
    discardOpen: false,
    resignOpen: false,
    saving: false,
    saveError: null,
  };
}

function monthOf(isoDate: string | null, today: Date): SheetMonth {
  if (!isoDate) return { year: today.getFullYear(), month: today.getMonth() };
  const [year, month] = isoDate.split('-').map(Number);
  return { year, month: month - 1 };
}

function shiftMonth({ year, month }: SheetMonth, step: 1 | -1): SheetMonth {
  const next = new Date(year, month + step, 1);
  return { year: next.getFullYear(), month: next.getMonth() };
}

function confirmedValues(state: EventFormState): Partial<EventFormValues> {
  const { values, sheet, draftDate, draftTime } = state;
  if (sheet === 'start') return { startTime: draftTime };
  if (sheet === 'end') return { endTime: draftTime };
  if (!draftDate) return {};
  if (sheet === 'until') return { untilDate: values.date && draftDate > values.date ? draftDate : null };
  const untilStillAfter = values.untilDate !== null && values.untilDate > draftDate;
  return { date: draftDate, untilDate: untilStillAfter ? values.untilDate : null };
}

export function eventFormReducer(state: EventFormState, action: EventFormAction): EventFormState {
  switch (action.type) {
    case EVENT_FORM_ACTIONS.FORM_LOADED:
      return { ...initialEventFormState(action.values), loaded: true };
    case EVENT_FORM_ACTIONS.FIELD_CHANGED:
      return { ...state, values: { ...state.values, ...action.values }, saveError: null };
    case EVENT_FORM_ACTIONS.DATE_SHEET_OPENED: {
      const current = action.sheet === 'date' ? state.values.date : state.values.untilDate;
      return { ...state, sheet: action.sheet, draftDate: current, sheetMonth: monthOf(current ?? state.values.date, action.today) };
    }
    case EVENT_FORM_ACTIONS.TIME_SHEET_OPENED:
      return { ...state, sheet: action.sheet, draftTime: action.sheet === 'start' ? state.values.startTime : state.values.endTime };
    case EVENT_FORM_ACTIONS.SHEET_MONTH_SHIFTED:
      return { ...state, sheetMonth: shiftMonth(state.sheetMonth, action.step) };
    case EVENT_FORM_ACTIONS.DRAFT_DATE_CHOSEN:
      return { ...state, draftDate: action.date };
    case EVENT_FORM_ACTIONS.DRAFT_TIME_CHANGED:
      return { ...state, draftTime: action.time };
    case EVENT_FORM_ACTIONS.SHEET_CONFIRMED:
      return { ...state, values: { ...state.values, ...confirmedValues(state) }, sheet: null, saveError: null };
    case EVENT_FORM_ACTIONS.UNTIL_CLEARED:
      return { ...state, values: { ...state.values, untilDate: null }, sheet: null };
    case EVENT_FORM_ACTIONS.SHEET_CLOSED:
      return { ...state, sheet: null };
    case EVENT_FORM_ACTIONS.DISCARD_ASKED:
      return { ...state, discardOpen: true };
    case EVENT_FORM_ACTIONS.DISCARD_CANCELLED:
      return { ...state, discardOpen: false };
    case EVENT_FORM_ACTIONS.RESIGN_ASKED:
      return { ...state, resignOpen: true };
    case EVENT_FORM_ACTIONS.RESIGN_CANCELLED:
      return { ...state, resignOpen: false };
    case EVENT_FORM_ACTIONS.SAVE_STARTED:
      return { ...state, saving: true, saveError: null, resignOpen: false };
    case EVENT_FORM_ACTIONS.SAVE_FAILED:
      return { ...state, saving: false, saveError: action.offline ? 'offline' : 'failed' };
  }
}
