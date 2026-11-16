import {
  FIRST_SIGN_IN_ACTIONS,
  STEP_MOVES,
  firstSignInReducer,
  initialFirstSignInState,
  type FirstSignInState,
} from '@/features/first-sign-in-authorizations/first-sign-in-reducer';

const TWO_STEPS: FirstSignInState = { ...initialFirstSignInState, stepChildIds: ['mateo', 'lucia'] };

describe('firstSignInReducer', () => {
  it('starts on the first step with no steps fixed yet', () => {
    expect(initialFirstSignInState).toEqual({ stepChildIds: null, stepIndex: 0, lastMove: STEP_MOVES.forward, savedToastVisible: false });
  });

  it('fixes the steps on the first load', () => {
    const state = firstSignInReducer(initialFirstSignInState, { type: FIRST_SIGN_IN_ACTIONS.STEPS_FIXED, stepChildIds: ['mateo', 'lucia'] });
    expect(state.stepChildIds).toEqual(['mateo', 'lucia']);
  });

  it('keeps the steps of the first load when a reload answers a child', () => {
    const state = firstSignInReducer(TWO_STEPS, { type: FIRST_SIGN_IN_ACTIONS.STEPS_FIXED, stepChildIds: ['lucia'] });
    expect(state.stepChildIds).toEqual(['mateo', 'lucia']);
  });

  it('goes on to the next child', () => {
    const state = firstSignInReducer(TWO_STEPS, { type: FIRST_SIGN_IN_ACTIONS.NEXT_STEP });
    expect(state).toMatchObject({ stepIndex: 1, lastMove: STEP_MOVES.forward });
  });

  it('does not go past the last child', () => {
    const last = { ...TWO_STEPS, stepIndex: 1 };
    expect(firstSignInReducer(last, { type: FIRST_SIGN_IN_ACTIONS.NEXT_STEP }).stepIndex).toBe(1);
  });

  it('goes back to the previous child', () => {
    const last = { ...TWO_STEPS, stepIndex: 1 };
    expect(firstSignInReducer(last, { type: FIRST_SIGN_IN_ACTIONS.PREVIOUS_STEP })).toMatchObject({ stepIndex: 0, lastMove: STEP_MOVES.back });
  });

  it('does not go back from the first child', () => {
    expect(firstSignInReducer(TWO_STEPS, { type: FIRST_SIGN_IN_ACTIONS.PREVIOUS_STEP }).stepIndex).toBe(0);
  });

  it('shows the "Guardado" toast after an answer is saved', () => {
    expect(firstSignInReducer(TWO_STEPS, { type: FIRST_SIGN_IN_ACTIONS.ANSWER_SAVED }).savedToastVisible).toBe(true);
  });

  it('hides the toast when its time is up', () => {
    const shown = { ...TWO_STEPS, savedToastVisible: true };
    expect(firstSignInReducer(shown, { type: FIRST_SIGN_IN_ACTIONS.TOAST_HIDDEN }).savedToastVisible).toBe(false);
  });
});
