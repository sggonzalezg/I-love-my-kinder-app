import { CHAT_NOTICE_ACTIONS, INITIAL_CHAT_NOTICE_STATE, chatNoticeReducer } from '../chat-notice-reducer';

describe('chatNoticeReducer', () => {
  it('starts unchecked', () => {
    expect(INITIAL_CHAT_NOTICE_STATE.checked).toBe(false);
  });

  it('checks and unchecks the box', () => {
    const checked = chatNoticeReducer(INITIAL_CHAT_NOTICE_STATE, { type: CHAT_NOTICE_ACTIONS.TOGGLED });

    expect([checked.checked, chatNoticeReducer(checked, { type: CHAT_NOTICE_ACTIONS.TOGGLED }).checked]).toEqual([true, false]);
  });

  it('saves and clears an earlier failure', () => {
    const state = chatNoticeReducer({ checked: true, saving: false, failed: true }, { type: CHAT_NOTICE_ACTIONS.SAVE_STARTED });

    expect(state).toEqual({ checked: true, saving: true, failed: false });
  });

  it('keeps the box checked when saving fails', () => {
    const state = chatNoticeReducer({ checked: true, saving: true, failed: false }, { type: CHAT_NOTICE_ACTIONS.SAVE_FAILED });

    expect(state).toEqual({ checked: true, saving: false, failed: true });
  });
});
