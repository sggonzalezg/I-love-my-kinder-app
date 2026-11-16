import { AUTHORIZATION_STATES, type AuthorizationAnswer } from '@/lib/child-authorizations';

export const AUTHORIZATION_SHEETS = { accept: 'accept', read: 'read', withdraw: 'withdraw' } as const;
export type AuthorizationSheet = (typeof AUTHORIZATION_SHEETS)[keyof typeof AUTHORIZATION_SHEETS];

export interface AuthorizationQuestionState {
  answer: AuthorizationAnswer;
  previousAnswer: AuthorizationAnswer;
  sheet: AuthorizationSheet | null;
  saving: boolean;
  failed: boolean;
}

export const AUTHORIZATION_QUESTION_ACTIONS = {
  YES_TAPPED: 'yesTapped',
  NO_TAPPED: 'noTapped',
  READ_TAPPED: 'readTapped',
  SWITCH_TOGGLED: 'switchToggled',
  SHEET_CLOSED: 'sheetClosed',
  ACCEPT_CONFIRMED: 'acceptConfirmed',
  WITHDRAW_CONFIRMED: 'withdrawConfirmed',
  SAVE_SUCCEEDED: 'saveSucceeded',
  SAVE_FAILED: 'saveFailed',
  SYNCED: 'synced',
} as const;

type SimpleActionType = Exclude<(typeof AUTHORIZATION_QUESTION_ACTIONS)[keyof typeof AUTHORIZATION_QUESTION_ACTIONS], typeof AUTHORIZATION_QUESTION_ACTIONS.SYNCED>;

export type AuthorizationQuestionAction =
  | { type: SimpleActionType }
  | { type: typeof AUTHORIZATION_QUESTION_ACTIONS.SYNCED; answer: AuthorizationAnswer };

export function initialAuthorizationQuestionState(answer: AuthorizationAnswer): AuthorizationQuestionState {
  return { answer, previousAnswer: answer, sheet: null, saving: false, failed: false };
}

/** The new answer shows before the save ends; a failed save puts the previous one back. */
function startSaving(state: AuthorizationQuestionState, answer: AuthorizationAnswer, sheet: AuthorizationSheet | null): AuthorizationQuestionState {
  return { answer, previousAnswer: state.answer, sheet, saving: true, failed: false };
}

export function authorizationQuestionReducer(state: AuthorizationQuestionState, action: AuthorizationQuestionAction): AuthorizationQuestionState {
  if (state.saving && action.type !== AUTHORIZATION_QUESTION_ACTIONS.SAVE_SUCCEEDED && action.type !== AUTHORIZATION_QUESTION_ACTIONS.SAVE_FAILED) {
    return state;
  }
  switch (action.type) {
    case AUTHORIZATION_QUESTION_ACTIONS.YES_TAPPED:
      return { ...state, sheet: AUTHORIZATION_SHEETS.accept, failed: false };
    case AUTHORIZATION_QUESTION_ACTIONS.NO_TAPPED:
      return startSaving(state, AUTHORIZATION_STATES.denied, null);
    case AUTHORIZATION_QUESTION_ACTIONS.READ_TAPPED:
      return { ...state, sheet: AUTHORIZATION_SHEETS.read };
    case AUTHORIZATION_QUESTION_ACTIONS.SWITCH_TOGGLED:
      return { ...state, sheet: state.answer === AUTHORIZATION_STATES.granted ? AUTHORIZATION_SHEETS.withdraw : AUTHORIZATION_SHEETS.accept, failed: false };
    case AUTHORIZATION_QUESTION_ACTIONS.SHEET_CLOSED:
      return { ...state, sheet: null };
    case AUTHORIZATION_QUESTION_ACTIONS.ACCEPT_CONFIRMED:
      return startSaving(state, AUTHORIZATION_STATES.granted, AUTHORIZATION_SHEETS.accept);
    case AUTHORIZATION_QUESTION_ACTIONS.WITHDRAW_CONFIRMED:
      return startSaving(state, AUTHORIZATION_STATES.denied, null);
    case AUTHORIZATION_QUESTION_ACTIONS.SAVE_SUCCEEDED:
      return { ...state, sheet: null, saving: false };
    case AUTHORIZATION_QUESTION_ACTIONS.SAVE_FAILED:
      return { ...state, answer: state.previousAnswer, sheet: null, saving: false, failed: true };
    case AUTHORIZATION_QUESTION_ACTIONS.SYNCED:
      return { ...state, answer: action.answer, previousAnswer: action.answer };
  }
}
