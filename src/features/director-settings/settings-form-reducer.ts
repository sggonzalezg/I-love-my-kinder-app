import type { NurseryField, NurserySettings, ShiftTimeEdge } from '@/lib/director-settings';
import type { ShiftName } from '@/lib/shift';

export type SettingsFormStatus = 'editing' | 'saving' | 'failed';

export interface ShiftTimeSheet {
  shiftName: ShiftName;
  edge: ShiftTimeEdge;
  draftTime: string;
}

export interface SettingsFormState {
  edited: NurserySettings;
  timeSheet: ShiftTimeSheet | null;
  status: SettingsFormStatus;
}

export const SETTINGS_FORM_ACTIONS = {
  FIELD_CHANGED: 'fieldChanged',
  TIME_SHEET_OPENED: 'timeSheetOpened',
  DRAFT_TIME_CHANGED: 'draftTimeChanged',
  TIME_SHEET_CONFIRMED: 'timeSheetConfirmed',
  TIME_SHEET_CLOSED: 'timeSheetClosed',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type SettingsFormAction =
  | { type: typeof SETTINGS_FORM_ACTIONS.FIELD_CHANGED; field: NurseryField; value: string }
  | { type: typeof SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED; shiftName: ShiftName; edge: ShiftTimeEdge }
  | { type: typeof SETTINGS_FORM_ACTIONS.DRAFT_TIME_CHANGED; time: string }
  | { type: typeof SETTINGS_FORM_ACTIONS.TIME_SHEET_CONFIRMED }
  | { type: typeof SETTINGS_FORM_ACTIONS.TIME_SHEET_CLOSED }
  | { type: typeof SETTINGS_FORM_ACTIONS.SAVE_STARTED }
  | { type: typeof SETTINGS_FORM_ACTIONS.SAVE_FAILED };

/** Where the wheel starts for a shift that never had times: the usual hours of the mockup. */
const DEFAULT_SHIFT_TIMES: Record<ShiftName, Record<ShiftTimeEdge, string>> = {
  morning: { startTime: '08:00', endTime: '12:30' },
  afternoon: { startTime: '13:00', endTime: '18:00' },
};

export function initialSettingsFormState(saved: NurserySettings): SettingsFormState {
  return { edited: saved, timeSheet: null, status: 'editing' };
}

function withShiftTime(settings: NurserySettings, sheet: ShiftTimeSheet): NurserySettings {
  return {
    ...settings,
    shifts: settings.shifts.map((shift) => (shift.name === sheet.shiftName ? { ...shift, [sheet.edge]: sheet.draftTime } : shift)),
  };
}

export function settingsFormReducer(state: SettingsFormState, action: SettingsFormAction): SettingsFormState {
  switch (action.type) {
    case SETTINGS_FORM_ACTIONS.FIELD_CHANGED:
      if (state.status === 'saving') return state;
      return { ...state, edited: { ...state.edited, details: { ...state.edited.details, [action.field]: action.value } }, status: 'editing' };
    case SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED: {
      if (state.status === 'saving') return state;
      const shift = state.edited.shifts.find((candidate) => candidate.name === action.shiftName);
      const draftTime = shift?.[action.edge] ?? DEFAULT_SHIFT_TIMES[action.shiftName][action.edge];
      return { ...state, timeSheet: { shiftName: action.shiftName, edge: action.edge, draftTime } };
    }
    case SETTINGS_FORM_ACTIONS.DRAFT_TIME_CHANGED:
      return state.timeSheet ? { ...state, timeSheet: { ...state.timeSheet, draftTime: action.time } } : state;
    case SETTINGS_FORM_ACTIONS.TIME_SHEET_CONFIRMED:
      if (!state.timeSheet) return state;
      return { edited: withShiftTime(state.edited, state.timeSheet), timeSheet: null, status: 'editing' };
    case SETTINGS_FORM_ACTIONS.TIME_SHEET_CLOSED:
      return { ...state, timeSheet: null };
    case SETTINGS_FORM_ACTIONS.SAVE_STARTED:
      return { ...state, timeSheet: null, status: 'saving' };
    case SETTINGS_FORM_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'failed' };
  }
}
