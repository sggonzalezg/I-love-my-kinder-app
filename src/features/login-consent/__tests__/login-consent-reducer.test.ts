import {
  initialLoginConsentState,
  LOGIN_CONSENT_ACTIONS,
  LOGIN_CONSENT_STATUS,
  loginConsentReducer,
  uncheckedDocuments,
  type LoginConsentState,
} from '@/features/login-consent/login-consent-reducer';

const BOTH_NEW = [
  { key: 'terms', updated: false },
  { key: 'privacy', updated: false },
] as const;

function readyState(overrides: Partial<LoginConsentState> = {}): LoginConsentState {
  return { ...initialLoginConsentState, status: LOGIN_CONSENT_STATUS.READY, pending: [...BOTH_NEW], ...overrides };
}

describe('loginConsentReducer', () => {
  it('starts loading with no box checked', () => {
    expect(initialLoginConsentState).toMatchObject({ status: LOGIN_CONSENT_STATUS.LOADING, checked: [] });
  });

  it('shows the documents to accept once they load', () => {
    const state = loginConsentReducer(initialLoginConsentState, { type: LOGIN_CONSENT_ACTIONS.LOADED, pending: [...BOTH_NEW] });
    expect(state).toMatchObject({ status: LOGIN_CONSENT_STATUS.READY, pending: BOTH_NEW });
  });

  it('shows the load error and goes back to loading on retry', () => {
    const failed = loginConsentReducer(initialLoginConsentState, { type: LOGIN_CONSENT_ACTIONS.LOAD_FAILED });
    expect(failed.status).toBe(LOGIN_CONSENT_STATUS.LOAD_FAILED);
    expect(loginConsentReducer(failed, { type: LOGIN_CONSENT_ACTIONS.LOAD_STARTED }).status).toBe(LOGIN_CONSENT_STATUS.LOADING);
  });

  it('checks and unchecks a box', () => {
    const checked = loginConsentReducer(readyState(), { type: LOGIN_CONSENT_ACTIONS.BOX_TOGGLED, key: 'terms' });
    expect(checked.checked).toEqual(['terms']);
    expect(loginConsentReducer(checked, { type: LOGIN_CONSENT_ACTIONS.BOX_TOGGLED, key: 'terms' }).checked).toEqual([]);
  });

  it('marks only the boxes still unchecked when Continuar is tapped without both', () => {
    const state = loginConsentReducer(readyState({ checked: ['terms'] }), { type: LOGIN_CONSENT_ACTIONS.CONTINUE_REFUSED });
    expect(state.missing).toEqual(['privacy']);
  });

  it('stops marking a box once it is checked', () => {
    const state = loginConsentReducer(readyState({ missing: ['terms', 'privacy'] }), { type: LOGIN_CONSENT_ACTIONS.BOX_TOGGLED, key: 'privacy' });
    expect(state.missing).toEqual(['terms']);
  });

  it('does not change the boxes while saving', () => {
    const saving = readyState({ checked: ['terms', 'privacy'], saving: true });
    expect(loginConsentReducer(saving, { type: LOGIN_CONSENT_ACTIONS.BOX_TOGGLED, key: 'terms' })).toBe(saving);
  });

  it('clears an earlier save failure when saving again', () => {
    const state = loginConsentReducer(readyState({ saveFailed: true }), { type: LOGIN_CONSENT_ACTIONS.SAVE_STARTED });
    expect(state).toMatchObject({ saving: true, saveFailed: false });
  });

  it('remembers each saved document so a retry does not record it twice', () => {
    const state = loginConsentReducer(readyState({ saving: true }), { type: LOGIN_CONSENT_ACTIONS.DOCUMENT_SAVED, key: 'terms' });
    expect(state.saved).toEqual(['terms']);
  });

  it('keeps the boxes checked when the save fails', () => {
    const state = loginConsentReducer(readyState({ checked: ['terms', 'privacy'], saving: true }), { type: LOGIN_CONSENT_ACTIONS.SAVE_FAILED });
    expect(state).toMatchObject({ saving: false, saveFailed: true, checked: ['terms', 'privacy'] });
  });
});

describe('uncheckedDocuments', () => {
  it('lists the pending documents whose box is not checked, in screen order', () => {
    expect(uncheckedDocuments(readyState({ checked: ['privacy'] }))).toEqual(['terms']);
  });

  it('is empty when every pending box is checked', () => {
    expect(uncheckedDocuments(readyState({ pending: [{ key: 'privacy', updated: true }], checked: ['privacy'] }))).toEqual([]);
  });
});
