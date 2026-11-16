export const STEP_MOVES = { forward: 'forward', back: 'back' } as const;
export type StepMove = (typeof STEP_MOVES)[keyof typeof STEP_MOVES];

export interface FirstSignInState {
  /** Fixed on the first load, so answering a child never drops the step on screen. */
  stepChildIds: string[] | null;
  stepIndex: number;
  lastMove: StepMove;
  savedToastVisible: boolean;
}

export const FIRST_SIGN_IN_ACTIONS = {
  STEPS_FIXED: 'stepsFixed',
  NEXT_STEP: 'nextStep',
  PREVIOUS_STEP: 'previousStep',
  ANSWER_SAVED: 'answerSaved',
  TOAST_HIDDEN: 'toastHidden',
} as const;

export type FirstSignInAction =
  | { type: typeof FIRST_SIGN_IN_ACTIONS.STEPS_FIXED; stepChildIds: string[] }
  | {
      type:
        | typeof FIRST_SIGN_IN_ACTIONS.NEXT_STEP
        | typeof FIRST_SIGN_IN_ACTIONS.PREVIOUS_STEP
        | typeof FIRST_SIGN_IN_ACTIONS.ANSWER_SAVED
        | typeof FIRST_SIGN_IN_ACTIONS.TOAST_HIDDEN;
    };

export const initialFirstSignInState: FirstSignInState = { stepChildIds: null, stepIndex: 0, lastMove: STEP_MOVES.forward, savedToastVisible: false };

export function firstSignInReducer(state: FirstSignInState, action: FirstSignInAction): FirstSignInState {
  switch (action.type) {
    case FIRST_SIGN_IN_ACTIONS.STEPS_FIXED:
      return state.stepChildIds ? state : { ...state, stepChildIds: action.stepChildIds };
    case FIRST_SIGN_IN_ACTIONS.NEXT_STEP: {
      const lastIndex = (state.stepChildIds?.length ?? 1) - 1;
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, lastIndex), lastMove: STEP_MOVES.forward };
    }
    case FIRST_SIGN_IN_ACTIONS.PREVIOUS_STEP:
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0), lastMove: STEP_MOVES.back };
    case FIRST_SIGN_IN_ACTIONS.ANSWER_SAVED:
      return { ...state, savedToastVisible: true };
    case FIRST_SIGN_IN_ACTIONS.TOAST_HIDDEN:
      return { ...state, savedToastVisible: false };
  }
}
