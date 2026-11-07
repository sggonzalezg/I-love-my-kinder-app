import type { OutingAnswer } from '@/lib/outing';
import {
  INITIAL_PERMISSION_STATE,
  PERMISSION_ACTIONS,
  decisionOf,
  outingPermissionReducer,
  type PermissionState,
} from '../outing-permission-reducer';

const SIGNED_ROW: OutingAnswer = {
  child_id: 'c1',
  decision: 'authorized',
  created_at: '2026-10-23T18:02:00',
  permission_version: 1,
  signer_name: 'Ana Rodríguez',
  signer_relationship: 'mother',
  signed_by: 'user-ana',
};

const confirming: PermissionState = { ...INITIAL_PERMISSION_STATE, confirm: { childId: 'c1', intent: 'authorize' } };

describe('outingPermissionReducer', () => {
  it('opens the confirm sheet for a child and an intent', () => {
    const state = outingPermissionReducer(INITIAL_PERMISSION_STATE, {
      type: PERMISSION_ACTIONS.CONFIRM_OPENED,
      childId: 'c1',
      intent: 'decline',
    });
    expect(state.confirm).toEqual({ childId: 'c1', intent: 'decline' });
  });

  it('closes the confirm sheet without saving anything', () => {
    const state = outingPermissionReducer(confirming, { type: PERMISSION_ACTIONS.CONFIRM_CLOSED });
    expect(state).toEqual(INITIAL_PERMISSION_STATE);
  });

  it('closes the sheet, marks the child as saving and clears an old failure when saving starts', () => {
    const failed = { ...confirming, failure: { childId: 'c1', reason: 'error' as const } };
    const state = outingPermissionReducer(failed, { type: PERMISSION_ACTIONS.SAVE_STARTED, childId: 'c1' });
    expect(state).toMatchObject({ confirm: null, savingChildId: 'c1', failure: null });
  });

  it('keeps the saved answer and shows the signed toast after an authorization', () => {
    const saving = { ...INITIAL_PERMISSION_STATE, savingChildId: 'c1' };
    const state = outingPermissionReducer(saving, { type: PERMISSION_ACTIONS.SAVE_SUCCEEDED, answer: SIGNED_ROW });
    expect(state).toMatchObject({ savingChildId: null, savedAnswers: [SIGNED_ROW], toastVisible: true, signedChildId: 'c1' });
  });

  it('keeps a decline without the signed toast', () => {
    const declined = { ...SIGNED_ROW, decision: 'declined' as const };
    const state = outingPermissionReducer(INITIAL_PERMISSION_STATE, { type: PERMISSION_ACTIONS.SAVE_SUCCEEDED, answer: declined });
    expect(state).toMatchObject({ savedAnswers: [declined], toastVisible: false, signedChildId: null });
  });

  it('records why a save failed for that child', () => {
    const saving = { ...INITIAL_PERMISSION_STATE, savingChildId: 'c1' };
    const state = outingPermissionReducer(saving, { type: PERMISSION_ACTIONS.SAVE_FAILED, childId: 'c1', reason: 'offline' });
    expect(state).toMatchObject({ savingChildId: null, failure: { childId: 'c1', reason: 'offline' } });
  });

  it('hides the toast', () => {
    const shown = { ...INITIAL_PERMISSION_STATE, toastVisible: true };
    expect(outingPermissionReducer(shown, { type: PERMISSION_ACTIONS.TOAST_HIDDEN }).toastVisible).toBe(false);
  });
});

describe('decisionOf', () => {
  it('maps each answer intent to the recorded decision', () => {
    expect(decisionOf('authorize')).toBe('authorized');
    expect(decisionOf('decline')).toBe('declined');
    expect(decisionOf('withdraw')).toBe('withdrawn');
  });
});
