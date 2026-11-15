import { CHAT_LIST_ACTIONS, INITIAL_CHAT_LIST_STATE, chatListInitialState, chatListReducer } from '../chat-list-reducer';

describe('chatListReducer', () => {
  it('starts on every chat', () => {
    expect(INITIAL_CHAT_LIST_STATE.filterKey).toBe('all');
  });

  it('starts on the chip a link asked for', () => {
    expect(chatListInitialState('noTeacher').filterKey).toBe('noTeacher');
  });

  it('starts on every chat when no chip was asked for', () => {
    expect(chatListInitialState(undefined).filterKey).toBe('all');
  });

  it('keeps the chip the director picked', () => {
    const state = chatListReducer(INITIAL_CHAT_LIST_STATE, { type: CHAT_LIST_ACTIONS.FILTER_SELECTED, key: 'noTeacher' });

    expect(state.filterKey).toBe('noTeacher');
  });
});
