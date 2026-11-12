import { addHygiene, removeHygiene, type HygieneKind, type HygieneType, type MealAmount, type MealKey, type RoutineDraft } from '@/lib/routine';

export type RestField = 'restStart' | 'restEnd';
export type TimeSheetPurpose = 'hygieneAdd' | 'hygieneEdit' | RestField;

export interface TimeSheetState {
  purpose: TimeSheetPurpose;
  time: string;
  entryIndex?: number;
}

export interface RoutineLogState {
  index: number;
  drafts: Record<string, RoutineDraft>;
  hygieneType: HygieneType;
  sheet: TimeSheetState | null;
  showRangeError: boolean;
  toast: string | null;
}

export const ROUTINE_LOG_ACTIONS = {
  DRAFT_STARTED: 'draftStarted',
  MEAL_CHOSEN: 'mealChosen',
  REST_SET: 'restSet',
  NO_SLEEP_TOGGLED: 'noSleepToggled',
  HYGIENE_KIND_CHOSEN: 'hygieneKindChosen',
  HYGIENE_TYPE_CHOSEN: 'hygieneTypeChosen',
  HYGIENE_ADDED: 'hygieneAdded',
  HYGIENE_RETIMED: 'hygieneRetimed',
  HYGIENE_REMOVED: 'hygieneRemoved',
  NOTE_CHANGED: 'noteChanged',
  SHEET_OPENED: 'sheetOpened',
  SHEET_TIME_CHANGED: 'sheetTimeChanged',
  SHEET_CLOSED: 'sheetClosed',
  SAVE_BLOCKED: 'saveBlocked',
  CHILD_SHOWN: 'childShown',
  TOAST_HIDDEN: 'toastHidden',
} as const;

export type RoutineLogAction =
  | { type: typeof ROUTINE_LOG_ACTIONS.DRAFT_STARTED; childId: string; draft: RoutineDraft }
  | { type: typeof ROUTINE_LOG_ACTIONS.MEAL_CHOSEN; childId: string; meal: MealKey; amount: MealAmount }
  | { type: typeof ROUTINE_LOG_ACTIONS.REST_SET; childId: string; field: RestField; time: string }
  | { type: typeof ROUTINE_LOG_ACTIONS.NO_SLEEP_TOGGLED; childId: string }
  | { type: typeof ROUTINE_LOG_ACTIONS.HYGIENE_KIND_CHOSEN; childId: string; kind: HygieneKind }
  | { type: typeof ROUTINE_LOG_ACTIONS.HYGIENE_TYPE_CHOSEN; hygieneType: HygieneType }
  | { type: typeof ROUTINE_LOG_ACTIONS.HYGIENE_ADDED; childId: string; time: string }
  | { type: typeof ROUTINE_LOG_ACTIONS.HYGIENE_RETIMED; childId: string; entryIndex: number; time: string }
  | { type: typeof ROUTINE_LOG_ACTIONS.HYGIENE_REMOVED; childId: string; entryIndex: number }
  | { type: typeof ROUTINE_LOG_ACTIONS.NOTE_CHANGED; childId: string; notes: string }
  | { type: typeof ROUTINE_LOG_ACTIONS.SHEET_OPENED; sheet: TimeSheetState }
  | { type: typeof ROUTINE_LOG_ACTIONS.SHEET_TIME_CHANGED; time: string }
  | { type: typeof ROUTINE_LOG_ACTIONS.SHEET_CLOSED }
  | { type: typeof ROUTINE_LOG_ACTIONS.SAVE_BLOCKED }
  | { type: typeof ROUTINE_LOG_ACTIONS.CHILD_SHOWN; index: number; toast: string | null }
  | { type: typeof ROUTINE_LOG_ACTIONS.TOAST_HIDDEN };

const DEFAULT_HYGIENE_TYPE: HygieneType = 'pee';

export function initialRoutineLogState(index: number): RoutineLogState {
  return { index, drafts: {}, hygieneType: DEFAULT_HYGIENE_TYPE, sheet: null, showRangeError: false, toast: null };
}

function updateDraft(state: RoutineLogState, childId: string, change: (draft: RoutineDraft) => RoutineDraft): RoutineLogState {
  const draft = state.drafts[childId];
  if (!draft) return state;
  return { ...state, drafts: { ...state.drafts, [childId]: change(draft) } };
}

export function routineLogReducer(state: RoutineLogState, action: RoutineLogAction): RoutineLogState {
  switch (action.type) {
    case ROUTINE_LOG_ACTIONS.DRAFT_STARTED:
      if (state.drafts[action.childId]) return state;
      return { ...state, drafts: { ...state.drafts, [action.childId]: action.draft } };
    case ROUTINE_LOG_ACTIONS.MEAL_CHOSEN:
      return updateDraft(state, action.childId, (draft) => ({ ...draft, meals: { ...draft.meals, [action.meal]: action.amount } }));
    case ROUTINE_LOG_ACTIONS.REST_SET:
      return { ...updateDraft(state, action.childId, (draft) => ({ ...draft, [action.field]: action.time })), sheet: null };
    case ROUTINE_LOG_ACTIONS.NO_SLEEP_TOGGLED:
      return updateDraft(state, action.childId, (draft) => ({ ...draft, noRest: !draft.noRest }));
    case ROUTINE_LOG_ACTIONS.HYGIENE_KIND_CHOSEN:
      return updateDraft(state, action.childId, (draft) => ({ ...draft, hygieneKind: action.kind }));
    case ROUTINE_LOG_ACTIONS.HYGIENE_TYPE_CHOSEN:
      return { ...state, hygieneType: action.hygieneType };
    case ROUTINE_LOG_ACTIONS.HYGIENE_ADDED: {
      const added = updateDraft(state, action.childId, (draft) => addHygiene(draft, { kind: draft.hygieneKind, type: state.hygieneType, time: action.time }));
      return { ...added, sheet: null, hygieneType: DEFAULT_HYGIENE_TYPE };
    }
    case ROUTINE_LOG_ACTIONS.HYGIENE_RETIMED: {
      const retimed = updateDraft(state, action.childId, (draft) => {
        const entry = draft.hygiene[action.entryIndex];
        return addHygiene(removeHygiene(draft, action.entryIndex), { ...entry, time: action.time });
      });
      return { ...retimed, sheet: null };
    }
    case ROUTINE_LOG_ACTIONS.HYGIENE_REMOVED:
      return { ...updateDraft(state, action.childId, (draft) => removeHygiene(draft, action.entryIndex)), sheet: null };
    case ROUTINE_LOG_ACTIONS.NOTE_CHANGED:
      return updateDraft(state, action.childId, (draft) => ({ ...draft, notes: action.notes }));
    case ROUTINE_LOG_ACTIONS.SHEET_OPENED:
      return { ...state, sheet: action.sheet };
    case ROUTINE_LOG_ACTIONS.SHEET_TIME_CHANGED:
      return state.sheet ? { ...state, sheet: { ...state.sheet, time: action.time } } : state;
    case ROUTINE_LOG_ACTIONS.SHEET_CLOSED:
      return { ...state, sheet: null };
    case ROUTINE_LOG_ACTIONS.SAVE_BLOCKED:
      return { ...state, showRangeError: true };
    case ROUTINE_LOG_ACTIONS.CHILD_SHOWN:
      return { ...state, index: action.index, toast: action.toast, showRangeError: false, sheet: null, hygieneType: DEFAULT_HYGIENE_TYPE };
    case ROUTINE_LOG_ACTIONS.TOAST_HIDDEN:
      return { ...state, toast: null };
  }
}
