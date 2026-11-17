import type { LoginDocumentKey, PendingLoginDocument } from '@/lib/consent';

export const LOGIN_CONSENT_STATUS = {
  LOADING: 'loading',
  LOAD_FAILED: 'loadFailed',
  READY: 'ready',
} as const;

export type LoginConsentStatus = (typeof LOGIN_CONSENT_STATUS)[keyof typeof LOGIN_CONSENT_STATUS];

export interface LoginConsentState {
  status: LoginConsentStatus;
  pending: PendingLoginDocument[];
  checked: LoginDocumentKey[];
  missing: LoginDocumentKey[];
  saved: LoginDocumentKey[];
  saving: boolean;
  saveFailed: boolean;
}

export const LOGIN_CONSENT_ACTIONS = {
  LOAD_STARTED: 'loadStarted',
  LOADED: 'loaded',
  LOAD_FAILED: 'loadFailed',
  BOX_TOGGLED: 'boxToggled',
  CONTINUE_REFUSED: 'continueRefused',
  SAVE_STARTED: 'saveStarted',
  DOCUMENT_SAVED: 'documentSaved',
  SAVE_FAILED: 'saveFailed',
} as const;

export type LoginConsentAction =
  | { type: typeof LOGIN_CONSENT_ACTIONS.LOAD_STARTED }
  | { type: typeof LOGIN_CONSENT_ACTIONS.LOADED; pending: PendingLoginDocument[] }
  | { type: typeof LOGIN_CONSENT_ACTIONS.LOAD_FAILED }
  | { type: typeof LOGIN_CONSENT_ACTIONS.BOX_TOGGLED; key: LoginDocumentKey }
  | { type: typeof LOGIN_CONSENT_ACTIONS.CONTINUE_REFUSED }
  | { type: typeof LOGIN_CONSENT_ACTIONS.SAVE_STARTED }
  | { type: typeof LOGIN_CONSENT_ACTIONS.DOCUMENT_SAVED; key: LoginDocumentKey }
  | { type: typeof LOGIN_CONSENT_ACTIONS.SAVE_FAILED };

export const initialLoginConsentState: LoginConsentState = {
  status: LOGIN_CONSENT_STATUS.LOADING,
  pending: [],
  checked: [],
  missing: [],
  saved: [],
  saving: false,
  saveFailed: false,
};

export function uncheckedDocuments(state: LoginConsentState): LoginDocumentKey[] {
  return state.pending.map((document) => document.key).filter((key) => !state.checked.includes(key));
}

function toggled(keys: LoginDocumentKey[], key: LoginDocumentKey): LoginDocumentKey[] {
  return keys.includes(key) ? keys.filter((each) => each !== key) : [...keys, key];
}

export function loginConsentReducer(state: LoginConsentState, action: LoginConsentAction): LoginConsentState {
  switch (action.type) {
    case LOGIN_CONSENT_ACTIONS.LOAD_STARTED:
      return { ...state, status: LOGIN_CONSENT_STATUS.LOADING };
    case LOGIN_CONSENT_ACTIONS.LOADED:
      return { ...state, status: LOGIN_CONSENT_STATUS.READY, pending: action.pending };
    case LOGIN_CONSENT_ACTIONS.LOAD_FAILED:
      return { ...state, status: LOGIN_CONSENT_STATUS.LOAD_FAILED };
    case LOGIN_CONSENT_ACTIONS.BOX_TOGGLED:
      if (state.saving) return state;
      return { ...state, checked: toggled(state.checked, action.key), missing: state.missing.filter((key) => key !== action.key) };
    case LOGIN_CONSENT_ACTIONS.CONTINUE_REFUSED:
      return { ...state, missing: uncheckedDocuments(state) };
    case LOGIN_CONSENT_ACTIONS.SAVE_STARTED:
      return { ...state, saving: true, saveFailed: false };
    case LOGIN_CONSENT_ACTIONS.DOCUMENT_SAVED:
      return { ...state, saved: [...state.saved, action.key] };
    case LOGIN_CONSENT_ACTIONS.SAVE_FAILED:
      return { ...state, saving: false, saveFailed: true };
    default:
      return state;
  }
}
