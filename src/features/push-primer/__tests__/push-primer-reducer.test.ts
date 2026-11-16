import { PUSH_PRIMER_ACTIONS, initialPushPrimerState, pushPrimerReducer } from '@/features/push-primer/push-primer-reducer';

describe('pushPrimerReducer', () => {
  it('starts idle', () => {
    expect(initialPushPrimerState.activating).toBe(false);
  });

  it('shows the spinner while the permission and the token are asked', () => {
    const state = pushPrimerReducer(initialPushPrimerState, { type: PUSH_PRIMER_ACTIONS.ACTIVATION_STARTED });

    expect(state.activating).toBe(true);
  });

  it('goes back to idle when the activation ends, granted or not', () => {
    const activating = pushPrimerReducer(initialPushPrimerState, { type: PUSH_PRIMER_ACTIONS.ACTIVATION_STARTED });

    const state = pushPrimerReducer(activating, { type: PUSH_PRIMER_ACTIONS.ACTIVATION_FINISHED });

    expect(state.activating).toBe(false);
  });
});
