import {
  AUTHORIZATION_QUESTION_ACTIONS,
  AUTHORIZATION_SHEETS,
  authorizationQuestionReducer,
  initialAuthorizationQuestionState,
  type AuthorizationQuestionState,
} from '@/components/AuthorizationQuestion/authorization-question-reducer';
import { AUTHORIZATION_STATES } from '@/lib/child-authorizations';

const unanswered = initialAuthorizationQuestionState(AUTHORIZATION_STATES.unanswered);
const granted = initialAuthorizationQuestionState(AUTHORIZATION_STATES.granted);
const denied = initialAuthorizationQuestionState(AUTHORIZATION_STATES.denied);

function savingYes(): AuthorizationQuestionState {
  const withSheet = authorizationQuestionReducer(unanswered, { type: AUTHORIZATION_QUESTION_ACTIONS.YES_TAPPED });
  return authorizationQuestionReducer(withSheet, { type: AUTHORIZATION_QUESTION_ACTIONS.ACCEPT_CONFIRMED });
}

describe('authorizationQuestionReducer', () => {
  it('opens the full text with "Autorizo" on "Sí, autorizo" without answering yet', () => {
    const next = authorizationQuestionReducer(unanswered, { type: AUTHORIZATION_QUESTION_ACTIONS.YES_TAPPED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.unanswered, sheet: AUTHORIZATION_SHEETS.accept, saving: false });
  });

  it('keeps the question unanswered when the sheet is cancelled', () => {
    const withSheet = authorizationQuestionReducer(unanswered, { type: AUTHORIZATION_QUESTION_ACTIONS.YES_TAPPED });

    const next = authorizationQuestionReducer(withSheet, { type: AUTHORIZATION_QUESTION_ACTIONS.SHEET_CLOSED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.unanswered, sheet: null });
  });

  it('shows yes and starts saving on "Autorizo", keeping the sheet for its spinner', () => {
    expect(savingYes()).toMatchObject({ answer: AUTHORIZATION_STATES.granted, sheet: AUTHORIZATION_SHEETS.accept, saving: true });
  });

  it('does not close the sheet while saving', () => {
    const next = authorizationQuestionReducer(savingYes(), { type: AUTHORIZATION_QUESTION_ACTIONS.SHEET_CLOSED });

    expect(next.sheet).toBe(AUTHORIZATION_SHEETS.accept);
  });

  it('closes the sheet once saved and keeps the answer', () => {
    const next = authorizationQuestionReducer(savingYes(), { type: AUTHORIZATION_QUESTION_ACTIONS.SAVE_SUCCEEDED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.granted, sheet: null, saving: false, failed: false });
  });

  it('goes back to the previous answer and flags the error when saving fails', () => {
    const next = authorizationQuestionReducer(savingYes(), { type: AUTHORIZATION_QUESTION_ACTIONS.SAVE_FAILED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.unanswered, sheet: null, saving: false, failed: true });
  });

  it('saves "No autorizo" at once with no sheet', () => {
    const next = authorizationQuestionReducer(unanswered, { type: AUTHORIZATION_QUESTION_ACTIONS.NO_TAPPED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.denied, sheet: null, saving: true });
  });

  it('opens the text only on "Ver texto completo"', () => {
    const next = authorizationQuestionReducer(granted, { type: AUTHORIZATION_QUESTION_ACTIONS.READ_TAPPED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.granted, sheet: AUTHORIZATION_SHEETS.read });
  });

  it('asks to withdraw when the switch goes off from yes', () => {
    const next = authorizationQuestionReducer(granted, { type: AUTHORIZATION_QUESTION_ACTIONS.SWITCH_TOGGLED });

    expect(next.sheet).toBe(AUTHORIZATION_SHEETS.withdraw);
  });

  it('opens the full text with "Autorizo" when the switch goes on from no', () => {
    const next = authorizationQuestionReducer(denied, { type: AUTHORIZATION_QUESTION_ACTIONS.SWITCH_TOGGLED });

    expect(next.sheet).toBe(AUTHORIZATION_SHEETS.accept);
  });

  it('shows no and starts saving when the withdrawal is confirmed', () => {
    const withSheet = authorizationQuestionReducer(granted, { type: AUTHORIZATION_QUESTION_ACTIONS.SWITCH_TOGGLED });

    const next = authorizationQuestionReducer(withSheet, { type: AUTHORIZATION_QUESTION_ACTIONS.WITHDRAW_CONFIRMED });

    expect(next).toMatchObject({ answer: AUTHORIZATION_STATES.denied, sheet: null, saving: true, previousAnswer: AUTHORIZATION_STATES.granted });
  });

  it('clears an earlier error on a new answer', () => {
    const failed = authorizationQuestionReducer(savingYes(), { type: AUTHORIZATION_QUESTION_ACTIONS.SAVE_FAILED });

    const next = authorizationQuestionReducer(failed, { type: AUTHORIZATION_QUESTION_ACTIONS.NO_TAPPED });

    expect(next.failed).toBe(false);
  });

  it('takes a newer answer from the screen when not saving', () => {
    const next = authorizationQuestionReducer(unanswered, { type: AUTHORIZATION_QUESTION_ACTIONS.SYNCED, answer: AUTHORIZATION_STATES.granted });

    expect(next.answer).toBe(AUTHORIZATION_STATES.granted);
  });

  it('ignores the screen answer while saving', () => {
    const next = authorizationQuestionReducer(savingYes(), { type: AUTHORIZATION_QUESTION_ACTIONS.SYNCED, answer: AUTHORIZATION_STATES.unanswered });

    expect(next.answer).toBe(AUTHORIZATION_STATES.granted);
  });
});
