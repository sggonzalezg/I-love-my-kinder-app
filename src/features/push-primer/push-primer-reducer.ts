export interface PushPrimerState {
  activating: boolean;
}

export const PUSH_PRIMER_ACTIONS = {
  ACTIVATION_STARTED: 'activationStarted',
  ACTIVATION_FINISHED: 'activationFinished',
} as const;

export type PushPrimerAction =
  | { type: typeof PUSH_PRIMER_ACTIONS.ACTIVATION_STARTED }
  | { type: typeof PUSH_PRIMER_ACTIONS.ACTIVATION_FINISHED };

export const initialPushPrimerState: PushPrimerState = { activating: false };

export function pushPrimerReducer(state: PushPrimerState, action: PushPrimerAction): PushPrimerState {
  switch (action.type) {
    case PUSH_PRIMER_ACTIONS.ACTIVATION_STARTED:
      return { activating: true };
    case PUSH_PRIMER_ACTIONS.ACTIVATION_FINISHED:
      return { activating: false };
    default:
      return state;
  }
}
